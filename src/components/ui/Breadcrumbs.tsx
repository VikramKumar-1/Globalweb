"use client";

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { 
  NAV_LINKS, 
  WEBSITE_SERVICES, 
  HOSTING_SERVICES, 
  MARKETING_SERVICES, 
  BRANDING_SERVICES, 
  COMPANY_LINKS 
} from '@/constants/navigation';
import { CITIES_MAP } from '@/features/services/constants/cities';

const ROUTE_NAMES: Record<string, string> = {
  '': 'Home',
  'web-design-services': 'Web Design Services',
  'ecommerce-web-designing': 'ECommerce Web Designing',
  'responsive-web-designing': 'Responsive Web Designing',
  'small-business-website': 'Small Business Website',
  'website-designing-by-industry': 'Website Designing by Industry',
  'customised-website-designing': 'Customised Website Designing',
  'website-redesigning': 'Website Redesigning',
  'website-maintenance': 'Website Maintenance',
  'digital-marketing': 'Digital Marketing',
  'seo-services': 'SEO Services',
  'on-page-seo': 'On-Page SEO',
  'off-page-seo': 'Off-Page SEO',
  'technical-seo': 'Technical SEO',
  'local-business-seo': 'Local SEO',
  'ai-seo-services': 'AI SEO Services',
  'generative-engine-optimization-services': 'GEO Services',
  'answer-engine-optimization-services': 'AEO Services',
  'perplexity-ai-seo-services': 'Perplexity AI SEO',
  'chatgpt-ai-seo-services': 'ChatGPT AI SEO',
  'gemini-ai-seo-services': 'Gemini AI SEO',
  'claude-ai-seo-services': 'Claude AI SEO',
  'agentic-ai-seo-services': 'Agentic AI SEO',
  'ai-powered-content-creation-services': 'AI Content Services',
  'facebook-marketing': 'Facebook Marketing',
  'instagram-marketing': 'Instagram Marketing',
  'linkedin-marketing': 'LinkedIn Marketing',
  'youtube-marketing': 'YouTube Marketing',
  'smo-services': 'SMO Services',
  'ppc-services': 'PPC Services',
  'google-ads-management': 'Google Ads Management',
  'content-marketing': 'Content Marketing',
  'whatsapp-marketing': 'WhatsApp Marketing',
  'sms-marketing': 'SMS Marketing',
  'email-marketing': 'Email Marketing',
  'voice-marketing': 'Voice Marketing',
  'web-development': 'Web Development',
  'social-media-marketing': 'Social Media Marketing',
  'about': 'About Us',
  'contact': 'Contact Us',
  'portfolio': 'Our Portfolio',
  'gallery': 'Our Gallery',
  'blog': 'Blog',
  'branding-pr': 'Branding & PR',
  'graphic-design': 'Graphic Design'
};

interface ParentRoute {
  name: string;
  href: string;
}

const PARENT_MAP: Record<string, ParentRoute> = {
  // Web Design subpages
  'ecommerce-web-designing': { name: 'Web Design', href: '/web-design-services' },
  'responsive-web-designing': { name: 'Web Design', href: '/web-design-services' },
  'small-business-website': { name: 'Web Design', href: '/web-design-services' },
  'website-designing-by-industry': { name: 'Web Design', href: '/web-design-services' },
  'customised-website-designing': { name: 'Web Design', href: '/web-design-services' },
  'website-redesigning': { name: 'Web Design', href: '/web-design-services' },
  'website-maintenance': { name: 'Web Design', href: '/web-design-services' },

  // SEO subpages
  'on-page-seo': { name: 'SEO Services', href: '/seo-services' },
  'off-page-seo': { name: 'SEO Services', href: '/seo-services' },
  'technical-seo': { name: 'SEO Services', href: '/seo-services' },
  'local-business-seo': { name: 'SEO Services', href: '/seo-services' },
  'ai-seo-services': { name: 'SEO Services', href: '/seo-services' },
  'generative-engine-optimization-services': { name: 'SEO Services', href: '/seo-services' },
  'answer-engine-optimization-services': { name: 'SEO Services', href: '/seo-services' },

  // AI SEO subpages
  'perplexity-ai-seo-services': { name: 'AI SEO Services', href: '/ai-seo-services' },
  'chatgpt-ai-seo-services': { name: 'AI SEO Services', href: '/ai-seo-services' },
  'gemini-ai-seo-services': { name: 'AI SEO Services', href: '/ai-seo-services' },
  'claude-ai-seo-services': { name: 'AI SEO Services', href: '/ai-seo-services' },
  'agentic-ai-seo-services': { name: 'AI SEO Services', href: '/ai-seo-services' },
  'ai-powered-content-creation-services': { name: 'AI SEO Services', href: '/ai-seo-services' },

  // Digital Marketing subpages
  'facebook-marketing': { name: 'Digital Marketing', href: '/digital-marketing' },
  'instagram-marketing': { name: 'Digital Marketing', href: '/digital-marketing' },
  'linkedin-marketing': { name: 'Digital Marketing', href: '/digital-marketing' },
  'youtube-marketing': { name: 'Digital Marketing', href: '/digital-marketing' },
  'smo-services': { name: 'Digital Marketing', href: '/digital-marketing' },
  'ppc-services': { name: 'Digital Marketing', href: '/digital-marketing' },
  'google-ads-management': { name: 'Digital Marketing', href: '/digital-marketing' },
  'content-marketing': { name: 'Digital Marketing', href: '/digital-marketing' },
  'whatsapp-marketing': { name: 'Digital Marketing', href: '/digital-marketing' },
  'sms-marketing': { name: 'Digital Marketing', href: '/digital-marketing' },
  'email-marketing': { name: 'Digital Marketing', href: '/digital-marketing' },
  'voice-marketing': { name: 'Digital Marketing', href: '/digital-marketing' }
};

