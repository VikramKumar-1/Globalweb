import React from 'react';
import BlogPostForm from '@/features/admin/components/blogs/BlogPostForm';

export default function NewBlogPostPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <h2 className="text-xl md:text-2xl font-black text-gray-900 font-poppins uppercase tracking-tight">
          Write Blog Post
        </h2>
        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
          Publish a new article to the GlobalWebify blog index
        </p>
      </div>

      <BlogPostForm />
    </div>
  );
}
