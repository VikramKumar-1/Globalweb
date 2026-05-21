import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { replaceLocation, stripHtml } from '@/lib/replaceLocation';
import Link from 'next/link';
import { ExpandableContent } from '@/components/ui/ExpandableContent';
import { FAQSection } from '@/components/sections/FAQSection';
import { CardIcon } from '@/components/ui/CardIcon';
import { ArrowRight, Phone, MessageSquare, TrendingUp, Monitor, Smartphone, ShoppingCart, Layout, Palette, Settings, Code, Briefcase, Building2, HeartPulse, Users, Home, ShoppingBag, MapPin, BarChart3, Search, Share2, Megaphone, FileText, Globe, Sparkles, Utensils, GraduationCap, Plane, HeartHandshake, Hotel, Gem, Newspaper } from 'lucide-react';
import ServiceHero from '@/components/sections/ServiceHero';

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

export const revalidate = 3600;

interface Props {
  params: { slug: string; serviceSlug: string };
}

const CITIES_MAP: Record<string, string> = {
  india: 'India',
  uk: 'United Kingdom',
  ranchi: 'Ranchi',
  dubai: 'Dubai',
  delhi: 'Delhi',
  noida: 'Noida',
  gurugram: 'Gurugram',
  bangalore: 'Bangalore',
  mumbai: 'Mumbai',
  pune: 'Pune',
  hyderabad: 'Hyderabad',
  kolkata: 'Kolkata',
};

export async function generateStaticParams() {
  try {
    const pages = await db.servicePage.findMany({
      where: { isActive: true },
      select: { slug: true }
    });
    const params: { slug: string; serviceSlug: string }[] = [];
    Object.keys(CITIES_MAP).forEach((city) => {
      pages.forEach((page) => {
        const clean = page.slug.startsWith('/') ? page.slug.slice(1) : page.slug;
        params.push({ slug: city, serviceSlug: clean });
      });
    });
    return params;
  } catch { return []; }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cityKey = params.slug.toLowerCase();
  if (!CITIES_MAP[cityKey]) return {};

  const raw = params.serviceSlug;
  const slugsToTry = [raw, `/${raw}`];
  try {
    const page = await db.servicePage.findFirst({
      where: { slug: { in: slugsToTry }, isActive: true }
    });
    if (!page) return {};
    const loc = CITIES_MAP[cityKey];
    const title = replaceLocation(page.seoTitle || page.title, loc);
    const desc = replaceLocation(page.seoDescription || '', loc);
    return {
      title: title,
      description: desc,
      keywords: page.seoKeywords ? page.seoKeywords.split(',').map(k => replaceLocation(k, loc).trim()) : undefined,
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

export default async function CityServicePage({ params }: Props) {
  const cityKey = params.slug.toLowerCase();
  if (!CITIES_MAP[cityKey]) notFound();

  const locationName = CITIES_MAP[cityKey];
  const raw = params.serviceSlug;
  const slugsToTry = [raw, `/${raw}`];

  const dbPage = await db.servicePage.findFirst({
    where: { slug: { in: slugsToTry }, isActive: true }
  });

  type PageShape = {
    id: number; slug: string; title: string; contentTitle: string | null;
    seoTitle: string | null; seoDescription: string | null; seoKeywords: string | null;
    heroDescription: string | null; content: string | null; category: string;
    image: string | null; isActive: boolean; createdAt: Date; updatedAt: Date;
  };

  let rawPage: PageShape | null = dbPage as PageShape | null;

  if (!rawPage) {
    const knownCategories = ['seo-services', 'ai-seo-services', 'social-media-marketing', 'ppc-services'];
    if (knownCategories.includes(raw)) {
      const formattedTitle = raw.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      rawPage = {
        id: 0,
        slug: raw,
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
        updatedAt: new Date(),
      };
    } else {
      notFound();
    }
  }

  let faqs: { question: string; answer: string }[] = [];
  let rawContent = rawPage.content ?? '';
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

  // Mutable plain copy with all {location} placeholders replaced — avoids mutating Prisma objects
  const page = {
    id:              rawPage.id,
    slug:            rawPage.slug,
    title:           replaceLocation(rawPage.title            ?? '', locationName),
    contentTitle:    replaceLocation(rawPage.contentTitle     ?? '', locationName),
    seoTitle:        replaceLocation(rawPage.seoTitle         ?? '', locationName),
    seoDescription:  replaceLocation(rawPage.seoDescription   ?? '', locationName),
    seoKeywords:     rawPage.seoKeywords ?? '',
    heroDescription: replaceLocation(rawPage.heroDescription  ?? '', locationName),
    content:         replaceLocation(rawContent, locationName),
    category:        rawPage.category   ?? 'website',
    image:           rawPage.image      ?? '',
    isActive:        rawPage.isActive,
    createdAt:       rawPage.createdAt,
    updatedAt:       rawPage.updatedAt,
  };

  const pageContent = page.content;


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
    return 'Explore our professional services.';
  };

  return (
    <div className="bg-white min-h-screen">
      <ServiceHero 
        title={page.title || ""} 
        description={page.heroDescription || undefined}
        city={locationName || undefined}
      />

      {/* Intro Content */}
      {pageContent && pageContent.trim() !== "" && stripHtml(pageContent).trim() !== "" && (
        <section className="py-6 bg-white border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-[30px] lg:text-[32px] font-black text-gray-900 text-center mb-2 tracking-tight leading-tight max-w-4xl mx-auto px-4">
              {page.contentTitle || `Professional ${page.title}`}
            </h2>
            <div className="w-12 h-[3px] bg-[#1a8b4c] rounded-full mx-auto mb-4" />
            <ExpandableContent htmlContent={pageContent} maxHeight={162} />
          </div>
        </section>
      )}

      {/* Related Services Grid */}
      <section id="services-grid" className="py-10 bg-white border-t border-gray-100 scroll-mt-[100px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-[32px] font-black text-gray-900 mb-3">
              More Services in {locationName}
            </h2>
            <p className="text-sm md:text-base text-gray-600 font-medium">Explore related services available in {locationName}</p>
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
                const cleanSlug = menu.slug.startsWith('/') ? menu.slug.slice(1) : menu.slug;
                const linkHref = `/${cityKey}/${cleanSlug}`;
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
            ) : (
              <p className="text-gray-500 text-center col-span-full">No additional services found in this category.</p>
            )}
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
          <h2 className="text-2xl md:text-[32px] font-black text-gray-900 mb-12">Industries We Work With in {locationName}</h2>
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

      {/* Back to city landing */}
      <section className="py-5 bg-[#f8fbfa] border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Link href={`/${cityKey}`} className="inline-flex items-center gap-2 text-[#1a8b4c] font-black text-xs uppercase tracking-wider hover:gap-3 transition-all">
            <MapPin size={14} /> View All Services in {locationName}
          </Link>
        </div>
      </section>
    </div>
  );
}
