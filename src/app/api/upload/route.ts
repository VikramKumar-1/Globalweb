import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Read the file data into a buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Check if we should use local storage instead of Cloudinary
    if (process.env.STORAGE_PROVIDER === 'local') {
      const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      
      // Ensure the uploads directory exists
      try {
        await mkdir(uploadDir, { recursive: true });
      } catch (err) {
        // Ignore if directory already exists
      }

      const filePath = path.join(uploadDir, filename);
      await writeFile(filePath, buffer);

      return NextResponse.json({
        success: true,
        url: `/uploads/${filename}`,
      });
    }

    // Default: Upload to Cloudinary using a stream
    const result: any = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { 
          folder: 'global-weblify/uploads', // Places images in this specific folder
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      
      // End the stream with the buffer
      uploadStream.end(buffer);
    });

    // Return the secure URL from Cloudinary
    return NextResponse.json({
      success: true,
      url: result.secure_url,
    });
  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error during upload' },
      { status: 500 }
    );
  }
}

