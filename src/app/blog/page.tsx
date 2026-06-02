import React from 'react';
import { Metadata } from 'next';
import BlogDirectoryView from '@/features/blog/components/BlogDirectoryView';
import { db } from '@/lib/db';
import { blogPosts as staticBlogPosts } from '@/data/posts';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Blog | GlobalWebify',
  description: 'Read the latest insights and strategies for web development and digital marketing.',
};

interface Props {
  searchParams?: { page?: string };
}

export default async function BlogPage({ searchParams }: Props) {
  let dbPosts: any[] = [];
  try {
    dbPosts = await db.blogPost.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  } catch (error) {
    console.error("Could not fetch blog posts from database:", error);
  }

  // Merge database posts with static posts. Deduplicate by slug.
  const allPosts = [...dbPosts, ...staticBlogPosts];
  const uniquePostsMap = new Map();
  allPosts.forEach(post => {
    const normSlug = post.slug.startsWith('/blog/') ? post.slug : `/blog/${post.slug}`;
    if (!uniquePostsMap.has(normSlug)) {
      uniquePostsMap.set(normSlug, {
        ...post,
        slug: normSlug
      });
    }
  });

  const mergedPosts = Array.from(uniquePostsMap.values());

  // Pagination calculation
  const currentPage = searchParams?.page ? parseInt(searchParams.page, 10) : 1;
  const postsPerPage = 8;
  const totalPosts = mergedPosts.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage) || 1;

  // Validate page number bounds
  const validPage = Math.max(1, Math.min(currentPage, totalPages));

  // Slice posts for current page
  const startIndex = (validPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const paginatedPosts = mergedPosts.slice(startIndex, endIndex);

  return (
    <BlogDirectoryView 
      posts={paginatedPosts} 
      currentPage={validPage} 
      totalPages={totalPages} 
    />
  );
}
