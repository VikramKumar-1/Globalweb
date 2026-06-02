const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const websites = [
  { name: 'orbiteyes', url: 'https://orbiteyes.in/' },
  { name: 'drkumarvishal', url: 'https://drkumarvishal.com/' },
  { name: 'healthpointranchi', url: 'https://healthpointranchi.com/' },
  { name: 'rpshospital', url: 'https://rpshospital.com/' },
  { name: 'acs', url: 'https://acs-jn.com/' },
  { name: 'kaveri', url: 'https://kaveri-nextjs.vercel.app/' },
  { name: 'kelvinecoproducts', url: 'https://kelvinecoproducts.com/' },
  { name: 'elevatehrservices', url: 'https://elevate-hrservices.com/' },
  { name: 'documantraa', url: 'https://documantraa.in/crm/login.php' }
];

const OUTPUT_DIR = path.join(__dirname, '../public/portfolio');

async function capture() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  for (const site of websites) {
    console.log(`\nNavigating to: ${site.url}`);
    try {
      await page.setViewport({ width: 1440, height: 900 });
      await page.goto(site.url, { waitUntil: 'networkidle2', timeout: 90000 });
      await new Promise(r => setTimeout(r, 4000));
      
      const outputPath = path.join(OUTPUT_DIR, `${site.name}.png`);
      
      // Let's capture with fullPage: true
      await page.screenshot({ path: outputPath, fullPage: true });
      console.log(`✓ Captured ${site.name}`);
    } catch (e) {
      console.log(`✗ Failed ${site.name}: ${e.message}`);
      // Fallback: try capturing without fullPage if it was a sizing issue
      try {
        console.log(`Retrying standard height capture for ${site.name}...`);
        await page.setViewport({ width: 1440, height: 1800 });
        const outputPath = path.join(OUTPUT_DIR, `${site.name}.png`);
        await page.screenshot({ path: outputPath, fullPage: false });
        console.log(`✓ Captured ${site.name} (standard height)`);
      } catch (retryErr) {
        console.log(`✗ Failed retry for ${site.name}: ${retryErr.message}`);
      }
    }
  }
  await browser.close();
}

capture().catch(err => console.error(err));
