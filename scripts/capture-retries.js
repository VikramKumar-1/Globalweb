const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const websites = [
  { name: 'dealsonprofit', url: 'https://dealsonprofit.com/' },
  { name: 'indokosovo', url: 'https://ikcoc.org/' }
];

const OUTPUT_DIR = path.join(__dirname, '../public/portfolio');

async function capture() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  for (const site of websites) {
    console.log(`Navigating to ${site.url}`);
    try {
      await page.setViewport({ width: 1440, height: 900 });
      await page.goto(site.url, { waitUntil: 'networkidle2', timeout: 90000 });
      await new Promise(r => setTimeout(r, 4000));
      
      const outputPath = path.join(OUTPUT_DIR, `${site.name}.png`);
      if (site.name === 'dealsonprofit') {
        // Set viewport height to 3500 so it captures a long viewport but doesn't crash on fullPage screenshot
        await page.setViewport({ width: 1440, height: 3500 });
        await page.screenshot({ path: outputPath, fullPage: false });
      } else {
        await page.screenshot({ path: outputPath, fullPage: true });
      }
      console.log(`✓ Captured ${site.name}`);
    } catch (e) {
      console.log(`✗ Failed ${site.name}: ${e.message}`);
    }
  }
  await browser.close();
}

capture().catch(err => console.error(err));
