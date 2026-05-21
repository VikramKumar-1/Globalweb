"use client";

import React from 'react';
import ServiceHero from '@/components/sections/ServiceHero';
import Link from 'next/link';
import { ExpandableContent } from '@/components/ui/ExpandableContent';
import { CardIcon } from '@/components/ui/CardIcon';
import { ArrowRight, Monitor, Smartphone, ShoppingCart, Layout, Palette, Settings, Code, Briefcase, Building2, HeartPulse, Users, Home, ShoppingBag, Sparkles, Utensils, GraduationCap, Plane, HeartHandshake, Hotel, Gem, Newspaper } from 'lucide-react';
import { FAQSection, FAQItem } from '@/components/sections/FAQSection';

type SubMenu = {
  title: string;
  slug: string;
  seoDescription: string | null;
  heroDescription?: string | null;
  content: string | null;
  image: string | null;
};

const ICONS = [Monitor, Smartphone, ShoppingCart, Layout, Palette, Settings, Code, Briefcase];
const COLORS = ["text-cyan-600", "text-blue-600", "text-purple-600", "text-emerald-600", "text-rose-500", "text-orange-500"];

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

export default function WebDevClient({ subMenus = [], pageData, faqs = [] }: { subMenus?: SubMenu[], pageData?: any, faqs?: FAQItem[] }) {
  
  const getDesc = (m: SubMenu) => {
    if (m.heroDescription) return m.heroDescription;
    if (m.seoDescription) return m.seoDescription;
    if (m.content) return m.content.replace(/<[^>]+>/g, '').substring(0, 150) + '...';
    return "Explore our professional web services designed for performance and scale.";
  };

  return (
    <div className="bg-white min-h-screen">
      <ServiceHero 
        title={pageData?.title || "Web Development"} 
        description={pageData?.heroDescription} 
      />
      
      {/* Intro Section */}
      {pageData?.content && pageData.content.trim() !== "" && pageData.content !== "<p></p>" && pageData.content !== "<p><br></p>" && (
        <section className="py-6 bg-white border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Centered title - slightly larger */}
            <h2 className="text-2xl md:text-[30px] lg:text-[32px] font-black text-gray-900 text-center mb-2 tracking-tight leading-tight max-w-4xl mx-auto px-4">
              {pageData.contentTitle || `Professional ${pageData?.title || 'Website Development Services'}`}
            </h2>
            <div className="w-12 h-[3px] bg-[#1a8b4c] rounded-full mx-auto mb-4" />
            
            <ExpandableContent 
              htmlContent={pageData.content}
              maxHeight={162}
            />
          </div>
        </section>
      )}

      {/* Services Grid Section */}
      <section id="services-grid" className="py-10 bg-white border-t border-gray-100 scroll-mt-[100px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-[32px] font-black text-gray-900 mb-3">
              Why Our Web Development Services Deliver Better Results
            </h2>
            <p className="text-sm md:text-base text-gray-600 font-medium">
              We Bring Life To The "Few Megabytes Of Virtual Space" You Own
            </p>
          </div>
          
          <input type="checkbox" id="show-more-cards" className="peer hidden" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-[1200px] mx-auto peer-checked:[&_.card-item]:!block">
            {subMenus.length > 0 ? (
              subMenus.map((menu, i) => {
                const Icon = ICONS[i % ICONS.length];
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
                
                return (
                  <Link href={linkHref} key={i} className={`card-item relative min-h-[260px] md:min-h-[320px] bg-white rounded-2xl border border-gray-200/80 transition-all duration-300 ease-out overflow-hidden hover:-translate-y-1.5 hover:shadow-[0_16px_40px_-12px_rgba(0,0,0,0.08)] ${theme.hoverBorder} group ${i >= 6 ? 'hidden md:block' : 'block'} flex flex-col`}>
                    {/* Top accent line */}
                    <div className="h-[3px] w-full rounded-t-2xl" style={{ background: `linear-gradient(90deg, ${theme.hex}, ${theme.hex}88)` }} />
                    <div className={`absolute inset-0 opacity-10 group-hover:opacity-30 transition-opacity duration-700 ${theme.mesh} blur-[50px] rounded-full`} />
                    <div className="relative z-20 flex-1 p-5 sm:p-6 md:p-7 flex flex-col items-start text-left h-full">
                      <div className="relative mb-4 md:mb-5">
                        <div className={`absolute inset-0 rounded-xl blur-[8px] scale-110 opacity-10 group-hover:opacity-20 transition-opacity ${theme.bg}`} />
                        <div className={`relative w-11 h-11 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-white transition-all duration-300 group-hover:scale-105 ${theme.bg}`}>
                          <CardIcon iconName={Icon.displayName || Icon.name || 'Monitor'} colorClass="!w-4 !h-4 md:!w-5 md:!h-5 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col w-full">
                        <h3 className="text-[17px] md:text-[19px] font-bold font-lexend mb-2.5 leading-snug tracking-[-0.01em] group-hover:text-gray-950 transition-colors" style={{ color: "#064e3b" }}>
                          {menu.title}
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
              <p className="text-gray-500 text-center col-span-full">No active services found.</p>
            )}
          </div>
          {subMenus.length > 6 && (
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

      {/* Industries Section */}
      <section className="py-10 bg-white border-t border-gray-100 font-lexend">
        <div className="max-w-[1250px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-[32px] font-black text-gray-900 mb-12">
            Industries We Work With
          </h2>
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
