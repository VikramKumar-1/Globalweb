'use server';

import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getSubdomainContent(pageType: string) {
  try {
    const content = await db.subdomainContent.findUnique({
      where: { pageType }
    });
    return content;
  } catch (error) {
    console.error("Failed to fetch subdomain content", error);
    return null;
  }
}

export async function saveSubdomainContent(data: {
  pageType: string;
  title?: string;
  heroTitle?: string;
  heroDescription?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  content: string;
}) {
  try {
    await requireAdmin();
    
    await db.subdomainContent.upsert({
      where: { pageType: data.pageType },
      update: {
        title: data.title,
        heroTitle: data.heroTitle,
        heroDescription: data.heroDescription,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        seoKeywords: data.seoKeywords,
        content: data.content,
      },
      create: {
        pageType: data.pageType,
        title: data.title,
        heroTitle: data.heroTitle,
        heroDescription: data.heroDescription,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        seoKeywords: data.seoKeywords,
        content: data.content,
      }
    });

    // We can't revalidate every possible subdomain easily, but we can revalidate the global paths 
    // and layout/page structures. Next.js App Router revalidation will clear cache across all hosts
    // if using path-based revalidation in most setups.
    if (data.pageType === 'homepage') {
      revalidatePath('/', 'page');
    } else {
      revalidatePath('/[slug]', 'page');
    }

    return { success: true };
  } catch (error: any) {
    console.error("Failed to save subdomain content", error);
    return { success: false, error: error.message };
  }
}
