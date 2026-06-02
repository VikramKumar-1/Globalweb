const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const PORTFOLIO_DIR = path.join(__dirname, '../public/portfolio');

async function optimize() {
  if (!fs.existsSync(PORTFOLIO_DIR)) {
    console.log('Portfolio directory does not exist.');
    return;
  }

  const files = fs.readdirSync(PORTFOLIO_DIR);
  const webpFiles = files.filter(f => f.endsWith('.webp'));

  console.log(`Found ${webpFiles.length} WebP files to optimize.`);
  
  let totalSaved = 0;

  for (const file of webpFiles) {
    const filePath = path.join(PORTFOLIO_DIR, file);
    const tempPath = path.join(PORTFOLIO_DIR, `temp_${file}`);

    try {
      const statsBefore = fs.statSync(filePath);
      const sizeBefore = statsBefore.size;

      const buffer = fs.readFileSync(filePath);
      const image = sharp(buffer);
      const metadata = await image.metadata();

      let pipeline = image;
      if (metadata.width > 800) {
        console.log(`Resizing ${file} from width ${metadata.width}px to 800px`);
        pipeline = pipeline.resize({ width: 800 });
      } else {
        console.log(`Image ${file} width is ${metadata.width}px, no resizing needed.`);
      }

      await pipeline
        .webp({ quality: 75, effort: 4 })
        .toFile(tempPath);

      const statsAfter = fs.statSync(tempPath);
      const sizeAfter = statsAfter.size;

      if (sizeAfter < sizeBefore) {
        fs.unlinkSync(filePath);
        fs.renameSync(tempPath, filePath);
        const saved = sizeBefore - sizeAfter;
        totalSaved += saved;
        console.log(`✓ Optimized ${file}: ${(sizeBefore / 1024).toFixed(1)}KB -> ${(sizeAfter / 1024).toFixed(1)}KB (Saved ${(saved / 1024).toFixed(1)}KB / ${((saved / sizeBefore) * 100).toFixed(1)}%)`);
      } else {
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        console.log(`- Skipped ${file} (temp was larger/equal to original: ${(sizeAfter / 1024).toFixed(1)}KB vs ${(sizeBefore / 1024).toFixed(1)}KB)`);
      }
    } catch (e) {
      if (fs.existsSync(tempPath)) {
        try { fs.unlinkSync(tempPath); } catch (_) {}
      }
      console.error(`✗ Failed to optimize ${file}:`, e.message);
    }
  }

  console.log(`Finished optimization. Total saved space: ${(totalSaved / (1024 * 1024)).toFixed(2)} MB`);
}

optimize().catch(err => console.error(err));
