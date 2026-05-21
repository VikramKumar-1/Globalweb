import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { replaceLocation, stripHtml } from '@/lib/replaceLocation';
import Link from 'next/link';
import HomeView from '@/components/views/HomeView';
import dynamic from 'next/dynamic';
import { ExpandableContent } from '@/components/ui/ExpandableContent';
import { CardIcon } from '@/components/ui/CardIcon';
import { FAQSection } from '@/components/sections/FAQSection';
import { CheckCircle2, ShieldCheck, Sparkles, Clock, Globe, Code, ArrowRight, Phone, MessageSquare, TrendingUp, Monitor, Smartphone, ShoppingCart, Layout, Palette, Settings, Building2, HeartPulse, Users, Home, ShoppingBag, Briefcase, MapPin, BarChart3, Search, Share2, Megaphone, FileText, Utensils, GraduationCap, Plane, HeartHandshake, Hotel, Gem, Newspaper } from 'lucide-react';

import Hero from '@/components/sections/Hero';
import ServiceHero from '@/components/sections/ServiceHero';

const ServicesGrid = dynamic(() => import('@/components/sections/ServicesGrid'), {
  ssr: true,
  loading: () => <div className="min-h-[400px] animate-pulse bg-gray-50 rounded-3xl m-8" />
});

const Portfolio = dynamic(() => import('@/components/sections/Portfolio'), {
  ssr: true,
  loading: () => <div className="min-h-[600px] animate-pulse bg-green-50/30 rounded-3xl m-8" />
});

const TechStack = dynamic(() => import('@/components/sections/TechStack'), {
  ssr: true,
  loading: () => <div className="min-h-[300px] animate-pulse bg-gray-50 rounded-3xl m-8" />
});

const LatestBlog = dynamic(() => import('@/components/sections/LatestBlog'), {
  ssr: true,
  loading: () => <div className="min-h-[400px] animate-pulse bg-gray-50 rounded-3xl m-8" />
});

const ResultsSection = dynamic(() => import('@/components/sections/ResultsSection'), {
  ssr: true,
  loading: () => <div className="min-h-[600px] animate-pulse bg-gray-50 rounded-3xl m-8" />
});

const AboutSEO = dynamic(() => import('@/components/sections/AboutSEO'), {
  ssr: true
});

const TrustSection = dynamic(() => import('@/components/sections/TrustSection'), {
  ssr: true
});

export const revalidate = 3600;

interface Props {
  params: { slug: string };
}

// ---------- City config ----------
const CITIES_MAP: Record<string, { name: string; subtitle: string }> = {
  india: { name: 'India', subtitle: 'Country' },
  uk: { name: 'UK', subtitle: 'United Kingdom' },
  ranchi: { name: 'Ranchi', subtitle: 'Jharkhand , India' },
  dubai: { name: 'Dubai', subtitle: 'United Arab Emirates' },
  delhi: { name: 'Delhi', subtitle: 'India' },
  noida: { name: 'Noida', subtitle: 'Uttar Pradesh , India' },
  gurugram: { name: 'Gurugram', subtitle: 'Haryana , India' },
  bangalore: { name: 'Bangalore', subtitle: 'Karnataka , India' },
  mumbai: { name: 'Mumbai', subtitle: 'Maharashtra , India' },
  pune: { name: 'Pune', subtitle: 'Maharashtra , India' },
  hyderabad: { name: 'Hyderabad', subtitle: 'Telangana , India' },
  kolkata: { name: 'Kolkata', subtitle: 'West Bengal , India' },
};

const CATEGORY_CONFIG: Record<string, { label: string; description: string; icons: string[] }> = {
  website: {
    label: 'Website Development Services',
    description: 'Custom, responsive, and high-performance websites built for your business.',
    icons: ['Monitor', 'Smartphone', 'ShoppingCart', 'Layout', 'Palette', 'Settings', 'Code', 'Briefcase'],
  },
  marketing: {
    label: 'Digital Marketing Services',
    description: 'Data-driven strategies to grow your online presence and generate leads.',
    icons: ['BarChart3', 'Search', 'Share2', 'Megaphone', 'FileText', 'Globe', 'TrendingUp', 'Briefcase'],
  },
  branding: {
    label: 'Branding & PR Services',
    description: 'Build a powerful brand identity that resonates with your audience.',
    icons: ['Palette', 'Globe', 'FileText', 'Megaphone', 'Share2', 'Settings', 'Code', 'Briefcase'],
  },
};

const COLORS = ["text-cyan-600", "text-blue-600", "text-purple-600", "text-emerald-600", "text-rose-500", "text-orange-500", "text-indigo-600", "text-teal-600"];

