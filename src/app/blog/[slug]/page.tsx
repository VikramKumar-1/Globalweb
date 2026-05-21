import React from 'react';
import { Calendar, User, ArrowLeft, ArrowRight, Phone, MessageSquare, TrendingUp, BookOpen, Check } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { blogPosts as staticBlogPosts } from '@/data/posts';
import BlogContactForm from '@/components/forms/BlogContactForm';
import { Metadata } from 'next';

interface Props {
  params: { slug: string };
}

// Generate dynamic static params (ISR)
export async function generateStaticParams() {
  try {
    const dbPosts = await db.blogPost.findMany({ select: { slug: true } });
    const dbSlugs = dbPosts.map(p => ({ slug: p.slug.replace('/blog/', '') }));
    const staticSlugs = staticBlogPosts.map(p => ({ slug: p.slug.replace('/blog/', '') }));
    return [...dbSlugs, ...staticSlugs];
  } catch (error) {
    return staticBlogPosts.map(p => ({ slug: p.slug.replace('/blog/', '') }));
  }
}

import { replaceLocation, stripHtml } from '@/lib/replaceLocation';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slugWithPrefix = `/blog/${params.slug}`;
  const locationName = "";
  
  try {
    // 1. Check DB first
    const dbPost = await db.blogPost.findUnique({
      where: { slug: slugWithPrefix }
    });

    if (dbPost) {
      const title = replaceLocation(dbPost.seoTitle || dbPost.title || '', locationName);
      const description = replaceLocation(dbPost.seoDescription || dbPost.summary || '', locationName);
      return {
        title: title,
        description: description,
        keywords: dbPost.seoKeywords ? dbPost.seoKeywords.split(',').map(k => k.trim()) : undefined
      };
    }
  } catch (e) {}

  // 2. Check Static fallback
  const staticPost = staticBlogPosts.find((p) => p.slug === slugWithPrefix);
  if (staticPost) {
    return {
      title: `${staticPost.title} | GlobalWebify`,
      description: staticPost.excerpt,
    };
  }

  return {};
}

