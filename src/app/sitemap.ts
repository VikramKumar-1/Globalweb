import { MetadataRoute } from 'next';

const BASE_URL = 'https://globalwebify.com';

const routes = [
  "",
  "contact",
  "web-design-services",
  "ecommerce-web-designing",
  "responsive-web-designing",
  "small-business-website",
  "website-designing-by-industry",
  "customised-website-designing",
  "website-redesigning",
  "website-maintenance",
  "digital-marketing",
  "seo-services",
  "on-page-seo",
  "off-page-seo",
  "technical-seo",
  "local-business-seo",
  "ai-seo-services",
  "generative-engine-optimization-services",
  "answer-engine-optimization-services",
  "perplexity-ai-seo-services",
  "chatgpt-ai-seo-services",
  "gemini-ai-seo-services",
  "claude-ai-seo-services",
  "agentic-ai-seo-services",
  "ai-powered-content-creation-services",
  "facebook-marketing",
  "instagram-marketing",
  "linkedin-marketing",
  "youtube-marketing",
  "smo-services",
  "ppc-services",
  "google-ads-management",
  "content-marketing",
  "whatsapp-marketing",
  "sms-marketing",
  "email-marketing",
  "voice-marketing"
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map(route => ({
    url: `${BASE_URL}${route ? `/${route}` : ''}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === "" ? 1.0 : 0.8,
  }));
}