// ---------- Static params ----------
export async function generateStaticParams() {
  try {
    const pages = await db.servicePage.findMany({
      where: { isActive: true },
      select: { slug: true }
    });
    const serviceParams = pages.map((page) => ({
      slug: page.slug.startsWith('/') ? page.slug.slice(1) : page.slug,
    }));
    const cityParams = Object.keys(CITIES_MAP).map((city) => ({ slug: city }));
    return [...serviceParams, ...cityParams];
  } catch (error) {
    return [];
  }
}

// ---------- Metadata ----------
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Defensive fallback in case params.slug is undefined
  const rawSlug = params?.slug || '';

  // City landing page metadata
  const cityInfo = rawSlug ? CITIES_MAP[rawSlug.toLowerCase()] : null;
  if (cityInfo) {
    return {
      title: `Best Web Development & Digital Marketing Services in ${cityInfo.name} | GlobalWebify`,
      description: `Explore GlobalWebify's professional web development, SEO, digital marketing, and branding services in ${cityInfo.name}. Custom solutions tailored to your local market.`,
    };
  }

  // Service page metadata
  try {
    const slugsToTry = [rawSlug, `/${rawSlug}`];
    const page = await db.servicePage.findFirst({
      where: { slug: { in: slugsToTry }, isActive: true }
    });
    if (!page) return {};

    const locationName = "";
    const title = replaceLocation(page.seoTitle || page.title || '', locationName);
    const description = replaceLocation(page.seoDescription || '', locationName);
    return {
      title: title,
      description: description,
      keywords: page.seoKeywords ? page.seoKeywords.split(',').map(k => k.trim()) : undefined,
    };
  } catch { return {}; }
}

// ---------- Industries List ----------
const INDUSTRIES_LIST = [
  { icon: Home, label: "Real Estate", color: "text-rose-500" },
  { icon: HeartPulse, label: "Medical & Doctors", color: "text-red-500" },
  { icon: Utensils, label: "Food & Beverage", color: "text-amber-600" },
  { icon: GraduationCap, label: "School & Education", color: "text-indigo-600" },
  { icon: Plane, label: "Tours & Travel", color: "text-cyan-600" },
  { icon: ShoppingBag, label: "B2C", color: "text-emerald-600" },
  { icon: Building2, label: "B2B", color: "text-blue-600" },
  { icon: ShoppingCart, label: "E-Commerce", color: "text-purple-600" },
  { icon: Sparkles, label: "Health & Beauty", color: "text-pink-500" },
  { icon: HeartHandshake, label: "Community Web Design", color: "text-green-600" },
  { icon: Hotel, label: "Hotels & Restaurants", color: "text-teal-600" },
  { icon: Newspaper, label: "News & Publication", color: "text-gray-600" }
];

// ---------- Page component ----------
export default async function DynamicPage({ params }: Props) {
  // Defensive fallback
  const rawSlug = params?.slug || '';

  // ===== CITY LANDING PAGE =====
  const cityInfo = rawSlug ? CITIES_MAP[rawSlug.toLowerCase()] : null;
  if (cityInfo) {
    return <CityLandingView cityKey={rawSlug.toLowerCase()} cityInfo={cityInfo} />;
  }

  // ===== SERVICE PAGE =====
  return <ServicePageView rawSlug={rawSlug} />;
}

// ==========================================
// City Landing Component (Looks like Homepage but customized Hero)
// ==========================================
async function CityLandingView({ cityKey, cityInfo }: { cityKey: string; cityInfo: { name: string; subtitle: string } }) {
  const locationName = cityInfo.name;
  return <HomeView city={locationName} cityKey={cityKey} />;
}

