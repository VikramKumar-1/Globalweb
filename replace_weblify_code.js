const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    if (f === 'node_modules' || f === '.git' || f === '.next') return;
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

walkDir(path.join(__dirname, 'src'), function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.match(/weblify/i)) {
      content = content.replace(/weblify/gi, match => {
        // preserve casing
        if (match === 'Weblify') return 'Webify';
        if (match === 'weblify') return 'webify';
        if (match === 'WEBLIFY') return 'WEBIFY';
        return match[0] === 'W' ? 'Webify' : 'webify';
      });
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Updated codebase file: ' + filePath);
    }
  }
});
