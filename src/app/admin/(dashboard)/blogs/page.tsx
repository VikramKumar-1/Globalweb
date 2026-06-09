import React from 'react';
import { Metadata } from 'next';
import { db } from '@/lib/db';
import BlogListClient from '@/features/admin/components/blogs/BlogListClient';

export const dynamic = 'force-dynamic';

export default async function AdminBlogsPage() {
  let posts: any[] = [];
  
  try {
    posts = await db.blogPost.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  } catch (error) {
    console.error('Failed to query blogs:', error);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <h2 className="text-xl md:text-2xl font-black text-gray-900 font-poppins uppercase tracking-tight">
          Blog Posts CMS
        </h2>
        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
          Manage blog articles, publication state, and search engine SEO metadata
        </p>
      </div>

      <BlogListClient posts={posts} />
    </div>
  );
}
