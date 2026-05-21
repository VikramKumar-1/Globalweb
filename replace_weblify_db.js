const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Updating ServicePages...');
  const services = await prisma.servicePage.findMany();
  for (const s of services) {
    let updated = false;
    let data = {};
    
    // 1. Fix "Website Maintenance - Standard"
    if (s.title && s.title.includes('Website Maintenance - Standard')) {
      data.title = s.title.replace(' - Standard', '');
      updated = true;
    }
    
    // 2. Replace Weblify in titles, descriptions, seo metadata, content
    const fields = ['title', 'content', 'seoTitle', 'seoDescription', 'heroDescription'];
    for (const f of fields) {
      const val = data[f] !== undefined ? data[f] : s[f];
      if (val && typeof val === 'string' && val.match(/weblify/i)) {
        data[f] = val.replace(/weblify/gi, match => {
          if (match === 'Weblify') return 'Webify';
          if (match === 'weblify') return 'webify';
          if (match === 'WEBLIFY') return 'WEBIFY';
          return match[0] === 'W' ? 'Webify' : 'webify';
        });
        updated = true;
      }
    }
    
    if (updated) {
      await prisma.servicePage.update({ where: { id: s.id }, data });
      console.log('Updated DB ServicePage: ' + s.slug);
    }
  }

  console.log('Updating BlogPosts...');
  const posts = await prisma.blogPost.findMany();
  for (const p of posts) {
    let updated = false;
    let data = {};
    const fields = ['title', 'summary', 'content', 'seoTitle', 'seoDescription'];
    for (const f of fields) {
      const val = data[f] !== undefined ? data[f] : p[f];
      if (val && typeof val === 'string' && val.match(/weblify/i)) {
        data[f] = val.replace(/weblify/gi, match => {
          if (match === 'Weblify') return 'Webify';
          if (match === 'weblify') return 'webify';
          if (match === 'WEBLIFY') return 'WEBIFY';
          return match[0] === 'W' ? 'Webify' : 'webify';
        });
        updated = true;
      }
    }
    if (updated) {
      await prisma.blogPost.update({ where: { id: p.id }, data });
      console.log('Updated DB BlogPost: ' + p.slug);
    }
  }
}

main().then(() => console.log('DB Update complete.')).catch(console.error).finally(() => prisma.$disconnect());