// ==========================================
// Service Page Component (original logic)
// ==========================================
async function ServicePageView({ rawSlug }: { rawSlug: string }) {
  const slugsToTry = [rawSlug, `/${rawSlug}`];

  let page = await db.servicePage.findFirst({
    where: { slug: { in: slugsToTry }, isActive: true }
  });

  if (!page) {
    // Check if it's a known category page that hasn't been created in DB yet
    const knownCategories = ['seo-services', 'ai-seo-services', 'social-media-marketing', 'ppc-services'];
    
    if (knownCategories.includes(rawSlug)) {
      const formattedTitle = rawSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      
      // Generate a fallback page so the category renders like a standard service page
      page = {
        id: Math.floor(Math.random() * 1000000),
        slug: rawSlug,
        title: formattedTitle,
        contentTitle: formattedTitle,
        seoTitle: `Best ${formattedTitle} | GlobalWebify`,
        seoDescription: `Explore our professional ${formattedTitle} to grow your business online.`,
        seoKeywords: formattedTitle.toLowerCase(),
        heroDescription: `Expert ${formattedTitle} tailored to drive traffic, leads, and sales for your business.`,
        content: `<h2>Welcome to our ${formattedTitle}</h2><p>We provide industry-leading solutions to help you dominate your market. Contact us today to learn how our experts can accelerate your growth.</p>`,
        category: 'marketing',
        image: '/web-dev-banner-bg.png',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      } as any;
    } else {
      notFound();
    }
  }

  const locationName = "";
  
  let faqs: { question: string; answer: string }[] = [];
  let rawContent = page.content ?? '';
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

  page = {
    id:              page.id,
    slug:            page.slug,
    title:           replaceLocation(page.title            ?? '', locationName),
    contentTitle:    replaceLocation(page.contentTitle     ?? '', locationName),
    seoTitle:        replaceLocation(page.seoTitle         ?? '', locationName),
    seoDescription:  replaceLocation(page.seoDescription   ?? '', locationName),
    seoKeywords:     page.seoKeywords ?? '',
    heroDescription: replaceLocation(page.heroDescription  ?? '', locationName),
    content:         replaceLocation(rawContent, locationName),
    category:        page.category   ?? 'website',
    image:           page.image      ?? '',
    isActive:        page.isActive,
    createdAt:       page.createdAt,
    updatedAt:       page.updatedAt,
  } as any;

  const remainingSubMenus = await db.servicePage.findMany({
    where: { category: page.category, isActive: true, id: { not: page.id } },
    select: { title: true, slug: true, seoDescription: true, heroDescription: true, content: true, image: true },
    orderBy: { createdAt: 'desc' }
  });

  const ICONS = ['Monitor', 'Smartphone', 'ShoppingCart', 'Layout', 'Palette', 'Settings', 'Code', 'Briefcase'];

  const getDesc = (m: any) => {
    if (m.heroDescription) return replaceLocation(m.heroDescription, locationName);
    if (m.seoDescription) return replaceLocation(m.seoDescription, locationName);
    if (m.content) return stripHtml(replaceLocation(m.content, locationName)).substring(0, 150) + '...';
    return 'Explore our professional web services designed for performance and scale.';
  };

  return (
    <div className="bg-white min-h-screen">
      <ServiceHero 
        title={page.title || ""} 
        description={page.heroDescription || undefined}
        city={locationName || undefined}
      />

      {/* Intro Section */}
      {page.content && page.content.trim() !== "" && stripHtml(page.content).trim() !== "" && (
        <section className="py-6 bg-white border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-[30px] lg:text-[32px] font-black text-gray-900 text-center mb-2 tracking-tight leading-tight max-w-4xl mx-auto px-4">
              {page.contentTitle || `Professional ${page.title}`}
            </h2>
            <div className="w-12 h-[3px] bg-[#1a8b4c] rounded-full mx-auto mb-4" />
            <ExpandableContent htmlContent={page.content} maxHeight={162} />
          </div>
        </section>
      )}

      {/* Services Grid */}
      <section id="services-grid" className="py-10 bg-white border-t border-gray-100 scroll-mt-[100px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-[32px] font-black text-gray-900 mb-3">Why Our Services Deliver Better Results</h2>
            <p className="text-sm md:text-base text-gray-600 font-medium">We Bring Life To The "Few Megabytes Of Virtual Space" You Own</p>
          </div>
          <input type="checkbox" id="show-more-cards" className="peer hidden" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-[1200px] mx-auto peer-checked:[&_.card-item]:!block">
            {remainingSubMenus.length > 0 ? (
              remainingSubMenus.map((menu, i) => {
                const categoryIcons = CATEGORY_CONFIG[page.category as keyof typeof CATEGORY_CONFIG]?.icons || ICONS;
                const Icon = categoryIcons[i % categoryIcons.length];
                
                const CARD_THEMES = [
                  { bg: 'bg-[#1a8b4c]', hex: '#1a8b4c', border: 'border-green-100', hoverBorder: 'hover:border-[#1a8b4c]', mesh: 'bg-[#1a8b4c]/10' },
                  { bg: 'bg-[#0ea5e9]', hex: '#0ea5e9', border: 'border-blue-100', hoverBorder: 'hover:border-blue-500', mesh: 'bg-blue-500/10' },
                  { bg: 'bg-[#ec4899]', hex: '#ec4899', border: 'border-pink-100', hoverBorder: 'hover:border-pink-500', mesh: 'bg-pink-500/10' },
                  { bg: 'bg-[#f59e0b]', hex: '#f59e0b', border: 'border-amber-100', hoverBorder: 'hover:border-amber-500', mesh: 'bg-amber-500/10' },
                  { bg: 'bg-[#8b5cf6]', hex: '#8b5cf6', border: 'border-purple-100', hoverBorder: 'hover:border-purple-500', mesh: 'bg-purple-500/10' },
                  { bg: 'bg-[#10b981]', hex: '#10b981', border: 'border-emerald-100', hoverBorder: 'hover:border-emerald-500', mesh: 'bg-emerald-500/10' },
                ];
                const theme = CARD_THEMES[i % CARD_THEMES.length];
                const linkHref = menu.slug.startsWith('/') ? menu.slug : `/${menu.slug}`;
                const displayTitle = replaceLocation(menu.title, locationName);
                
                return (
                  <Link href={linkHref} key={i} className={`card-item relative min-h-[260px] md:min-h-[320px] bg-white rounded-2xl border border-gray-200/80 transition-all duration-300 ease-out overflow-hidden hover:-translate-y-1.5 hover:shadow-[0_16px_40px_-12px_rgba(0,0,0,0.08)] ${theme.hoverBorder} group ${i >= 6 ? 'hidden md:block' : 'block'} flex flex-col`}>
                    {/* Top accent line */}
                    <div className="h-[3px] w-full rounded-t-2xl" style={{ background: `linear-gradient(90deg, ${theme.hex}, ${theme.hex}88)` }} />
                    <div className={`absolute inset-0 opacity-10 group-hover:opacity-30 transition-opacity duration-700 ${theme.mesh} blur-[50px] rounded-full`} />
                    <div className="relative z-20 flex-1 p-5 sm:p-6 md:p-7 flex flex-col items-start text-left h-full">
                      <div className="relative mb-4 md:mb-5">
                        <div className={`absolute inset-0 rounded-xl blur-[8px] scale-110 opacity-10 group-hover:opacity-20 transition-opacity ${theme.bg}`} />
                        <div className={`relative w-11 h-11 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-white transition-all duration-300 group-hover:scale-105 ${theme.bg}`}>
                          <CardIcon iconName={Icon} colorClass="!w-4 !h-4 md:!w-5 md:!h-5 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col w-full">
                        <h3 className="text-[17px] md:text-[19px] font-bold font-lexend mb-2.5 leading-snug tracking-[-0.01em] group-hover:text-gray-950 transition-colors" style={{ color: "#064e3b" }}>
                          {displayTitle}
                        </h3>
                        <p className="text-[13px] md:text-[13.5px] text-gray-500 font-normal font-jost leading-[1.6] mb-5 line-clamp-3">
                          {getDesc(menu)}
                        </p>
                      </div>
                      <div className="w-full mt-auto pt-4 border-t border-gray-100/80">
                        <span
                          className="flex items-center gap-1.5 text-[12.5px] md:text-[13px] font-semibold font-jost tracking-wide group-hover:gap-2.5 transition-all duration-300"
                          style={{ color: theme.hex }}
                        >
                          Explore Services
                          <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.2} />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : null}
          </div>
          {remainingSubMenus.length > 6 && (
            <div className="mt-10 text-center md:hidden peer-checked:[&_label_.see-more]:hidden peer-checked:[&_label_.see-less]:block">
              <label htmlFor="show-more-cards" className="cursor-pointer inline-flex items-center justify-center bg-[#1a8b4c] hover:bg-green-700 text-white font-bold py-3.5 px-8 rounded-full shadow-md text-[14px] transition-all">
                <span className="see-more block">See More Services</span>
                <span className="see-less hidden">See Less Services</span>
              </label>
            </div>
          )}
        </div>
      </section>



      {faqs.length > 0 && <FAQSection faqs={faqs} />}

      {/* Industries */}
      <section className="py-10 bg-white border-t border-gray-100 font-lexend">
        <div className="max-w-[1250px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-[32px] font-black text-gray-900 mb-12">Industries We Work With</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 md:gap-4 max-w-[1200px] mx-auto">
            {INDUSTRIES_LIST.map((ind, idx) => {
              const IconComp = ind.icon;
              return (
                <div 
                  key={idx} 
                  className="flex flex-col items-center justify-center p-3 sm:p-5 bg-gray-50/50 hover:bg-[#f4fbf8]/50 rounded-2xl border border-gray-100/80 transition-all duration-200 hover:-translate-y-0.5"
                >
                  <IconComp className={`w-8 h-8 sm:w-10 sm:h-10 ${ind.color} mb-2 sm:mb-3 stroke-[1.5]`} />
                  <p className="text-[11px] sm:text-[13px] font-bold text-gray-800 text-center leading-tight">
                    {ind.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
