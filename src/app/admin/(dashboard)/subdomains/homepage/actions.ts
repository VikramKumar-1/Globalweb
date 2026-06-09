'use server';

import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

const defaultHeroTexts = [
  "वेबसाइट जो ब्रांड भी बनाए, बिज़नेस भी बढ़ाए।",
  "Websites that build brands, and grow businesses."
];

// 1. FAQs
export async function getSubdomainHomepageFaqs() {
  try {
    const setting = await db.siteSetting.findUnique({ where: { key: 'subdomainHomepageFaqs' } });
    if (setting) return JSON.parse(setting.value);
    return [];
  } catch (error) {
    console.error("Failed to read subdomain homepage FAQs", error);
    return [];
  }
}

export async function saveSubdomainHomepageFaqs(faqs: { question: string, answer: string }[]) {
  try {
    await requireAdmin();
    const value = JSON.stringify(faqs);
    await db.siteSetting.upsert({
      where: { key: 'subdomainHomepageFaqs' },
      update: { value },
      create: { key: 'subdomainHomepageFaqs', value }
    });
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    console.error("Failed to save subdomain homepage FAQs", error);
    return { success: false, error: error.message };
  }
}

// 2. Hero Texts
export async function getSubdomainHeroTexts() {
  try {
    const setting = await db.siteSetting.findUnique({ where: { key: 'subdomainHomepageHeroTexts' } });
    if (setting) return JSON.parse(setting.value);
    return defaultHeroTexts;
  } catch (error) {
    console.error("Failed to read subdomain homepage hero texts", error);
    return defaultHeroTexts;
  }
}

export async function saveSubdomainHeroTexts(texts: string[]) {
  try {
    await requireAdmin();
    const value = JSON.stringify(texts);
    await db.siteSetting.upsert({
      where: { key: 'subdomainHomepageHeroTexts' },
      update: { value },
      create: { key: 'subdomainHomepageHeroTexts', value }
    });
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    console.error("Failed to save subdomain homepage hero texts", error);
    return { success: false, error: error.message };
  }
}

// 3. About SEO
const defaultAboutSeo = {
  title: "Web Design & Web Development <span class=\"text-[#1a8b4c]\">Services in {location}</span>",
  subtitle: "Professional Web Design Solutions for Global Brands",
  content: "<p>Need to lift your online presence? Yes. We at <strong>Global Webify</strong> are your trusted partner to boost your digital growth within the shortest time possible...</p>"
};

export async function getSubdomainAboutSeo() {
  try {
    const setting = await db.siteSetting.findUnique({ where: { key: 'subdomainHomepageAboutSeo' } });
    if (setting) {
      let parsed = JSON.parse(setting.value);
      return parsed;
    }
    return defaultAboutSeo;
  } catch (error) {
    console.error("Failed to read subdomain homepage AboutSEO settings", error);
    return defaultAboutSeo;
  }
}

export async function saveSubdomainAboutSeo(aboutData: { title: string; subtitle: string; content: string }) {
  try {
    await requireAdmin();
    const value = JSON.stringify(aboutData);
    await db.siteSetting.upsert({
      where: { key: 'subdomainHomepageAboutSeo' },
      update: { value },
      create: { key: 'subdomainHomepageAboutSeo', value }
    });
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    console.error("Failed to save subdomain homepage AboutSEO settings", error);
    return { success: false, error: error.message };
  }
}

// 4. Homepage Hero Desc (and Title)
import { getSubdomainContent, saveSubdomainContent } from '../actions';

export async function getSubdomainHomepageHeroDesc() {
  try {
    const content = await getSubdomainContent('homepage');
    if (content) {
      return {
        title: content.title || "Grow your business in {location} today",
        description: content.heroDescription || "We help businesses in {location} get more leads."
      };
    }
    return {
      title: "Grow your business in {location} today",
      description: "We help businesses in {location} get more leads."
    };
  } catch (error) {
    console.error("Failed to read subdomain homepage hero description", error);
    return { title: "", description: "" };
  }
}

export async function saveSubdomainHomepageHeroDesc(data: { title: string, description: string }) {
  try {
    await requireAdmin();
    const content = await getSubdomainContent('homepage');
    await saveSubdomainContent({
      pageType: 'homepage',
      title: data.title,
      heroTitle: content?.heroTitle || undefined,
      heroDescription: data.description,
      seoTitle: content?.seoTitle || undefined,
      seoDescription: content?.seoDescription || undefined,
      seoKeywords: content?.seoKeywords || undefined,
      content: content?.content || '',
    });
    return { success: true };
  } catch (error: any) {
    console.error("Failed to save subdomain homepage hero description", error);
    return { success: false, error: error.message };
  }
}

