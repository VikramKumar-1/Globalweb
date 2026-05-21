'use server';

import { db } from '@/lib/db';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function saveService(formData: {
  id?: number;
  title: string;
  contentTitle?: string;
  slug: string;
  category: string;
  seoTitle?: string;
  seoDescription?: string;
  heroDescription?: string;
  seoKeywords?: string;
  content: string;
  image?: string;
  isActive?: boolean;
}) {
  const data = {
    title: formData.title,
    contentTitle: formData.contentTitle || null,
    slug: formData.slug.startsWith('/') ? formData.slug : `/${formData.slug}`,
    category: formData.category,
    seoTitle: formData.seoTitle || null,
    seoDescription: formData.seoDescription || null,
    heroDescription: formData.heroDescription || null,
    seoKeywords: formData.seoKeywords || null,
    content: formData.content,
    image: formData.image || null,
    isActive: formData.isActive ?? true,
  };

  let savedRecord;
  if (formData.id) {
    // Update existing service page
    savedRecord = await db.servicePage.update({
      where: { id: formData.id },
      data,
    });
  } else {
    // Create new service page
    savedRecord = await db.servicePage.create({
      data,
    });
  }

  // Trigger path revalidations so updates appear instantly without full rebuilds
  const slugPath = data.slug.startsWith('/') ? data.slug : `/${data.slug}`;
  revalidatePath('/');
  revalidatePath(slugPath);
  revalidatePath('/web-development');
  revalidatePath('/digital-marketing');
  revalidatePath('/branding-pr');
  revalidatePath('/sitemap.ts');
  revalidatePath('/[slug]');
  revalidatePath('/admin/services');
  revalidateTag('services');
  
  return { success: true, id: savedRecord.id, slug: savedRecord.slug };
}

export async function deleteService(id: number) {
  const service = await db.servicePage.findUnique({
    where: { id },
  });

  if (service) {
    await db.servicePage.delete({
      where: { id },
    });
    
    // Clear cache of deleted slug
    revalidatePath('/');
    revalidatePath(service.slug);
    revalidatePath('/web-development');
    revalidatePath('/digital-marketing');
    revalidatePath('/branding-pr');
    revalidatePath('/[slug]');
  }

  revalidatePath('/admin/services');
  revalidateTag('services');
}

export async function toggleServiceStatus(id: number, active: boolean) {
  await db.servicePage.update({
    where: { id },
    data: { isActive: active },
  });
  
  const service = await db.servicePage.findUnique({
    where: { id },
    select: { slug: true }
  });
  
  if (service) {
    revalidatePath('/');
    revalidatePath(service.slug);
    revalidatePath('/web-development');
    revalidatePath('/digital-marketing');
    revalidatePath('/branding-pr');
    revalidatePath('/[slug]');
  }
  
  revalidatePath('/admin/services');
  revalidateTag('services');
}
