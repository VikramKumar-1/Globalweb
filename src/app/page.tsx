import React from 'react';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import HomeView from '@/features/home/components/HomeView';
import { getHomepageSeo } from '@/app/admin/(dashboard)/homepage/actions';
import { getSubdomainLocation } from '@/lib/subdomain';
import { getSubdomainContent } from '@/app/admin/(dashboard)/subdomains/actions';
import { replaceLocation } from '@/lib/replaceLocation';

export const revalidate = 3600; // Cache page and revalidate at most every hour or on-demand via revalidatePath

export async function generateMetadata(): Promise<Metadata> {
  try {
    const host = headers().get('host');
    const location = getSubdomainLocation(host);
    
    if (location) {
      const subContent = await getSubdomainContent('homepage');
      if (subContent) {
        return {
          title: replaceLocation(subContent.seoTitle || '', location) || `GlobalWeblify ${location}`,
          description: replaceLocation(subContent.seoDescription || '', location),
          keywords: `Web Development ${location}, SEO ${location}, Digital Marketing ${location}`,
        };
      }
    }

    const seo = await getHomepageSeo();
    return {
      title: seo.title || "GlobalWeblify | Web Development & Digital Marketing Agency",
      description: seo.description || "Leading Web Development, SEO, and Digital Marketing Agency in India. We build AI-powered solutions for your business growth.",
      keywords: seo.keywords || "Web Development, SEO, Digital Marketing, AI Solutions, GlobalWeblify",
    };
  } catch (error) {
    // Expected to throw DYNAMIC_SERVER_USAGE during static generation
    return {
      title: "GlobalWeblify | Web Development & Digital Marketing Agency",
      description: "Leading Web Development, SEO, and Digital Marketing Agency in India. We build AI-powered solutions for your business growth.",
      keywords: "Web Development, SEO, Digital Marketing, AI Solutions, GlobalWeblify",
    };
  }
}

export default async function Home() {
  const host = headers().get('host');
  const location = getSubdomainLocation(host);
  let subContent = null;

  if (location) {
    subContent = await getSubdomainContent('homepage');
  }

  return <HomeView location={location || undefined} subdomainContent={subContent || undefined} />;
}
