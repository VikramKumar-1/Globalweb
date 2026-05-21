const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// ==========================================
// LIST OF WEBSITES TO CAPTURE
// Add the URLs and desired filenames here:
// ==========================================
const websites = [
  { name: 'fortemigration', url: 'https://www.fortemigration.com.au/' },
  { name: 'artival', url: 'https://artival.in/' },
  { name: 'pyoras', url: 'https://pyoras.com/' },
  { name: 'rsrfoodstuff', url: 'https://rsrfoodstuff.com/' },
  { name: 'futurenxt', url: 'https://futurenxt.io/index.php' },
];

const OUTPUT_DIR = path.join(__dirname, '../public/portfolio');

async function captureScreenshots() {
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`Created output directory: ${OUTPUT_DIR}`);
  }

  console.log('Starting browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  // Set standard desktop viewport width
  await page.setViewport({ width: 1440, height: 900 });

  for (const site of websites) {
    console.log(`\nNavigating to: ${site.url}`);
    try {
      // Go to URL and wait until network is idle
      await page.goto(site.url, { 
        waitUntil: 'networkidle2', 
        timeout: 60000 
      });

      // Wait a little extra for lazy-loaded images or animations
      await new Promise(resolve => setTimeout(resolve, 2000));

      const outputPath = path.join(OUTPUT_DIR, `${site.name}.png`);
      console.log(`Saving full-page screenshot to: ${outputPath}`);

      await page.screenshot({ 
        path: outputPath, 
        fullPage: true 
      });

      console.log(`✓ Successfully captured ${site.name}`);
    } catch (error) {
      console.error(`✗ Failed to capture ${site.name}:`, error.message);
    }
  }

  await browser.close();
  console.log('\nAll captures completed!');
}

captureScreenshots().catch(err => {
  console.error('Error during screen capture:', err);
});
