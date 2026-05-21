import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    let logs = [];
    
    // 1. Service Pages
    const services = await db.servicePage.findMany();
    for (const s of services) {
      let updated = false;
      let data: any = {};
      
      if ((s.title && s.title.includes('Website Maintenance - Standard')) || (s.content && s.content.includes('Website Maintenance - Standard'))) {
        if (s.title) data.title = s.title.replace(' - Standard', '');
        if (s.content) data.content = s.content.replace(/Website Maintenance - Standard/g, 'Website Maintenance');
        updated = true;
      }
      
      const fields: (keyof typeof s)[] = ['title', 'content', 'seoTitle', 'seoDescription', 'heroDescription'];
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
        await db.servicePage.update({ where: { id: s.id }, data });
        logs.push('Updated ServicePage: ' + s.slug);
      }
    }

    // 2. Blog Posts
    const posts = await db.blogPost.findMany();
    for (const p of posts) {
      let updated = false;
      let data: any = {};
      const fields: (keyof typeof p)[] = ['title', 'summary', 'content', 'seoTitle', 'seoDescription'];
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
        await db.blogPost.update({ where: { id: p.id }, data });
        logs.push('Updated BlogPost: ' + p.slug);
      }
    }

    return NextResponse.json({ success: true, logs });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
