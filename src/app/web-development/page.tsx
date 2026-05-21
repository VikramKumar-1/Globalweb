import { Metadata } from 'next';
import WebDevClient from './WebDevClient';
import { db } from '@/lib/db';
import { replaceLocation } from '@/lib/replaceLocation';
import fs from 'fs';
import path from 'path';

export const revalidate = 3600; // Enable ISR cache (purged instantly via revalidatePath when CMS saves changes)

// 🚀 Automatic server-side sync of our custom premium wave asset
try {
  const sourcePath = "C:\\Users\\vikur\\.gemini\\antigravity\\brain\\5359d0dc-a535-4c31-a7ae-e01009de1174\\web_dev_banner_bg_1779106518831.png";
  const destDir = path.join(process.cwd(), 'public');
  const destPath = path.join(destDir, 'web-dev-banner-bg.png');
  
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destPath);
    console.log("Successfully synced premium wave banner asset to public folder!");
  }
} catch (error) {
  console.error("Auto-sync asset copy error:", error);
}

export async function generateMetadata(): Promise<Metadata> {
  try {
    const pageData = await db.servicePage.findFirst({
      where: { slug: { in: ['web-development', '/web-development'] } }
    });
    if (!pageData) return {};
    
    const locationName = "";
    const title = replaceLocation(pageData.seoTitle || pageData.title || '', locationName);
    const description = replaceLocation(pageData.seoDescription || '', locationName);
    
    return {
      title: title,
      description: description,
      keywords: pageData.seoKeywords ? pageData.seoKeywords.split(',').map(k => k.trim()) : undefined
    };
  } catch (e) {
    return {};
  }
}

export default async function WebDevelopmentPage() {
  const pageData = await db.servicePage.findFirst({
    where: { slug: { in: ['web-development', '/web-development'] } }
  });

  const subMenus = await db.servicePage.findMany({
    where: { 
      category: 'website', 
      isActive: true,
      slug: { notIn: ['web-development', '/web-development'] }
    },
    select: { title: true, slug: true, seoDescription: true, heroDescription: true, content: true, image: true },
    orderBy: { createdAt: 'desc' }
  });

  const locationName = "";
  let faqs: { question: string; answer: string }[] = [];
  let rawContent = pageData?.content ?? '';

  if (rawContent) {
    const match = rawContent.match(/<!-- FAQ_DATA: (.*?) -->/);
    if (match) {
      try {
        const rawFaqs = JSON.parse(match[1]);
        if (Array.isArray(rawFaqs)) {
          faqs = rawFaqs
            .map((f: any) => ({
              question: replaceLocation(f.question || '', locationName),
              answer: replaceLocation(f.answer || '', locationName),
            }))
            .filter((f) => f.question.trim() !== '' && f.answer.trim() !== '');
        }
        rawContent = rawContent.replace(match[0], '');
      } catch (e) {
        console.error("Failed to parse FAQ data", e);
      }
    }
  }

  const cleanedPageData = pageData ? {
    ...pageData,
    title:           pageData.title            ? replaceLocation(pageData.title, locationName) : '',
    contentTitle:    pageData.contentTitle     ? replaceLocation(pageData.contentTitle, locationName) : null,
    seoTitle:        pageData.seoTitle         ? replaceLocation(pageData.seoTitle, locationName) : null,
    heroDescription: pageData.heroDescription  ? replaceLocation(pageData.heroDescription, locationName) : null,
    seoDescription:  pageData.seoDescription   ? replaceLocation(pageData.seoDescription, locationName) : null,
    content:         replaceLocation(rawContent, locationName),
  } : null;

  const cleanedSubMenus = subMenus.map(menu => ({
    ...menu,
    title: replaceLocation(menu.title, locationName),
    heroDescription: menu.heroDescription ? replaceLocation(menu.heroDescription, locationName) : null,
    seoDescription: menu.seoDescription ? replaceLocation(menu.seoDescription, locationName) : null,
    content: menu.content ? replaceLocation(menu.content, locationName) : null,
  }));
  
  return <WebDevClient subMenus={cleanedSubMenus} pageData={cleanedPageData} faqs={faqs} />;
}
