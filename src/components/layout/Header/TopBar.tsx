"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, Menu, X } from 'lucide-react';
import { TOP_BAR_CONTACT, SOCIAL_LINKS } from '@/constants/navigation';
import { cn } from '@/lib/utils';

interface TopBarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const TopBar = ({ isOpen, setIsOpen }: TopBarProps) => {
  return (
    <div className="px-2 md:px-6 bg-white relative z-[10001] border-b border-gray-100 h-[70px] md:h-[75px] flex items-center transition-all duration-300">
      <div className="max-w-[1800px] mx-auto px-2 md:px-4 flex items-center justify-between h-full w-full">
        
        {/* LEFT: Logo - Hanging/Large Style */}
        <div className="flex items-center gap-2 md:gap-4 shrink-0 h-full relative">
          <Link href="/" className="flex items-center shrink-0 h-full relative z-50">
            <div className={cn(
              "relative transition-all duration-300 px-1",
              isOpen ? "h-[65px] w-[100px] md:h-[80px] md:w-[120px]" : "h-[55px] md:h-[75px] w-[90px] md:w-[110px]"
            )}>
              <Image
                src="/global_webify_logo.png"
                alt="GlobalWebify"
                fill
                priority
                quality={100}
                className="object-contain py-1"
                sizes="(max-width: 768px) 120px, 150px"
              />
            </div>
          </Link>

          {/* Marquee - Increased width to the right */}
          <div className="hidden lg:block overflow-hidden relative w-[180px] xl:w-[380px] h-[24px] flex items-center ml-[-20px] group">
            <div className="animate-marquee-scroll flex gap-20 whitespace-nowrap items-center group-hover:[animation-play-state:paused] cursor-pointer">
              {[1, 2].map((i) => (
                <span key={i} className="text-[11px] xl:text-[13.5px] font-medium text-gray-700 tracking-tight font-sans">
                  Global Webify is the Best Digital Marketing Agency in Ranchi delivering creative, user-friendly websites for all industries with proven strategies and expert SEO services.
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* MIDDLE: Social Icons (Mobile) */}
        <div className={cn("md:hidden absolute left-1/2 -translate-x-1/2 flex items-center gap-2 transition-opacity duration-200", isOpen ? "opacity-0 pointer-events-none" : "opacity-100")}>
          {SOCIAL_LINKS.map((social, i) => (
            <a
              key={i}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shadow-md active:scale-95 transition-all p-1.5 overflow-hidden",
                social.bg.startsWith('bg-') ? social.bg : ""
              )}
              style={!social.bg.startsWith('bg-') ? { background: social.bg } : {}}
            >
              <img src={social.icon} alt={social.name} className="w-full h-full object-contain" />
            </a>
          ))}
        </div>

        {/* RIGHT: Contacts, Desktop Socials, and Hamburger */}
        <div className="flex items-center gap-2 md:gap-4 z-10 h-full">
          {/* Desktop & Tablet Contacts */}
          <div className="hidden md:flex items-center gap-3 xl:gap-5 text-[11px] xl:text-[12.8px] font-medium text-gray-700 tracking-tight mr-2 xl:mr-4 font-sans">
            <a href={`tel:${TOP_BAR_CONTACT.phone1}`} className="flex items-center gap-1.5 hover:text-primary transition-colors group">
              <div className="w-6 h-6 xl:w-7 xl:h-7 rounded-full bg-pink-50 flex items-center justify-center text-pink-500 shadow-sm border border-pink-100 group-hover:bg-pink-100 transition-colors">
                <Phone size={10} className="xl:w-3 xl:h-3" fill="currentColor" />
              </div>
              <span className="font-sans">{TOP_BAR_CONTACT.phone1}</span>
            </a>
            <a href={`tel:${TOP_BAR_CONTACT.phone2}`} className="hidden lg:flex items-center gap-1.5 hover:text-primary transition-colors group">
              <div className="w-6 h-6 xl:w-7 xl:h-7 rounded-full bg-pink-50 flex items-center justify-center text-pink-500 shadow-sm border border-pink-100 group-hover:bg-pink-100 transition-colors">
                <Phone size={10} className="xl:w-3 xl:h-3" fill="currentColor" />
              </div>
              <span className="font-sans">{TOP_BAR_CONTACT.phone2}</span>
            </a>
            <a href={`mailto:${TOP_BAR_CONTACT.email}`} className="hidden lg:flex items-center gap-1.5 hover:text-primary transition-colors group">
              <div className="w-6 h-6 xl:w-7 xl:h-7 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 shadow-sm border border-purple-100 group-hover:bg-purple-100 transition-colors">
                <Mail size={10} className="xl:w-3 xl:h-3" fill="currentColor" />
              </div>
              <span className="lowercase font-sans">{TOP_BAR_CONTACT.email}</span>
            </a>
          </div>

          {/* Tablet & Desktop Social Icons */}
          <div className="hidden md:flex items-center gap-1.5 xl:gap-2 border-l border-gray-100 pl-3 xl:pl-4 mr-1 xl:mr-2">
            {SOCIAL_LINKS.map((social, i) => (
              <a
                key={i}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "w-6 h-6 xl:w-7 xl:h-7 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-sm p-1.5 overflow-hidden",
                  social.bg.startsWith('bg-') ? social.bg : ""
                )}
                style={!social.bg.startsWith('bg-') ? { background: social.bg } : {}}
              >
                <img src={social.icon} alt={social.name} className="w-full h-full object-contain" />
              </a>
            ))}
          </div>

          <Link href="/contact" className="hidden lg:flex items-center justify-center bg-[#22c55e] text-white px-5 py-2 rounded-full text-[12px] xl:text-[12.8px] font-semibold uppercase tracking-widest shadow-lg shadow-green-100 hover:bg-[#16a34a] transition-all active:scale-95 font-sans whitespace-nowrap">
            Contact Us
          </Link>

          {/* Hamburger Menu */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-[4px] bg-[#15803d] text-white hover:bg-[#166534] transition-all shadow-md active:scale-95"
          >
            {isOpen ? <X className="w-4 h-4 md:w-6 md:h-6" /> : <Menu className="w-4 h-4 md:w-6 md:h-6" />}
          </button>
        </div>
      </div>
    </div>
  );
};
