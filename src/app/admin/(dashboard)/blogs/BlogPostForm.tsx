'use client';

import React, { useState } from 'react';
import { saveBlogPost } from './actions';
import { Upload, ArrowLeft, Sparkles, CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ContentEditor from '@/components/admin/ContentEditor';

interface BlogPost {
  id?: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  image?: string;
  isActive: boolean;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
}

export default function BlogPostForm({ post }: { post?: BlogPost }) {
  const router = useRouter();
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const [title, setTitle] = useState(post?.title || '');
  const [slug, setSlug] = useState(post?.slug ? post.slug.replace('/blog/', '') : '');
  const [summary, setSummary] = useState(post?.summary || '');
  const [content, setContent] = useState(post?.content || '');
  const [image, setImage] = useState(post?.image || '');
  const [isActive, setIsActive] = useState(post ? post.isActive : true);
  
  const [seoTitle, setSeoTitle] = useState(post?.seoTitle || '');
  const [seoDescription, setSeoDescription] = useState(post?.seoDescription || '');
  const [seoKeywords, setSeoKeywords] = useState(post?.seoKeywords || '');

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Auto slug suggestor on title changes
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!post?.id) {
      const suggestedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(suggestedSlug);
    }
  };

  // Image uploader handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setImage(data.url);
      } else {
        alert('Upload failed: ' + data.message);
      }
    } catch (err) {
      alert('Upload failed. Please check XAMPP database and server connection.');
    } finally {
      setUploading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !summary || !content) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/admin/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: post?.id,
          title,
          slug,
          summary,
          content,
          image,
          isActive,
          seoTitle,
          seoDescription,
          seoKeywords,
        }),
      });

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.error || 'Failed to save blog post');
      }

      showToast('Blog post saved successfully!', 'success');
      
      // If it is a newly created blog post, transition to its edit view to stay on the editor page
      if (!post?.id && res.success && res.slug) {
        setTimeout(() => {
          const cleanSlug = res.slug.replace(/^\/blog\//, '').replace(/^\//, '');
          router.push(`/admin/blogs/${cleanSlug}`);
        }, 1500);
      }
    } catch (err) {
      console.error('Form Submit:', err);
      showToast('Failed to save blog post: ' + (err as Error).message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-gray-200 p-6 md:p-8 shadow-sm font-sans relative">
      
      {/* Toast Notification Overlay */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[9999] px-6 py-4 rounded-2xl shadow-2xl font-bold flex items-center gap-3 border ${
          toast.type === 'success' ? 'bg-[#1a8b4c] text-white border-[#15703d]' : 'bg-red-600 text-white border-red-700'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
          <span className="text-sm tracking-wide">{toast.message}</span>
        </div>
      )}
      
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/admin/blogs"
          className="inline-flex items-center gap-2 text-[#1a8b4c] font-black text-xs uppercase tracking-wider hover:gap-3 transition-all"
        >
          <ArrowLeft size={14} /> Back to Blogs CMS
        </Link>
      </div>

      <form onSubmit={handleFormSubmit} className="flex flex-col gap-6">
        
        {/* Dynamic Location Tip */}
        <div className="bg-[#f0fdf4] border border-green-200/50 rounded-2xl p-4 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-[#1a8b4c] shrink-0 mt-0.5" />
          <div>
            <p className="text-[12px] font-black text-gray-950 mb-0.5">SEO Pro Tip: Dynamic Location Pages</p>
            <p className="text-[11px] text-gray-600 font-semibold leading-relaxed">
              Use the placeholder <code className="bg-[#e4f8ec] px-1.5 py-0.5 rounded font-mono font-black text-[#1a8b4c]">{"{location}"}</code> inside your blog title, summary, meta descriptions, or content editor. When viewed under market-area URL paths (e.g. <code className="font-mono">/delhi/blog-slug</code>), it will automatically render the target city name (e.g. "Delhi")!
            </p>
          </div>
        </div>

        {/* Core fields grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-[11px] font-black text-gray-500 uppercase tracking-wider">
              Post Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={handleTitleChange}
              placeholder="e.g. 5 SEO Strategies to Triple Your Business Traffic"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs md:text-sm font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1a8b4c] transition-colors"
            />
          </div>

          {/* Slug */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-black text-gray-500 uppercase tracking-wider">
              Post Slug (URL Path) *
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-xs text-gray-400 font-bold select-none font-mono">
                /blog/
              </span>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="5-seo-strategies"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-16 pr-4 py-3 text-xs md:text-sm font-mono font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1a8b4c] transition-colors"
              />
            </div>
          </div>

          {/* Image Banner */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-black text-gray-500 uppercase tracking-wider">
                Post Cover Image URL
              </label>
              {image !== (post?.image || '') && (
                <button
                  type="button"
                  onClick={() => {
                    setImage(post?.image || '');
                    showToast('Uploaded photo removed. Reverted to default.', 'success');
                  }}
                  className="text-[10px] font-bold text-red-500 hover:text-red-700 hover:underline uppercase tracking-wider transition-colors"
                >
                  Remove Uploaded Photo
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                disabled={saving || uploading}
                placeholder="/uploads/blog-banner.png"
                className="flex-grow bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs md:text-sm font-mono font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1a8b4c] transition-colors disabled:opacity-50"
              />
              <label className={`bg-gray-100 border border-gray-200 px-4 rounded-xl flex items-center justify-center transition-colors text-gray-600 ${
                saving || uploading ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-200 cursor-pointer'
              }`}>
                {uploading ? (
                  <svg className="animate-spin h-4 w-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <Upload size={16} />
                )}
                <input
                  type="file"
                  accept="image/*"
                  disabled={saving || uploading}
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
            {image && (
              <div className="mt-2 relative w-48 h-28 rounded-xl border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center p-2">
                <img
                  src={image}
                  alt="Preview"
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                />
              </div>
            )}
          </div>

          {/* Summary Excerpt */}
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-[11px] font-black text-gray-500 uppercase tracking-wider">
              Summary / Excerpt * (Brief overview displayed in lists)
            </label>
            <textarea
              required
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Provide a catchphrase or brief preview of this article..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs md:text-sm font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1a8b4c] transition-colors resize-none"
            />
          </div>

          {/* Active status */}
          <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 p-4 rounded-2xl md:col-span-2">
            <input
              type="checkbox"
              id="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4.5 h-4.5 text-[#1a8b4c] border-gray-300 rounded focus:ring-[#1a8b4c] focus:ring-2 accent-[#1a8b4c]"
            />
            <div className="flex flex-col">
              <label htmlFor="isActive" className="text-xs font-black text-gray-900 uppercase tracking-wider cursor-pointer">
                Publish Active status
              </label>
              <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                Deactivating hide this post from the public listing index and routes
              </span>
            </div>
          </div>
        </div>

        {/* SEO Collapsible Section */}
        <div className="border border-gray-100 bg-gray-50/50 rounded-2xl p-5">
          <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <Sparkles size={14} className="text-[#1a8b4c]" /> SEO Metadata Properties
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">SEO Title (Overrides heading) <span className="text-[#1a8b4c] normal-case tracking-normal font-semibold ml-1">Supports {'{location}'}</span></label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder="SEO Friendly Blog Title"
                className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#1a8b4c] transition-colors"
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">SEO Keywords (Comma separated)</label>
              <input
                type="text"
                value={seoKeywords}
                onChange={(e) => setSeoKeywords(e.target.value)}
                placeholder="seo audit, digital strategy, branding"
                className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#1a8b4c] transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">SEO Meta Description <span className="text-[#1a8b4c] normal-case tracking-normal font-semibold ml-1">Supports {'{location}'}</span></label>
              <textarea
                rows={2}
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder="Write an SEO descriptive content summary..."
                className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#1a8b4c] transition-colors resize-none"
              />
            </div>
          </div>
        </div>

        {/* Content Pane */}
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-black text-gray-500 uppercase tracking-wider">
            Blog Content HTML *
          </label>
          <ContentEditor 
            content={content} 
            setContent={setContent} 
            placeholder="Write your blog post content using HTML and premium template components..."
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-3 mt-4">
          <Link
            href="/admin/blogs"
            className={`border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-2.5 px-5 rounded-xl text-xs uppercase tracking-wider ${
              saving || uploading ? 'pointer-events-none opacity-50' : ''
            }`}
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving || uploading}
            className="bg-[#1a8b4c] hover:bg-[#15703d] text-white font-black py-2.5 px-6 rounded-xl shadow-sm hover:shadow-md transition-all text-xs uppercase tracking-wider flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              'Save Blog Post'
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
