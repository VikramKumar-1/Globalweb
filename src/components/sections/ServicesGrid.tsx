"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code, Search, Sparkles, Target, FileText,
  Palette, ArrowRight, X, Phone, Check
} from 'lucide-react';
import { Section } from '../layout/Responsive/Section';

interface Service {
  title: string;
  icon: React.ReactElement;
  desc: string;
  link: string;
  color: string;
  borderColor: string;
  hoverBorder: string;
  mesh: string;
}

const services: Service[] = [
  {
    title: "Web Development",
    icon: <Code />,
    desc: "We build custom, high-performance web solutions using cutting-edge tech stacks. From corporate sites to complex web apps, we ensure maximum speed, security, and a flawless user experience.",
    link: "/web-development",
    color: "#1a8b4c",
    borderColor: "border-green-100",
    hoverBorder: "border-[#1a8b4c]",
    mesh: "bg-[#1a8b4c]/10"
  },
  {
    title: "SEO Services",
    icon: <Search />,
    desc: "Dominate search engine rankings and capture high-intent organic traffic. Our proven strategies ensure your business stays ahead of the competition and reaches your target audience effectively.",
    link: "/seo-services",
    color: "#0ea5e9",
    borderColor: "border-blue-100",
    hoverBorder: "border-blue-500",
    mesh: "bg-blue-500/10"
  },
  {
    title: "AI SEO Services",
    icon: <Sparkles />,
    desc: "The future of search is here. We use advanced AI-driven keyword intelligence and automated ranking strategies to help your business appear in Google AI, ChatGPT, and modern search recommendations.",
    link: "/ai-seo-services",
    color: "#ec4899",
    borderColor: "border-pink-100",
    hoverBorder: "border-pink-500",
    mesh: "bg-pink-500/10"
  },
  {
    title: "Google Ads Management",
    icon: <Target />,
    desc: "Precision-targeted ad campaigns designed to maximize your ROI. We use data-driven bidding and advanced conversion tracking to ensure every dollar spent drives real growth for your business.",
    link: "/google-ads-management",
    color: "#f59e0b",
    borderColor: "border-amber-100",
    hoverBorder: "border-amber-500",
    mesh: "bg-amber-500/10"
  },
  {
    title: "Content Marketing",
    icon: <FileText />,
    desc: "High-quality, engaging content that builds authority and drives conversions. From blogs to technical copy, we create content that resonates with your audience and boosts your brand presence.",
    link: "/content-marketing",
    color: "#06b6d4",
    borderColor: "border-cyan-100",
    hoverBorder: "border-cyan-500",
    mesh: "bg-cyan-500/10"
  },
  {
    title: "Web Design Services",
    icon: <Palette />,
    desc: "User-focused, visually stunning designs that convert visitors into customers. Our design approach balances modern aesthetics with intuitive UI/UX for a world-class digital experience.",
    link: "/web-design-services",
    color: "#10b981",
    borderColor: "border-emerald-100",
    hoverBorder: "border-emerald-500",
    mesh: "bg-emerald-500/10"
  }
];