export default async function BlogPostPage({ params }: Props) {
  const slugWithPrefix = `/blog/${params.slug}`;
  
  let post: any = null;
  let isDbPost = false;

  // 1. Fetch from Database
  try {
    post = await db.blogPost.findFirst({
      where: {
        slug: slugWithPrefix,
        isActive: true
      }
    });
    if (post) {
      isDbPost = true;
    }
  } catch (error) {
    console.error("Failed to query DB blog:", error);
  }

  // 2. Fallback to static post
  if (!post) {
    post = staticBlogPosts.find((p) => p.slug === slugWithPrefix);
  }

  if (!post) {
    return notFound();
  }

  // Replace {location} placeholder with fallback
  const locationName = "";
  if (post.title) post.title = replaceLocation(post.title, locationName);
  if (post.summary) post.summary = replaceLocation(post.summary, locationName);
  if (post.seoTitle) post.seoTitle = replaceLocation(post.seoTitle, locationName);
  if (post.seoDescription) post.seoDescription = replaceLocation(post.seoDescription, locationName);
  if (post.content) post.content = replaceLocation(post.content, locationName);

  // Helper formatting for dates
  const displayDate = isDbPost 
    ? new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()
    : post.date;

  const displayAuthor = isDbPost ? 'Admin' : post.author;
  const displayExcerpt = isDbPost ? post.summary : post.excerpt;

  // If DB post, dynamically parse headings for TOC. If static, filter richContent.
  let h2Headings: string[] = [];
  if (isDbPost) {
    // Basic regex extraction of H2 tags from HTML content
    const headingMatches = post.content.match(/<h2[^>]*>([\s\S]*?)<\/h2>/gi);
    if (headingMatches) {
      h2Headings = headingMatches.map((m: string) => m.replace(/<[^>]*>/g, '').trim());
    }
  } else {
    h2Headings = post.richContent?.filter((section: any) => section.type === 'h2').map((s: any) => s.text) || [];
  }

  return (
    <article className="pt-32 pb-24 bg-white min-h-screen font-sans antialiased text-gray-800 relative">
      
      {/* Decorative Wavy Background highlights */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-50/20 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-50/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 2-Column Responsive Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          
          {/* LEFT COLUMN: MAIN ARTICLE CONTENTS */}
          <main className="lg:col-span-8 flex flex-col">
            
            {/* Banner Image */}
            {post.image && (
              <div className="w-full aspect-[21/10] bg-gray-50/70 border border-gray-200 rounded-[24px] shadow-sm mb-8 overflow-hidden relative">
                <img
                  src={post.image}
                  alt={post.title}
                  className="object-cover w-full h-full"
                />
              </div>
            )}

            {/* Category & Metadata badges */}
            <div className="flex flex-wrap items-center gap-3.5 mb-5">
              <span className="bg-gray-100 text-gray-500 text-[11px] font-bold px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
                <User size={13} className="stroke-[2.5] text-gray-400" />
                <span>{displayAuthor}</span>
              </span>
              
              <span className="bg-gray-100 text-gray-500 text-[11px] font-bold px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
                <Calendar size={13} className="stroke-[2.5] text-gray-400" />
                <span>{displayDate}</span>
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-[26px] sm:text-[32px] md:text-[36px] font-bold font-lexend text-[#1a8b4c] leading-tight mb-6 tracking-tight">
              {post.title}
            </h1>

            {/* Excerpt Summary */}
            <div className="bg-[#1a8b4c]/5 border border-[#1a8b4c]/10 rounded-3xl p-6 md:p-7 mb-8 text-gray-700 italic font-semibold text-[13.5px] md:text-[14.5px] leading-relaxed shadow-sm">
              {displayExcerpt}
            </div>

            {/* 4-Button Contact Action Row */}
            <div className="flex flex-wrap items-center gap-3 mb-10 w-full">
              <Link 
                href="/contact"
                className="text-white font-black py-3 px-5 rounded-xl shadow-sm hover:shadow-md hover:translate-y-[-1px] transition-all flex items-center justify-center gap-2 text-xs md:text-[13px] uppercase tracking-wider"
                style={{ background: 'linear-gradient(to right, #1a8b4c, #15703d)', border: '1px solid #1a8b4c' }}
              >
                Enquire Now <ArrowRight size={14} className="stroke-[2.5]" />
              </Link>

              <a 
                href="tel:+917563901100"
                className="font-black py-3 px-5 rounded-xl border transition-all flex items-center justify-center gap-2 text-xs md:text-[13px] uppercase tracking-wider bg-white shadow-sm hover:shadow-md hover:translate-y-[-1px]"
                style={{ color: '#1a8b4c', borderColor: '#1a8b4c' }}
              >
                <Phone size={14} className="stroke-[2.5]" /> Call
              </a>

              <a 
                href="https://wa.me/917563901100"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white font-black py-3 px-5 rounded-xl shadow-sm hover:shadow-md hover:translate-y-[-1px] transition-all flex items-center justify-center gap-2 text-xs md:text-[13px] uppercase tracking-wider"
                style={{ background: 'linear-gradient(to right, #25D366, #1b8a4a)', border: '1px solid #25D366' }}
              >
                <MessageSquare size={14} className="fill-white stroke-none" /> WhatsApp
              </a>

              <Link 
                href="/contact?subject=Free Audit"
                className="text-white font-black py-3 px-5 rounded-xl shadow-sm hover:shadow-md hover:translate-y-[-1px] transition-all flex items-center justify-center gap-2 text-xs md:text-[13px] uppercase tracking-wider"
                style={{ background: 'linear-gradient(to right, #2563eb, #0891b2)', border: '1px solid #2563eb' }}
              >
                <TrendingUp size={14} className="stroke-[2.5]" /> Free Audit
              </Link>
            </div>

            {/* Content Display */}
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed font-sans mb-12">
              {isDbPost ? (
                // DB content contains raw HTML from WYSIWYG
                <div 
                  className="db-blog-content"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              ) : (
                // Static post rendering loop
                post.richContent.map((section: any, idx: number) => {
                  switch (section.type) {
                    case 'p':
                      return (
                        <p key={idx} className="text-gray-600 text-[14px] md:text-[15px] leading-relaxed mb-6 font-semibold">
                          {section.text}
                        </p>
                      );
                    case 'h2':
                      return (
                        <h2 
                          id={section.text.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
                          key={idx} 
                          className="text-[19px] md:text-[21px] font-black text-[#1a8b4c] uppercase tracking-wider mt-10 mb-4 border-b border-gray-100 pb-2.5 scroll-mt-24"
                        >
                          {section.text}
                        </h2>
                      );
                    case 'h3':
                      return (
                        <h3 key={idx} className="text-[15px] md:text-[16px] font-black text-gray-950 mt-8 mb-3.5 tracking-tight">
                          {section.text}
                        </h3>
                      );
                    case 'ul':
                      return (
                        <ul key={idx} className="pl-2 mb-6 space-y-3 flex flex-col">
                          {section.items?.map((item: string, itemIdx: number) => (
                            <li key={itemIdx} className="text-gray-600 text-[14px] md:text-[14.5px] font-semibold flex items-start gap-2.5 hover:text-[#1a8b4c] transition-colors leading-relaxed">
                              <span className="w-5 h-5 rounded-full bg-green-50 border border-green-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                                <Check size={11} className="text-[#1a8b4c] stroke-[3]" />
                              </span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      );
                    default:
                      return null;
                  }
                })
              )}
            </div>

            {/* Back Button */}
            <div className="border-t border-gray-100 pt-8 mb-12">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-[#1a8b4c] font-black hover:gap-3 transition-all text-xs md:text-sm tracking-wider uppercase"
              >
                <ArrowLeft size={16} className="stroke-[2.5]" /> Back to Blog Directory
              </Link>
            </div>
          </main>

          {/* RIGHT COLUMN: FLOATING SIDEBAR */}
          <aside className="lg:col-span-4 flex flex-col gap-8 lg:sticky lg:top-28 h-fit pb-12">
            
            {/* Table of Contents */}
            {h2Headings.length > 0 && (
              <div className="bg-white rounded-[24px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-200">
                <h3 className="text-[15.5px] font-black text-gray-950 uppercase tracking-widest mb-4 flex items-center gap-2 pb-3 border-b border-gray-50">
                  <BookOpen size={16} className="text-[#1a8b4c] stroke-[2.5]" /> Table of Contents
                </h3>
                
                <div className="flex flex-col gap-1.5 max-h-[400px] overflow-y-auto pr-1">
                  {h2Headings.map((headingText, index) => {
                    const slugId = headingText.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                    const isActive = index === 0;
                    
                    return (
                      <a
                        key={index}
                        href={`#${slugId}`}
                        className={`text-[12.5px] p-3 font-bold transition-all text-left block leading-tight ${
                          isActive
                            ? 'bg-green-50 text-[#1a8b4c] rounded-xl border-l-[3px] border-[#1a8b4c]'
                            : 'text-gray-600 hover:text-[#1a8b4c] border-l-[3px] border-transparent hover:border-green-200 pl-3'
                        }`}
                      >
                        {headingText}
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {/* About Global Webify */}
            <div className="bg-white rounded-[24px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-200">
              <h3 className="text-[15.5px] font-black text-gray-950 uppercase tracking-widest mb-3 flex items-center gap-2">
                <span className="text-[#1a8b4c]">⭐</span> About Global Webify
              </h3>
              <p className="text-gray-500 text-[12.5px] leading-relaxed font-semibold mb-5">
                Founded in 2020, we've been providing full-cycle web and mobile app development services to clients from various industries.
              </p>
              <Link
                href="/contact"
                className="w-full bg-[#1a8b4c] hover:bg-[#15703d] text-white font-black py-3.5 px-6 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 text-xs tracking-wider uppercase"
              >
                Let's Collaborate!
              </Link>
            </div>

            {/* Form Component */}
            <BlogContactForm />
          </aside>

        </div>
      </div>
    </article>
  );
}
