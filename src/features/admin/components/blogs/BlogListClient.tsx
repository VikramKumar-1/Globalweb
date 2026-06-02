'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Edit2, Trash2, Plus, Search, ExternalLink, Eye, EyeOff } from 'lucide-react';
import { deleteBlogPost, toggleBlogPostStatus } from '@/app/admin/(dashboard)/blogs/actions';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  isActive: boolean;
  createdAt: Date;
}

export default function BlogListClient({ posts }: { posts: BlogPost[] }) {
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [seeding, setSeeding] = useState(false);

  const triggerSeed = async () => {
    setSeeding(true);
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        alert('Database seeded successfully! Reloading...');
        window.location.reload();
      } else {
        alert('Seeding failed: ' + data.message);
      }
    } catch (err) {
      alert('Failed to connect to seeding API.');
    } finally {
      setSeeding(false);
    }
  };

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(search.toLowerCase()) ||
    post.slug.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    setUpdatingId(id);
    try {
      await toggleBlogPostStatus(id, !currentStatus);
    } catch (error) {
      alert('Failed to update post status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      setUpdatingId(id);
      try {
        await deleteBlogPost(id);
      } catch (error) {
        alert('Failed to delete blog post.');
      } finally {
        setUpdatingId(null);
      }
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200 p-6 md:p-8 shadow-sm font-sans">
      {/* Table Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        {/* Search */}
        <div className="relative max-w-md w-full">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
            <Search size={16} />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search blogs by title or slug..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs md:text-sm font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1a8b4c] transition-colors"
          />
        </div>

        {/* Add Button */}
        <Link
          href="/admin/blogs/new"
          className="bg-[#1a8b4c] hover:bg-[#15703d] text-white font-black py-2.5 px-5 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider self-start md:self-auto"
        >
          <Plus size={16} />
          <span>Write Blog Post</span>
        </Link>
      </div>

      {/* Blogs Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-[10px] font-black uppercase tracking-wider border-b border-gray-100">
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Slug</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Published Date</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs md:text-sm font-semibold text-gray-700">
            {posts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-bold">
                  <div className="flex flex-col items-center gap-4 justify-center">
                    <p>No blog posts exist in the MySQL database.</p>
                    <button
                      type="button"
                      onClick={triggerSeed}
                      disabled={seeding}
                      className="bg-green-50 text-[#1a8b4c] border border-green-200 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-green-100 transition-colors disabled:opacity-50"
                    >
                      {seeding ? 'Seeding...' : 'Seed Initial Services & Blogs'}
                    </button>
                  </div>
                </td>
              </tr>
            ) : filteredPosts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-400 font-bold">
                  No blog posts found.
                </td>
              </tr>
            ) : (
              filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-gray-950 font-bold">{post.title}</td>
                  <td className="px-6 py-4 text-gray-500">
                    <span className="font-mono bg-gray-50 border border-gray-100 px-2 py-1 rounded text-xs">
                      {post.slug}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleStatus(post.id, post.isActive)}
                      disabled={updatingId === post.id}
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border transition-colors ${
                        post.isActive
                          ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                          : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                      }`}
                    >
                      {post.isActive ? (
                        <>
                          <Eye size={12} /> Active
                        </>
                      ) : (
                        <>
                          <EyeOff size={12} /> Deactivated
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-gray-400 font-bold">
                    {new Date(post.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={post.slug}
                        target="_blank"
                        className="p-2 hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
                        title="View Post Page"
                      >
                        <ExternalLink size={16} />
                      </Link>
                      <Link
                        href={`/admin/blogs/${post.slug.replace(/^\/blog\//, '').replace(/^\//, '')}`}
                        className="p-2 hover:bg-gray-100 text-gray-600 hover:text-blue-600 rounded-lg transition-colors"
                        title="Edit Post"
                      >
                        <Edit2 size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id)}
                        disabled={updatingId === post.id}
                        className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete Post"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
