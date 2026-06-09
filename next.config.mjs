import fs from 'fs';
import path from 'path';

// Clean up deprecated [city] directory to prevent routing conflicts
const cityDir = path.join(process.cwd(), 'src', 'app', '[city]');
if (fs.existsSync(cityDir)) {
  try {
    fs.rmSync(cityDir, { recursive: true, force: true });
    console.log('Successfully deleted deprecated [city] directory');
  } catch (err) {
    console.error('Failed to delete deprecated [city] directory:', err);
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'globalwebify.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.globalwebify.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