function ServiceCard({ service, index, cityKey, onOpenQuote }: { service: Service, index: number, cityKey?: string, onOpenQuote: (serviceTitle: string) => void }) {
  const linkHref = cityKey ? `/${cityKey}${service.link}` : service.link;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "150px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="group relative flex flex-col w-full h-full"
    >
      <Link
        href={linkHref}
        className="relative flex-1 flex flex-col w-full bg-white rounded-2xl border border-gray-200/80 transition-all duration-300 ease-out overflow-hidden hover:-translate-y-1.5 hover:shadow-[0_16px_40px_-12px_rgba(0,0,0,0.08)] hover:border-gray-300/90"
      >
        {/* Top accent line */}
        <div className="h-[3px] w-full rounded-t-2xl" style={{ background: `linear-gradient(90deg, ${service.color}, ${service.color}88)` }} />

        <div className="relative flex-1 p-5 sm:p-6 md:p-7 flex flex-col items-start text-left">

          {/* Icon */}
          <div
            className="w-11 h-11 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-4 md:mb-5 border transition-all duration-300 group-hover:scale-105"
            style={{
              backgroundColor: `${service.color}0D`,
              borderColor: `${service.color}20`,
              color: service.color,
            }}
          >
            {React.cloneElement(service.icon, { size: 22, strokeWidth: 1.8 })}
          </div>

          {/* Title */}
          <h3 className="text-[17px] md:text-[19px] font-bold font-lexend mb-2 leading-snug tracking-[-0.01em] group-hover:text-gray-950 transition-colors" style={{ color: "#064e3b" }}>
            {service.title}
          </h3>

          {/* Description with safe wrapping and line-clamp truncation */}
          <p className="text-gray-500 font-jost text-[13.5px] leading-relaxed mb-4 line-clamp-2 md:line-clamp-3 overflow-hidden text-ellipsis break-all">
            {service.desc}
          </p>

          {/* Footer Actions */}
          <div className="w-full mt-auto pt-4 border-t border-gray-100/80">
            <div className="flex items-center justify-between">
              <span
                className="flex items-center gap-1.5 text-[12.5px] md:text-[13px] font-semibold font-jost tracking-wide group-hover:gap-2.5 transition-all duration-300"
                style={{ color: service.color }}
              >
                Explore Services
                <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.2} />
              </span>
              <div
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onOpenQuote(service.title);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation();
                    onOpenQuote(service.title);
                  }
                }}
                className="h-8 md:h-9 px-3.5 md:px-4 rounded-lg bg-[#1a8b4c] hover:bg-[#15703d] text-white text-[11px] md:text-[12px] font-semibold font-jost flex items-center justify-center gap-1.5 transition-all duration-200 hover:shadow-md active:scale-[0.97] cursor-pointer z-30"
              >
                Get Quote
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function ServicesGrid({ cityKey, dynamicDescriptions }: { cityKey?: string, dynamicDescriptions?: Record<string, string> }) {
  const [activeService, setActiveService] = useState<string | null>(null);

  const openQuoteModal = (serviceTitle: string) => {
    setActiveService(serviceTitle);
  };

  const closeQuoteModal = () => {
    setActiveService(null);
  };

  useEffect(() => {
    if (activeService) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeService]);

  return (
    <Section id="services" spacing="md" variant="white" className="relative overflow-hidden font-sans bg-white py-8 md:py-16">
      <div className="text-center max-w-[1200px] mx-auto mb-12 md:mb-16 relative z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "150px" }}
          className="inline-flex items-center gap-2 bg-gray-50 border border-gray-100 text-[#1a8b4c] text-[10px] md:text-[11px] font-bold px-3 py-1 md:px-4 md:py-1.5 rounded-full uppercase tracking-widest mb-4 md:mb-5 shadow-sm"
        >
          Our Expertise
        </motion.div>
        <h2 id="services-title" className="text-[24px] md:text-[32px] lg:text-[36px] font-bold text-gray-900 leading-[1.2] tracking-tight mb-4 font-heading px-2">
          <span className="block xl:whitespace-nowrap">Is your business losing customers because of weak online platforms?</span>
          <span className="text-[#1a8b4c]">We have the solution.</span>
        </h2>
        <p className="text-gray-500 text-[14px] md:text-[16px] font-medium mx-auto leading-relaxed xl:whitespace-nowrap px-4">
          Explore our high-performance digital solutions designed for modern business growth and conversion.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10 max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12">
        {services.map((service, i) => {
          const slug = service.link.replace('/', '');
          let finalDesc = service.desc;
          if (dynamicDescriptions && dynamicDescriptions[slug]) {
            // Inherit the dynamic description from the database hero section
            finalDesc = dynamicDescriptions[slug];
          }
          return <ServiceCard key={i} service={{ ...service, desc: finalDesc }} index={i} cityKey={cityKey} onOpenQuote={openQuoteModal} />;
        })}
      </div>

      <AnimatePresence>
        {activeService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeQuoteModal}
            className="fixed inset-0 z-[100000] overflow-y-auto bg-black/60 backdrop-blur-sm flex justify-center items-start sm:items-center p-3 sm:p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.4 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-[440px] my-auto bg-white rounded-[24px] md:rounded-[32px] p-5 sm:p-7 md:p-8 shadow-2xl text-left border border-gray-100/50"
            >
              {/* Close Button */}
              <button 
                onClick={closeQuoteModal}
                className="absolute top-4 right-4 sm:top-5 sm:right-5 text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1a8b4c] focus:ring-offset-2"
                aria-label="Close modal"
              >
                <X size={18} strokeWidth={2.5} />
              </button>

              {/* Free Consultation Badge */}
              <div className="inline-flex items-center gap-1.5 bg-[#eefbf4] border border-[#bbf7d0] text-[#16a34a] text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider mb-4 md:mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
                Free Consultation
              </div>

              {/* Title */}
              <h2 className="text-[20px] sm:text-[24px] md:text-[28px] font-bold font-lexend text-gray-900 leading-tight tracking-tight mb-3 pr-6">
                Get a Free Quote: <br /> {activeService}
              </h2>

              {/* Sub-description */}
              <p className="text-gray-500 font-jost text-[13px] sm:text-[14px] leading-relaxed mb-4 md:mb-5">
                Talk to our expert now — <span className="text-[#16a34a] font-bold">100% free, no obligation.</span> We'll analyse your needs and show you exactly how we can get you more clients.
              </p>

              {/* Bullet Checklist */}
              <div className="space-y-2.5 mb-5 md:mb-6">
                <div className="flex items-center gap-2.5 text-gray-700 font-semibold font-jost text-[13px] sm:text-[14px]">
                  <div className="flex-shrink-0 w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-md bg-[#22c55e] flex items-center justify-center text-white">
                    <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" strokeWidth={3.5} />
                  </div>
                  <span>Same-day response guaranteed</span>
                </div>
                <div className="flex items-center gap-2.5 text-gray-700 font-semibold font-jost text-[13px] sm:text-[14px]">
                  <div className="flex-shrink-0 w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-md bg-[#22c55e] flex items-center justify-center text-white">
                    <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" strokeWidth={3.5} />
                  </div>
                  <span>500+ businesses grown across India</span>
                </div>
                <div className="flex items-center gap-2.5 text-gray-700 font-semibold font-jost text-[13px] sm:text-[14px]">
                  <div className="flex-shrink-0 w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-md bg-[#22c55e] flex items-center justify-center text-white">
                    <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" strokeWidth={3.5} />
                  </div>
                  <span>No contracts — results-first approach</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2.5 mb-5 md:mb-6">
                <a
                  href="tel:+917563901100"
                  className="py-3 rounded-xl sm:rounded-2xl bg-[#1e6d3c] hover:bg-[#16522c] text-white font-bold font-jost text-[13px] sm:text-[14px] flex items-center justify-center gap-1.5 transition-all duration-300 shadow-md hover:shadow-lg active:scale-[0.98]"
                >
                  <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2.5} />
                  <span>Call Now</span>
                </a>
                <a
                  href={`https://wa.me/917563901100?text=${encodeURIComponent(`Hi, I am interested in a free quote for "${activeService}".`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 rounded-xl sm:rounded-2xl bg-[#25D366] hover:bg-[#1ebe57] text-white font-bold font-jost text-[13px] sm:text-[14px] flex items-center justify-center gap-1.5 transition-all duration-300 shadow-md hover:shadow-lg active:scale-[0.98]"
                >
                  <svg 
                    viewBox="0 0 24 24" 
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4" 
                    fill="currentColor"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <span>WhatsApp</span>
                </a>
              </div>

              {/* Footer text */}
              <div className="text-center text-gray-400 font-jost text-[11px] sm:text-[12px] font-medium">
                🔥 <span className="font-semibold text-gray-500">Limited slots available</span> this week — book yours now
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}
