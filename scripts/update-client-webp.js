const fs = require('fs');
const path = require('path');

const FILE_PATH = path.join(__dirname, '../src/app/portfolio/PortfolioClient.tsx');

let content = fs.readFileSync(FILE_PATH, 'utf8');

// Replace all instances of '.png"' or ".png" with '.webp"'
content = content.replace(/\.png"/g, '.webp"');
content = content.replace(/\.png'/g, '.webp\'');

fs.writeFileSync(FILE_PATH, content, 'utf8');
console.log('Successfully updated image extensions to .webp in PortfolioClient.tsx!');
