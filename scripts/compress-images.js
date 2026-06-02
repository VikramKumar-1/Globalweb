const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const PORTFOLIO_DIR = path.join(__dirname, '../public/portfolio');

async function compress() {
  if (!fs.existsSync(PORTFOLIO_DIR)) {
    console.log('Portfolio directory does not exist.');
    return;
  }

  const files = fs.readdirSync(PORTFOLIO_DIR);
  const pngFiles = files.filter(f => f.endsWith('.png'));

  console.log(`Found ${pngFiles.length} PNG files to compress.`);

  for (const file of pngFiles) {
    const inputPath = path.join(PORTFOLIO_DIR, file);
    const outputName = file.replace('.png', '.webp');
    const outputPath = path.join(PORTFOLIO_DIR, outputName);

    console.log(`Compressing ${file} -> ${outputName}`);
    try {
      await sharp(inputPath)
        .webp({ quality: 80, effort: 4 })
        .toFile(outputPath);

      console.log(`✓ Compressed ${outputName}`);
      
      // Delete original PNG to save space
      fs.unlinkSync(inputPath);
      console.log(`Deleted original PNG: ${file}`);
    } catch (e) {
      console.error(`✗ Failed to compress ${file}:`, e.message);
    }
  }

  console.log('All image compressions completed!');
}

compress().catch(err => console.error(err));
