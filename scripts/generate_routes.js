const fs = require('fs');
const path = require('path');

const routes = [
  { path: "web-design-services", title: "Web Design Services" },
  { path: "ecommerce-web-designing", title: "ECommerce Web Designing" },
  { path: "responsive-web-designing", title: "Responsive Web Designing" },
  { path: "small-business-website", title: "Small Business Website Design" },
  { path: "website-designing-by-industry", title: "Website Designing By Industry" },
  { path: "customised-website-designing", title: "Customised Website Designing" },
  { path: "website-redesigning", title: "Website Redesigning" },
  { path: "website-maintenance", title: "Website Maintenance" },
  { path: "digital-marketing", title: "Digital Marketing Services" },
  { path: "seo-services", title: "SEO Services" },
  { path: "on-page-seo", title: "On-Page SEO" },
  { path: "off-page-seo", title: "Off-Page SEO" },
  { path: "technical-seo", title: "Technical SEO" },
  { path: "local-business-seo", title: "Local SEO" },
  { path: "ai-seo-services", title: "AI SEO Services" },
  { path: "generative-engine-optimization-services", title: "GEO Services" },
  { path: "answer-engine-optimization-services", title: "AEO Services" },
  { path: "perplexity-ai-seo-services", title: "Perplexity AI SEO Services" },
  { path: "chatgpt-ai-seo-services", title: "ChatGPT AI SEO Services" },
  { path: "gemini-ai-seo-services", title: "Gemini AI SEO Services" },
  { path: "claude-ai-seo-services", title: "Claude AI SEO Services" },
  { path: "agentic-ai-seo-services", title: "Agentic AI SEO Services" },
  { path: "ai-powered-content-creation-services", title: "AI-Powered Content Services" },
  { path: "facebook-marketing", title: "Facebook Marketing" },
  { path: "instagram-marketing", title: "Instagram Marketing" },
  { path: "linkedin-marketing", title: "LinkedIn Marketing" },
  { path: "youtube-marketing", title: "YouTube Marketing" },
  { path: "smo-services", title: "SMO Services" },
  { path: "ppc-services", title: "PPC Services" },
  { path: "google-ads-management", title: "Google Ads Management" },
  { path: "content-marketing", title: "Content Marketing" },
  { path: "whatsapp-marketing", title: "WhatsApp Marketing" },
  { path: "sms-marketing", title: "SMS Marketing" },
  { path: "email-marketing", title: "Email Marketing" },
  { path: "voice-marketing", title: "Voice Marketing" }
];

const basePath = path.join(__dirname, 'src', 'app');

routes.forEach(route => {
  const dirPath = path.join(basePath, route.path);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const pagePath = path.join(dirPath, 'page.tsx');
  if (!fs.existsSync(pagePath)) {
    const componentName = route.title.replace(/[^a-zA-Z0-9]/g, '');
    const content = `import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '${route.title} | GlobalWebify',
  description: 'Professional ${route.title} tailored for your business growth.',
};

export default function ${componentName}Page() {
  return (
    <main className="pt-40 pb-20 container-custom min-h-[60vh]">
      <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-8">${route.title}</h1>
      <p className="text-xl text-gray-600 max-w-3xl leading-relaxed mb-8">
        Welcome to our ${route.title} page. Detailed content is coming soon!
      </p>
      <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100">
        <p className="text-gray-500">
          This is a placeholder for the <strong>${route.title}</strong> service page. 
        </p>
      </div>
    </main>
  );
}
`;
    fs.writeFileSync(pagePath, content);
  }
});
console.log('Successfully generated ' + routes.length + ' routes!');
