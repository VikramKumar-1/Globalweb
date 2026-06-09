import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET(req: NextRequest) {
  const fileUrl = req.nextUrl.searchParams.get('url');

  if (!fileUrl) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
  }

  const mimeMap: Record<string, string> = {
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
  };

  try {
    let fileBuffer: Buffer;
    let ext: string;

    // Local file (e.g. /uploads/filename.pdf) — used on Hostinger with STORAGE_PROVIDER=local
    if (fileUrl.startsWith('/')) {
      const filePath = path.join(process.cwd(), 'public', fileUrl);
      fileBuffer = await readFile(filePath);
      ext = path.extname(filePath).toLowerCase();
    } else {
      // Remote URL (Cloudinary or any other host) — proxy fetch
      const response = await fetch(fileUrl);
      if (!response.ok) {
        return NextResponse.json({ error: 'Failed to fetch file' }, { status: 502 });
      }
      const arrayBuffer = await response.arrayBuffer();
      fileBuffer = Buffer.from(arrayBuffer);
      ext = path.extname(new URL(fileUrl).pathname).toLowerCase();
    }

    const contentType = mimeMap[ext] || 'application/octet-stream';

    return new NextResponse(fileBuffer as unknown as BodyInit, {
      headers: {
        'Content-Type': contentType,
        'Content-Length': fileBuffer.length.toString(),
        'Content-Disposition': 'inline',
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=86400',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error('Preview file error:', error);
    return NextResponse.json({ error: 'Failed to load file' }, { status: 500 });
  }
}