const DEEP_PARENT_MAP: Record<string, ParentRoute> = {
  'ai-seo-services': { name: 'SEO Services', href: '/seo-services' }
};

const CITY_NAMES: Record<string, string> = {};
Object.keys(CITIES_MAP).forEach((key) => {
  CITY_NAMES[key] = CITIES_MAP[key].name;
});

export const Breadcrumbs = ({ pathname, dynamicPages = [] }: { pathname: string, dynamicPages?: any[] }) => {
  if (pathname === '/' || pathname === '') return null;

  const citySlugs = Object.keys(CITIES_MAP);
  const segments = pathname.split('/').filter(Boolean);
  const hasCity = segments.length > 0 && citySlugs.includes(segments[0].toLowerCase());
  const cityPrefix = hasCity ? segments[0].toLowerCase() : null;

  const cleanSegments = hasCity ? segments.slice(1) : segments;
  const lookupPathname = '/' + cleanSegments.join('/');
  const currentSegment = cleanSegments[cleanSegments.length - 1] || '';

  const getPrefixedHref = (href: string) => {
    if (!cityPrefix) return href;
    if (href === '/' || href === '#' || href.startsWith('http')) return href;
    return `/${cityPrefix}${href.startsWith('/') ? href : `/${href}`}`;
  };

  // Map navbar IDs to their respective service lists
  const getServiceList = (id: string) => {
    switch (id) {
      case 'website': return WEBSITE_SERVICES;
      case 'hosting': return HOSTING_SERVICES;
      case 'marketing': return MARKETING_SERVICES;
      case 'branding': return BRANDING_SERVICES;
      case 'company': return COMPANY_LINKS;
      default: return [];
    }
  };

  const breadcrumbsList: { name: string; href: string }[] = [
    { name: 'Home', href: '/' }
  ];

  // Add city crumb after Home when user is on a city page
  if (cityPrefix) {
    breadcrumbsList.push({ name: CITY_NAMES[cityPrefix] || cityPrefix, href: `/${cityPrefix}` });
  }

  // Add Blog crumb if we are on a blog post page
  if (cleanSegments.length > 1 && cleanSegments[0] === 'blog') {
    breadcrumbsList.push({ name: 'Blog', href: '/blog' });
  }

  // Deep search the navigation tree to find the exact hierarchy
  const findNavHierarchy = (targetPath: string) => {
    if (targetPath === '/blog') {
      return null;
    }
    for (const navLink of NAV_LINKS) {
      if (!navLink.hasDropdown) continue;
      
      const services = getServiceList(navLink.id);
      
      for (const service of services) {
        // Direct match at the first level
        if (service.href === targetPath) {
          return [
            { name: navLink.name, href: '#' } // Root Navbar category
          ];
        }

        // Check nested subLinks (e.g., SEO Services -> On-Page SEO)
        if ((service as any).subLinks) {
          for (const subLink of (service as any).subLinks) {
            if (subLink.href === targetPath) {
              return [
                { name: navLink.name, href: '#' }, // Root Navbar category (unclickable dropdown)
                { name: service.name, href: getPrefixedHref(service.href) }  // Sub-category IS a real page! Make it clickable and prefixed
              ];
            }
          }
        }
      }
    }
    return null; // Not found in navbar
  };

  const parents = findNavHierarchy(lookupPathname);
  if (parents) {
    breadcrumbsList.push(...parents);
  } else {
    // Fallback: If not in navbar, just try to get the category from the DB
    const cleanPathname = lookupPathname.replace(/^\//, '');
    const cleanSegment = currentSegment.replace(/^\//, '');
    const matchedPage = dynamicPages.find(p => {
      const pSlug = p.slug.replace(/^\//, '');
      return pSlug === cleanPathname || pSlug === cleanSegment;
    });

    if (matchedPage && matchedPage.category && matchedPage.category !== 'blog') {
      const formattedCategory = matchedPage.category
        .split(/[\s-]+/)
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
      breadcrumbsList.push({ name: formattedCategory, href: '#' });
    }
  }

  // Use dynamic title if available from DB, otherwise use hardcoded name or formatted slug
  const cleanPathname = lookupPathname.replace(/^\//, '');
  const cleanSegment = currentSegment.replace(/^\//, '');
  const matchedPage = dynamicPages.find(p => {
    const pSlug = p.slug.replace(/^\//, '');
    return pSlug === cleanPathname || pSlug === cleanSegment;
  });
  
  // Find name from navbar if available to guarantee 100% consistency
  let navbarName = null;
  for (const nav of NAV_LINKS) {
    const services = getServiceList(nav.id);
    for (const s of services) {
      if (s.href === lookupPathname && !navbarName) navbarName = s.name;
      if ((s as any).subLinks) {
        for (const sub of (s as any).subLinks) {
          if (sub.href === lookupPathname && !navbarName) navbarName = sub.name;
        }
      }
    }
  }

  let currentName = navbarName || matchedPage?.title || ROUTE_NAMES[currentSegment] || currentSegment.replace(/-/g, ' ');
  if (currentSegment === 'blog') {
    currentName = 'Blog';
  }

  breadcrumbsList.push({
    name: currentName,
    href: getPrefixedHref(lookupPathname)
  });

  // Dynamic JSON-LD Structured Data for Googlebot (100% SEO-Friendly Validation)
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbsList.map((crumb, index) => {
      const isLast = index === breadcrumbsList.length - 1;
      return {
        "@type": "ListItem",
        "position": index + 1,
        "name": crumb.name,
        // SEO Best Practice: Do not include 'item' url for the last active breadcrumb
        ...(isLast ? {} : { "item": `https://globalwebify.com${crumb.href}` })
      };
    })
  };

  return (
    <>
      {/* Injecting JSON-LD schema markup dynamically into the head */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <nav 
        aria-label="Breadcrumb" 
        className="flex items-center gap-0.5 md:gap-1 text-[12px] md:text-[14px] font-sans select-none max-w-full flex-wrap py-1 md:py-2"
      >
        {breadcrumbsList.map((crumb, index) => {
          const isFirst = index === 0;
          const isLast = index === breadcrumbsList.length - 1;

          return (
            <React.Fragment key={`${crumb.href}-${index}`}>
              {index > 0 && (
                // Solid brand green chevron matching the style of the user screenshot
                <ChevronRight className="w-3 h-3 md:w-[15px] md:h-[15px] text-[#1a8b4c] shrink-0" strokeWidth={2.8} />
              )}
              
              {isLast ? (
                // Active Pill (Current Page)
                <div className="bg-[#eff6ff] text-[#1d4ed8] border border-[#3b82f6]/30 font-bold px-2.5 md:px-4 py-1.5 md:py-2 rounded-full text-[11.5px] md:text-[13.5px] tracking-tight shadow-sm select-text shrink-0">
                  {crumb.name}
                </div>
              ) : crumb.href === '#' ? (
                // Unclickable Parent Pill (from dynamic category)
                <div className="bg-[#eefcf3] text-[#1a8b4c] font-bold px-2.5 md:px-4 py-1.5 md:py-2 rounded-full text-[11.5px] md:text-[13.5px] uppercase tracking-wide shrink-0">
                  {crumb.name}
                </div>
              ) : (
                <Link
                  href={crumb.href}
                  className="shrink-0 block"
                >
                  {isFirst ? (
                    // Home Pill
                    <div className="flex items-center gap-1 md:gap-1.5 bg-[#eefcf3] text-[#1a8b4c] hover:bg-[#dcfce7] transition-colors duration-150 font-bold px-2.5 md:px-4 py-1.5 md:py-2 rounded-full text-[11.5px] md:text-[13.5px]">
                      <Home className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#1a8b4c] fill-[#1a8b4c] shrink-0" strokeWidth={2} />
                      <span>Home</span>
                    </div>
                  ) : (
                    // Hardcoded Parent Pill (Fallback)
                    <div className="bg-[#eefcf3] text-[#1a8b4c] hover:bg-[#dcfce7] transition-colors duration-150 font-bold px-2.5 md:px-4 py-1.5 md:py-2 rounded-full text-[11.5px] md:text-[13.5px] uppercase tracking-wide">
                      {crumb.name}
                    </div>
                  )}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </nav>
    </>
  );
};
