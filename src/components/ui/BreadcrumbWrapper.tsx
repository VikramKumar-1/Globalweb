import { db } from '@/lib/db';
import BreadcrumbClientWrapper from './BreadcrumbClientWrapper';

export default async function BreadcrumbWrapper() {
  let dynamicPages: any[] = [];
  try {
    const servicePages = await db.servicePage.findMany({
      select: { slug: true, title: true, category: true }
    });
    const blogPosts = await db.blogPost.findMany({
      select: { slug: true, title: true }
    });
    dynamicPages = [
      ...servicePages,
      ...blogPosts.map(p => ({
        slug: p.slug,
        title: p.title,
        category: 'blog'
      }))
    ];
  } catch (error) {
    console.error('Failed to fetch dynamic pages for breadcrumbs', error);
  }

  return <BreadcrumbClientWrapper dynamicPages={dynamicPages} />;
}
