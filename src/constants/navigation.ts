export const SOCIAL_LINKS = [
  { 
    name: 'Facebook', 
    href: 'https://www.facebook.com/global.webify', 
    bg: '#1877F2', 
    icon: 'https://cdn.simpleicons.org/facebook/white' 
  },
  { 
    name: 'Twitter', 
    href: 'https://x.com/globalwebify', 
    bg: '#000000', 
    icon: 'https://cdn.simpleicons.org/x/white' 
  },
  { 
    name: 'Linkedin', 
    href: 'https://www.linkedin.com/company/global-webify/', 
    bg: '#0077b5', 
    icon: 'https://img.icons8.com/ios-filled/100/ffffff/linkedin.png' 
  },
  { 
    name: 'Instagram', 
    href: 'https://www.instagram.com/globalwebifyranchi/', 
    bg: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', 
    icon: 'https://cdn.simpleicons.org/instagram/white' 
  },
  { 
    name: 'Youtube', 
    href: 'https://www.youtube.com/@globalwebify', 
    bg: '#FF0000', 
    icon: 'https://cdn.simpleicons.org/youtube/white' 
  }
];

export const TOP_BAR_CONTACT = {
  phone1: '+91 7563901100',
  phone2: '1800-890-5489',
  email: 'help@globalwebify.com'
};

export const WEBSITE_SERVICES = [
  { name: "Web Development", href: "/web-development" },
  { name: "Web Design Services", href: "/web-design-services" },
  { name: "ECommerce Web Designing", href: "/ecommerce-web-designing" },
  { name: "Responsive Web Designing", href: "/responsive-web-designing" },
  { name: "Small Business Website", href: "/small-business-website" },
  { name: "Website Designing By Industry", href: "/website-designing-by-industry" },
  { name: "Customised Website Designing", href: "/customised-website-designing" },
  { name: "Website Redesigning", href: "/website-redesigning" },
  { name: "Website Maintenance", href: "/website-maintenance" }
];

export const HOSTING_SERVICES = [
  { name: "Shared Hosting", href: "/shared-hosting" },
  { name: "VPS Hosting", href: "/vps-hosting" },
  { name: "Dedicated Servers", href: "/dedicated-servers" },
  { name: "Cloud Hosting", href: "/cloud-hosting" },
  { name: "WordPress Hosting", href: "/wordpress-hosting" },
  { name: "Domain Registration", href: "/domain-registration" },
  { name: "Domain Transfer", href: "/domain-transfer" },
  { name: "Business Email", href: "/business-email" },
  { name: "SSL Certificates", href: "/ssl-certificates" }
];

export const MARKETING_SERVICES = [
  { name: "Digital Marketing Services", href: "/digital-marketing" },
  { name: "SEO Services", href: "/seo-services", subLinks: [
      { name: "On-Page SEO", href: "/on-page-seo" },
      { name: "Off-Page SEO", href: "/off-page-seo" },
      { name: "Technical SEO", href: "/technical-seo" },
      { name: "Local SEO", href: "/local-business-seo" }
  ]},
  { name: "AI SEO Services", href: "/ai-seo-services", subLinks: [
      { name: "GEO Services", href: "/generative-engine-optimization-services" },
      { name: "AEO Services", href: "/answer-engine-optimization-services" },
      { name: "Perplexity AI SEO", href: "/perplexity-ai-seo-services" },
      { name: "ChatGPT AI SEO", href: "/chatgpt-ai-seo-services" },
      { name: "Gemini AI SEO", href: "/gemini-ai-seo-services" },
      { name: "Claude AI SEO", href: "/claude-ai-seo-services" },
      { name: "Agentic AI SEO", href: "/agentic-ai-seo-services" },
      { name: "AI-Powered Content", href: "/ai-powered-content-creation-services" }
  ]},
  { name: "Social Media Marketing", href: "/social-media-marketing", subLinks: [
      { name: "Facebook Marketing", href: "/facebook-marketing" },
      { name: "Instagram Marketing", href: "/instagram-marketing" },
      { name: "LinkedIn Marketing", href: "/linkedin-marketing" },
      { name: "YouTube Marketing", href: "/youtube-marketing" }
  ]},
  { name: "SMO Services", href: "/smo-services" },
  { name: "PPC Services", href: "/ppc-services", subLinks: [
      { name: "Google Ads Management", href: "/google-ads-management" }
  ]},
  { name: "Content Marketing", href: "/content-marketing" },
  { name: "WhatsApp Marketing", href: "/whatsapp-marketing" },
  { name: "SMS Marketing", href: "/sms-marketing" },
  { name: "Email Marketing", href: "/email-marketing" },
  { name: "Voice Marketing", href: "/voice-marketing" }
];

export const BRANDING_SERVICES = [
  { name: "Logo Designing", href: "/logo-designing" },
  { name: "Corporate Identity", href: "/corporate-identity" },
  { name: "Brochure Designing", href: "/brochure-designing" },
  { name: "Social Media Graphics", href: "/social-media-graphics" },
  { name: "PR Distribution", href: "/pr-distribution" },
  { name: "Online Reputation", href: "/online-reputation" },
  { name: "Event Management", href: "/event-management" }
];

export const COMPANY_LINKS = [
  { name: "About Us", href: "/about" },
  { name: "Our Process", href: "/about" },
  { name: "Our Team", href: "/team" },
  { name: "Careers", href: "/about" },
  { name: "Gallery", href: "/gallery" },
  { name: "Blogs", href: "/blog" },
  { name: "Portfolio", href: "/portfolio" },
  { name: "Market Area", href: "/market-area" }
];

export const NAV_LINKS = [
  { name: 'WEBSITE', id: 'website', hasDropdown: true },
  { name: 'HOSTING', id: 'hosting', hasDropdown: true },
  { name: 'DIGITAL MARKETING', id: 'marketing', hasDropdown: true },
  { name: 'BRANDING & PR', id: 'branding', hasDropdown: true },
  { name: 'COMPANY', id: 'company', hasDropdown: true },
  { name: 'CONTACT', id: 'contact', hasDropdown: false }
];
