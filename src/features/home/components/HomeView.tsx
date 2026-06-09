import React from 'react';
import dynamic from 'next/dynamic';
import Hero from '@/components/sections/Hero';
import { db } from '@/lib/db';
import { FAQSection } from '@/components/sections/FAQSection';
import { getHomepageFaqs, getHeroTexts, getAboutSeo, getCityHeroSettings, getHomepageHeroDesc, getHomepageAboutCard, getSectionHeaders } from '@/app/admin/(dashboard)/homepage/actions';
import { getSubdomainHomepageFaqs, getSubdomainHomepageHeroDesc, getSubdomainAboutSeo, getSubdomainHomepageAboutCard, getSubdomainSectionHeaders } from '@/app/admin/(dashboard)/subdomains/homepage/actions';

import ServicesGrid from '@/components/sections/ServicesGrid';
import Portfolio from '@/components/sections/Portfolio';
import TechStack from '@/components/sections/TechStack';
import LatestBlog from '@/components/sections/LatestBlog';
import ResultsSection from '@/components/sections/ResultsSection';
import AboutSEO from '@/components/sections/AboutSEO';
import TrustSection from '@/components/sections/TrustSection';

function replaceLocation(text: string, loc: string = ""): string {
  if (!text) return '';
  const spanRegex = /<span class="location-tag"[^>]*>\{\s*location\s*\}<\/span>/gi;
  const rawRegex = /\{\s*location\s*\}/gi;
  
  if (!loc) {
    let cleaned = text.replace(spanRegex, '').replace(rawRegex, '');
    cleaned = cleaned.replace(/(?:in|at|for|from|within|near| -|-| ,|,| \/|\/)?\s*(?:<span class="location-tag"[^>]*>)?\{\s*location\s*\}(?:<\/span>)?\s*/gi, '');
    cleaned = cleaned.replace(/\s+/g, ' ').replace(/\s+([.,!?;:])/g, '$1');
    return cleaned.trim();
  }
  
  return text.replace(spanRegex, loc).replace(rawRegex, loc);
}

export default async function HomeView({ city, cityKey, location, subdomainContent }: { city?: string; cityKey?: string; location?: string; subdomainContent?: any } = {}) {
  let dbPosts: any[] = [];

  try {
    dbPosts = await db.blogPost.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      take: 4
    });
  } catch (e) {
    console.error("Could not fetch blogs:", e);
  }

  let homepageFaqs = [];
  let heroTexts: string[] = [];
  let homepageHeroTitle = "";
  let homepageHeroDesc = "";
  let aboutSeoData = null;
  let aboutCard: any = null;
  let sectionHeaders: any = null;

  if (location || subdomainContent) {
    try {
      homepageFaqs = await getSubdomainHomepageFaqs();
      const heroData = await getSubdomainHomepageHeroDesc();
      homepageHeroTitle = heroData.title;
      homepageHeroDesc = heroData.description;
      aboutSeoData = await getSubdomainAboutSeo();
      aboutCard = await getSubdomainHomepageAboutCard();
      sectionHeaders = await getSubdomainSectionHeaders();
    } catch (e) {
      console.error("Could not fetch subdomain homepage settings:", e);
    }
  } else {
    try {
      homepageFaqs = await getHomepageFaqs();
      heroTexts = await getHeroTexts();
      homepageHeroDesc = await getHomepageHeroDesc();
      aboutSeoData = await getAboutSeo();
      aboutCard = await getHomepageAboutCard();
      sectionHeaders = await getSectionHeaders();
    } catch (e) {
      console.error("Could not fetch global homepage settings:", e);
    }
  }

  // Load and process location for descriptions for ServicesGrid from database
  let serviceDescriptions: Record<string, string> = {};
  try {
    const services = await db.servicePage.findMany({
      where: { isActive: true },
      select: { slug: true, heroDescription: true }
    });
    services.forEach(s => {
      const key = s.slug.startsWith('/') ? s.slug.substring(1) : s.slug;
      if (s.heroDescription) {
        serviceDescriptions[key] = s.heroDescription;
      }
    });
  } catch (e) {
    console.error("Could not fetch service descriptions:", e);
  }

  // Apply Location Replacements
  const locationName = location || city || "";

  if (locationName) {
    homepageHeroTitle = replaceLocation(homepageHeroTitle, locationName);
    homepageHeroDesc = replaceLocation(homepageHeroDesc, locationName);
    
    if (aboutSeoData) {
      aboutSeoData = {
        title: replaceLocation(aboutSeoData.title, locationName),
        subtitle: replaceLocation(aboutSeoData.subtitle, locationName),
        content: replaceLocation(aboutSeoData.content, locationName)
      };
    }
    
    if (aboutCard) {
      aboutCard = {
        ...aboutCard,
        title: replaceLocation(aboutCard.title, locationName),
        content: replaceLocation(aboutCard.content, locationName)
      };
    }

    if (sectionHeaders) {
      for (const key of Object.keys(sectionHeaders)) {
        if (sectionHeaders[key]) {
          sectionHeaders[key].title = replaceLocation(sectionHeaders[key].title, locationName);
          sectionHeaders[key].description = replaceLocation(sectionHeaders[key].description, locationName);
        }
      }
    }

    // Overrides from subdomain content if needed
    if (subdomainContent?.title) {
      homepageHeroTitle = replaceLocation(subdomainContent.title, locationName);
    }
    if (subdomainContent?.heroDescription) {
      homepageHeroDesc = replaceLocation(subdomainContent.heroDescription, locationName);
    }
  }

  const processedPosts = dbPosts.map(p => ({
    ...p,
    title: replaceLocation(p.title, locationName),
    summary: replaceLocation(p.summary || '', locationName)
  }));

  return (
    <div className="bg-white overflow-hidden pb-12">
      
      {/* Background Wavy Pattern */}
      <div className="fixed inset-0 -z-10 pointer-events-none opacity-[0.04]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern id="waves" width="100" height="20" patternUnits="userSpaceOnUse">
            <path d="M0 10 Q 25 0, 50 10 T 100 10" fill="none" stroke="#22c55e" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#waves)" />
        </svg>
      </div>

      {/* New Hero Section Component */}
      <Hero city={locationName} heroTexts={heroTexts} homepageHeroTitle={homepageHeroTitle} homepageHeroDesc={homepageHeroDesc} />

      <div className="space-y-0">
        {/* New Services Grid Section */}
        <ServicesGrid cityKey={cityKey} dynamicDescriptions={serviceDescriptions} location={locationName} sectionTitle={sectionHeaders?.services?.title} sectionDesc={sectionHeaders?.services?.description} />

        <Portfolio sectionTitle={sectionHeaders?.portfolio?.title} sectionDesc={sectionHeaders?.portfolio?.description} />

        <TechStack sectionTitle={sectionHeaders?.techStack?.title} sectionDesc={sectionHeaders?.techStack?.description} />

        <LatestBlog dbPosts={processedPosts} sectionTitle={sectionHeaders?.latestBlog?.title} sectionDesc={sectionHeaders?.latestBlog?.description} />

        <ResultsSection cardData={aboutCard} />

        {(!cityKey || subdomainContent) && <AboutSEO data={aboutSeoData} />}
        <TrustSection sectionTitle={sectionHeaders?.trust?.title} sectionDesc={sectionHeaders?.trust?.description} />
        {homepageFaqs.length > 0 && <FAQSection faqs={homepageFaqs} sectionTitle={sectionHeaders?.faq?.title} sectionDesc={sectionHeaders?.faq?.description} />}
      </div>

    </div>
  );
}