// 5. SEO Settings
export async function getSubdomainHomepageSeo() {
  try {
    const defaultSeo = {
      title: "Best Web Development Agency in {location} | GlobalWebify",
      description: "Looking for a web development company in {location}? We provide top tier digital marketing and web design services.",
      keywords: "Web Development {location}, SEO {location}, Digital Marketing {location}"
    };
    const content = await getSubdomainContent('homepage');
    if (content && (content.seoTitle || content.seoDescription || content.seoKeywords)) {
      return {
        title: content.seoTitle || defaultSeo.title,
        description: content.seoDescription || defaultSeo.description,
        keywords: content.seoKeywords || defaultSeo.keywords
      };
    }
    return defaultSeo;
  } catch (error) {
    console.error("Failed to read subdomain homepage SEO", error);
    return { title: '', description: '', keywords: '' };
  }
}

export async function saveSubdomainHomepageSeo(data: { title: string; description: string; keywords: string }) {
  try {
    await requireAdmin();
    const content = await getSubdomainContent('homepage');
    await saveSubdomainContent({
      pageType: 'homepage',
      title: content?.title || undefined,
      heroTitle: content?.heroTitle || undefined,
      heroDescription: content?.heroDescription || undefined,
      seoTitle: data.title,
      seoDescription: data.description,
      seoKeywords: data.keywords,
      content: content?.content || '',
    });
    return { success: true };
  } catch (error: any) {
    console.error("Failed to save subdomain homepage SEO", error);
    return { success: false, error: error.message };
  }
}

// 6. Homepage About Card (Growth Agency)
const defaultAboutCard = {
  title: "Data-Driven <br /> Growth Agency in {location}",
  content: "We offer AI-powered digital marketing services to help businesses in {location} appear in Google AI, ChatGPT, and Perplexity recommendations.\n\nOur strategies are focused on sustainable, ethical, and conversion-oriented growth for local brands.",
  buttonText: "Read More"
};

export async function getSubdomainHomepageAboutCard() {
  try {
    const setting = await db.siteSetting.findUnique({ where: { key: 'subdomainHomepageAboutCard' } });
    if (setting) {
      const parsed = JSON.parse(setting.value);
      return { ...defaultAboutCard, ...parsed };
    }
    return defaultAboutCard;
  } catch (error) {
    console.error("Failed to read subdomain homepage About Card settings", error);
    return defaultAboutCard;
  }
}

export async function saveSubdomainHomepageAboutCard(data: { title: string; content: string; buttonText: string }) {
  try {
    await requireAdmin();
    const value = JSON.stringify(data);
    await db.siteSetting.upsert({
      where: { key: 'subdomainHomepageAboutCard' },
      update: { value },
      create: { key: 'subdomainHomepageAboutCard', value }
    });
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    console.error("Failed to save subdomain homepage About Card settings", error);
    return { success: false, error: error.message };
  }
}

// 7. Section Headers
const defaultSubdomainSectionHeaders = {
  services: { title: "Our Premium Services in {location}", description: "Elevate your business in {location} with our top-tier digital solutions." },
  portfolio: { title: "Our Digital Masterpieces", description: "A showcase of our best work and client successes." },
  techStack: { title: "Our Technology Arsenal", description: "We use the latest technology stack to build robust and scalable solutions." },
  latestBlog: { title: "Digital Insights & Strategies", description: "Stay ahead of the curve with our latest articles and news." },
  trust: { title: "Why Leading Brands Trust Us", description: "We deliver results that matter to your bottom line." },
  faq: { title: "Frequently Asked Questions", description: "Everything you need to know about our services." }
};

export async function getSubdomainSectionHeaders() {
  try {
    const setting = await db.siteSetting.findUnique({ where: { key: 'subdomainHomepageSectionHeaders' } });
    if (setting) return { ...defaultSubdomainSectionHeaders, ...JSON.parse(setting.value) };
    return defaultSubdomainSectionHeaders;
  } catch (error) {
    console.error("Failed to read subdomain section headers", error);
    return defaultSubdomainSectionHeaders;
  }
}

export async function saveSubdomainSectionHeaders(headers: any) {
  try {
    await requireAdmin();
    const value = JSON.stringify(headers);
    await db.siteSetting.upsert({
      where: { key: 'subdomainHomepageSectionHeaders' },
      update: { value },
      create: { key: 'subdomainHomepageSectionHeaders', value }
    });
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    console.error("Failed to save subdomain section headers", error);
    return { success: false, error: error.message };
  }
}
