const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const websites = [
  // Original 5
  { name: 'fortemigration', url: 'https://www.fortemigration.com.au/' },
  { name: 'artival', url: 'https://artival.in/' },
  { name: 'pyoras', url: 'https://pyoras.com/' },
  { name: 'rsrfoodstuff', url: 'https://rsrfoodstuff.com/' },
  { name: 'futurenxt', url: 'https://futurenxt.io/index.php' },

  // New 24 Informative websites
  { name: 'veltrivo', url: 'https://veltrivo.com/' },
  { name: 'ethnoenvironjournal', url: 'https://ethnoenvironjournal.com/public_html/index' },
  { name: 'gangotristeels', url: 'https://gangotristeels.com/' },
  { name: 'saragroup', url: 'https://saragroup.ind.in/' },
  { name: 'tarotcardreader', url: 'https://tarotcardreaderhealerauthenticquinsoumya.com/' },
  { name: 'saltandsea', url: 'https://saltandsea.co.in/' },
  { name: 'artsandprojects', url: 'https://artsandprojects.in/' },
  { name: 'jindaltel', url: 'https://jindaltel.com/' },
  { name: 'dealsonprofit', url: 'https://dealsonprofit.com/' },
  { name: 'yembroos', url: 'https://yembroos.com/' },
  { name: 'southindiacabs', url: 'https://southindiacabs.info/' },
  { name: 'bellainitiis', url: 'https://bellainitiis.com/' },
  { name: 'amnutsandspices', url: 'https://amnutsandspices.in/' },
  { name: 'goldpecash', url: 'https://goldpecash.com/' },
  { name: 'iiqsolutions', url: 'https://iiqsolutions.com/' },
  { name: 'reinadiamonds', url: 'https://reinadiamonds.com/' },
  { name: 'healthilotus', url: 'https://healthilotus.com/' },
  { name: 'signompliance', url: 'https://signompliance.com/' },
  { name: 'multithread', url: 'https://www.multithread.co.in/' },
  { name: 'omnioverseas', url: 'https://omnioverseas.com/' },
  { name: 'varanasimai', url: 'https://varanasimai.com/' },
  { name: 'manbhavansevasamiti', url: 'https://manbhavansevasamiti.in/' },
  { name: 'digitalmarkethics', url: 'https://digitechmarkethics.com/' },
  { name: 'indokosovo', url: 'https://ikcoc.org/' }
];

const OUTPUT_DIR = path.join(__dirname, '../public/portfolio');

async function captureScreenshots() {
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
  await page.setViewport({ width: 1440, height: 900 });

  for (const site of websites) {
    console.log(`\nNavigating to: ${site.url}`);
    try {
      await page.goto(site.url, { 
        waitUntil: 'networkidle2', 
        timeout: 45000 
      });

      // Wait 3 seconds for animations and elements to settle
      await new Promise(resolve => setTimeout(resolve, 3000));

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
