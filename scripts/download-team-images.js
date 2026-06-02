const fs = require('fs');
const path = require('path');

const TARGET_URL = 'https://globalwebify.com/team';
const BASE_URL = 'https://globalwebify.com';
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

async function downloadFile(url, destPath) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`Failed to download ${url}: ${res.status} ${res.statusText}`);
      return false;
    }
    const buffer = await res.arrayBuffer();
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.writeFileSync(destPath, Buffer.from(buffer));
    console.log(`✓ Downloaded: ${url} -> ${path.relative(process.cwd(), destPath)}`);
    return true;
  } catch (err) {
    console.error(`Error downloading ${url}:`, err.message);
    return false;
  }
}

async function main() {
  console.log(`Fetching page: ${TARGET_URL}...`);
  let html;
  try {
    const res = await fetch(TARGET_URL);
    if (!res.ok) {
      throw new Error(`Failed to fetch page: ${res.status} ${res.statusText}`);
    }
    html = await res.text();
  } catch (err) {
    console.error(`Failed to fetch the target page:`, err.message);
    process.exit(1);
  }

  // Set to collect unique image URLs
  const imageUrls = new Set();

  // 1. Find all img src attributes
  const imgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
  let match;
  while ((match = imgRegex.exec(html)) !== null) {
    imageUrls.add(match[1]);
  }

  // 2. Find all data-member-image attributes (specific to team page)
  const dataMemberImgRegex = /data-member-image=["']([^"']+)["']/gi;
  while ((match = dataMemberImgRegex.exec(html)) !== null) {
    imageUrls.add(match[1]);
  }

  // 3. Find background-image: url(...) in style attributes or stylesheet declarations
  const bgUrlRegex = /url\(["']?([^"')]+)["']?\)/gi;
  while ((match = bgUrlRegex.exec(html)) !== null) {
    const url = match[1];
    // Filter out data:URIs or external web fonts
    if (!url.startsWith('data:') && !url.startsWith('http') && !url.includes('fonts.gstatic.com')) {
      imageUrls.add(url);
    }
  }

  // Convert URLs to absolute and determine local paths
  const downloadTasks = [];
  
  for (let rawUrl of imageUrls) {
    // Clean URL (remove query parameters, hashes)
    let cleanUrl = rawUrl.split('?')[0].split('#')[0];
    
    // Skip external URLs or invalid paths
    if (cleanUrl.startsWith('http') && !cleanUrl.startsWith(BASE_URL)) {
      continue;
    }
    if (cleanUrl.startsWith('data:')) {
      continue;
    }

    // Decode URL-encoded characters (like %20 to spaces)
    const decodedUrl = decodeURIComponent(cleanUrl);

    // Formulate absolute URL
    let absoluteUrl;
    if (cleanUrl.startsWith('http')) {
      absoluteUrl = cleanUrl;
    } else if (cleanUrl.startsWith('/')) {
      absoluteUrl = BASE_URL + cleanUrl;
    } else {
      absoluteUrl = BASE_URL + '/' + cleanUrl;
    }

    // Determine local destination path under the public directory
    let localRelativePath = decodedUrl.startsWith('/') ? decodedUrl.substring(1) : decodedUrl;
    
    // For this codebase, Next.js serves files in the 'public' directory at root.
    // If the path starts with 'public/', we strip it, but if it starts with 'assets/', we keep it.
    if (localRelativePath.startsWith('public/')) {
      localRelativePath = localRelativePath.substring(7);
    }
    
    const destPath = path.join(PUBLIC_DIR, localRelativePath);

    downloadTasks.push({ url: absoluteUrl, dest: destPath });
  }

  console.log(`Found ${downloadTasks.length} unique image resources to download.`);

  let successCount = 0;
  for (const task of downloadTasks) {
    const success = await downloadFile(task.url, task.dest);
    if (success) successCount++;
  }

  console.log(`\nDownload complete! Successful: ${successCount}/${downloadTasks.length}`);
}

main();
