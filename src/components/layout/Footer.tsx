"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Facebook, Twitter, Instagram, Linkedin, Youtube, 
  Mail, Phone, MapPin, Code, ShoppingCart, Globe, 
  Smartphone, Settings, Search, Share2, FileText, 
  Megaphone, BarChart3, Headphones,
  ExternalLink, Palette, RefreshCw, Wrench, Target, MessageCircle
} from 'lucide-react';
import { SOCIAL_LINKS } from '@/constants/navigation';

const serviceCol1 = [
  { name: "Custom Web Development", href: "/web-development", icon: Code, color: "text-teal-500 bg-teal-50" },
  { name: "E-commerce Solutions", href: "/ecommerce-web-designing", icon: ShoppingCart, color: "text-orange-500 bg-orange-50" },
  { name: "Web Design Services", href: "/web-design-services", icon: Palette, color: "text-purple-500 bg-purple-50" },
  { name: "Responsive Design", href: "/responsive-web-designing", icon: Smartphone, color: "text-blue-500 bg-blue-50" },
  { name: "Website Redesigning", href: "/website-redesigning", icon: RefreshCw, color: "text-cyan-500 bg-cyan-50" },
  { name: "Website Maintenance", href: "/website-maintenance", icon: Wrench, color: "text-gray-500 bg-gray-100" },
  { name: "Small Business Website", href: "/small-business-website", icon: Globe, color: "text-emerald-500 bg-emerald-50" },
  { name: "Customised Website", href: "/customised-website-designing", icon: Settings, color: "text-indigo-500 bg-indigo-50" },
];

const serviceCol2 = [
  { name: "SEO Services", href: "/seo-services", icon: Search, color: "text-orange-500 bg-orange-50" },
  { name: "Social Media Marketing", href: "/social-media-marketing", icon: Share2, color: "text-pink-500 bg-pink-50" },
  { name: "Content Marketing", href: "/content-marketing", icon: FileText, color: "text-teal-500 bg-teal-50" },
  { name: "Google Ads Management", href: "/google-ads-management", icon: Target, color: "text-red-500 bg-red-50" },
  { name: "Digital Marketing", href: "/digital-marketing", icon: BarChart3, color: "text-blue-500 bg-blue-50" },
  { name: "AI SEO Services", href: "/ai-seo-services", icon: Search, color: "text-violet-500 bg-violet-50" },
  { name: "SMO Services", href: "/smo-services", icon: Megaphone, color: "text-amber-500 bg-amber-50" },
  { name: "WhatsApp Marketing", href: "/whatsapp-marketing", icon: MessageCircle, color: "text-green-500 bg-green-50" },
];

const contactDetails = [
  { type: "Email", value: "help@globalwebify.com", icon: <Mail size={16} />, color: "bg-blue-50 text-blue-500" },
  { type: "Main", value: "+91 7563901100", icon: <Phone size={16} />, color: "bg-pink-50 text-pink-500" },
  { type: "Toll Free", value: "1800-890-5489", icon: <Phone size={16} />, color: "bg-pink-50 text-pink-500" },
  { type: "US Office", value: "+1 9175908135", icon: <Phone size={16} />, color: "bg-pink-50 text-pink-500" },
];

export default function Footer() {
  return (
    <footer className="bg-[#f8fbfa] pt-24 pb-12 font-sans border-t border-gray-100">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-20">
          
          {/* Brand Column */}
          <div className="lg:col-span-3 space-y-8 text-center lg:text-left">
            <Link href="/" className="inline-block relative w-[180px] h-[80px] mx-auto lg:mx-0">
              <Image 
                src="/global_webify_logo.png" 
                alt="GlobalWebify" 
                fill
                className="object-contain" 
                sizes="180px"
              />
            </Link>
            <p className="text-[15px] text-gray-600 font-medium leading-relaxed max-w-sm mx-auto lg:mx-0">
              Your trusted digital partner for web development, digital marketing, and branding. We help businesses grow with modern, effective, and affordable digital solutions.
            </p>
          </div>

          {/* Our Services - 2 icon columns */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-6 justify-center md:justify-start">
               <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-[#1a8b4c]">
                 <Settings size={20} className="animate-spin-slow" />
               </div>
               <h4 className="text-[20px] font-black text-gray-950 uppercase tracking-tight">Our Services</h4>
            </div>
            
            <div className="grid grid-cols-2 gap-x-6">
              {/* Left service column */}
              <div className="space-y-3.5">
                {serviceCol1.map((service, i) => {
                  const Icon = service.icon;
                  return (
                    <Link 
                      key={i}
                      href={service.href} 
                      className="group flex items-center gap-2.5 hover:translate-x-1 transition-transform duration-200"
                    >
                      <div className={`w-7 h-7 shrink-0 rounded-lg flex items-center justify-center ${service.color} transition-transform group-hover:scale-110`}>
                        <Icon size={14} />
                      </div>
                      <span className="text-[13px] text-gray-600 font-semibold group-hover:text-[#1a8b4c] transition-colors leading-tight">{service.name}</span>
                    </Link>
                  );
                })}
              </div>
              {/* Right service column */}
              <div className="space-y-3.5">
                {serviceCol2.map((service, i) => {
                  const Icon = service.icon;
                  return (
                    <Link 
                      key={i}
                      href={service.href} 
                      className="group flex items-center gap-2.5 hover:translate-x-1 transition-transform duration-200"
                    >
                      <div className={`w-7 h-7 shrink-0 rounded-lg flex items-center justify-center ${service.color} transition-transform group-hover:scale-110`}>
                        <Icon size={14} />
                      </div>
                      <span className="text-[13px] text-gray-600 font-semibold group-hover:text-[#1a8b4c] transition-colors leading-tight">{service.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Contact Column */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3 mb-8 justify-center lg:justify-start">
               <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-[#1a8b4c]">
                 <Headphones size={20} />
               </div>
               <h4 className="text-[20px] font-black text-gray-950 uppercase tracking-tight">Get In Touch</h4>
            </div>
            
            <div className="space-y-3">
              {contactDetails.map((contact, i) => (
                <div key={i} className="flex items-center gap-4 p-3 bg-white border border-gray-50 rounded-2xl shadow-sm">
                  <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center ${contact.color}`}>
                    {contact.icon}
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{contact.type}</p>
                    <p className="text-[14px] font-bold text-gray-800">{contact.value}</p>
                  </div>
                </div>
              ))}

              <div className="flex items-start gap-4 p-4 bg-white border border-gray-50 rounded-2xl shadow-sm">
                <div className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center bg-green-50 text-green-500 mt-1">
                  <MapPin size={18} />
                </div>
                <p className="text-[13px] font-bold text-gray-700 leading-relaxed">
                  2nd Floor, Alam Complex, Ashok Nagar Road, Kadru, Ranchi, Jharkhand, India-834002
                </p>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white border border-gray-50 rounded-2xl shadow-sm">
                <div className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center bg-green-50 text-green-500 mt-1">
                  <MapPin size={18} />
                </div>
                <p className="text-[13px] font-bold text-gray-700 leading-relaxed">
                  36/1E/1L, Topsia Road, Panchannagram, Kolkata, Pin - 700039, West Bengal, India.
                </p>
              </div>

              <Link 
                href="/market-area" 
                className="group flex items-center justify-between p-4 bg-white border border-gray-50 rounded-2xl shadow-sm hover:shadow-md hover:border-[#1a8b4c]/20 transition-all duration-300 w-full"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center bg-green-50 text-[#1a8b4c] transition-transform group-hover:scale-110">
                    <MapPin size={18} />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Locations</p>
                    <p className="text-[14px] font-bold text-gray-800 group-hover:text-[#1a8b4c] transition-colors">Our Market Areas</p>
                  </div>
                </div>
                <ExternalLink size={16} className="text-gray-400 group-hover:text-[#1a8b4c] transition-colors mr-1" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 mb-12">
          {/* Projects Card */}
          <div className="lg:col-span-2 bg-gray-50 border border-gray-100/80 rounded-2xl p-4 text-center flex flex-col items-center justify-center group hover:border-[#1a8b4c]/20 transition-all shadow-sm">
            <h3 className="text-[30px] font-extrabold text-[#1a8b4c] leading-none mb-1.5">500+</h3>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.15em]">Projects Delivered</p>
          </div>

          {/* Satisfaction Card */}
          <div className="lg:col-span-2 bg-gray-50 border border-gray-100/80 rounded-2xl p-4 text-center flex flex-col items-center justify-center group hover:border-[#1a8b4c]/20 transition-all shadow-sm">
            <h3 className="text-[30px] font-extrabold text-[#1a8b4c] leading-none mb-1.5">98%</h3>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.15em]">Client Satisfaction</p>
          </div>

          {/* Social Card */}
          <div className="lg:col-span-3 bg-gray-50 border border-gray-100/80 rounded-2xl p-4 text-center flex flex-col items-center justify-center shadow-sm">
            <h4 className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-3">Follow Us</h4>
            <div className="flex gap-2">
               {SOCIAL_LINKS.map((social, i) => {
                 const IconMap: Record<string, any> = {
                   Facebook: Facebook,
                   Twitter: Twitter,
                   Linkedin: Linkedin,
                   Instagram: Instagram,
                   Youtube: Youtube
                 };
                 const Icon = IconMap[social.name] || Facebook;
                 return (
                   <a
                     key={i}
                     href={social.href}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="w-8 h-8 bg-white border border-gray-100 rounded-full flex items-center justify-center text-gray-600 shadow-sm hover:bg-[#1a8b4c] hover:text-white transition-all transform hover:-translate-y-0.5"
                   >
                     <Icon size={14} />
                   </a>
                 );
               })}
            </div>
          </div>

          {/* Payment Card */}
          <div className="lg:col-span-5 bg-gray-50 border border-gray-100/80 rounded-2xl p-4 text-center flex flex-col items-center justify-center shadow-sm">
            <h4 className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-3">Secure Payment Methods</h4>
            <div className="flex flex-row flex-nowrap justify-center items-center gap-1.5 sm:gap-2 w-full">
               {/* Bank of Baroda */}
               <div className="w-[54px] h-[38px] sm:w-[76px] sm:h-[50px] relative bg-white border border-gray-100 rounded-lg flex items-center justify-center shadow-sm shrink-0">
                 <Image src="/BankOfBaroda.avif" alt="Bank of Baroda" fill className="object-contain p-0.5" sizes="(max-width: 640px) 54px, 76px" />
               </div>
               {/* Indian Overseas Bank */}
               <div className="w-[54px] h-[38px] sm:w-[76px] sm:h-[50px] relative bg-white border border-gray-100 rounded-lg flex items-center justify-center shadow-sm shrink-0">
                 <Image src="/IndianOverseasBank.avif" alt="Indian Overseas Bank" fill className="object-contain p-0.5" sizes="(max-width: 640px) 54px, 76px" />
               </div>
               {/* PayPal */}
               <div className="w-[54px] h-[38px] sm:w-[76px] sm:h-[50px] relative bg-white border border-gray-100 rounded-lg flex items-center justify-center shadow-sm shrink-0">
                 <Image src="/PayPal.avif" alt="PayPal" fill className="object-contain p-0.5" sizes="(max-width: 640px) 54px, 76px" />
               </div>
               {/* Razorpay */}
               <div className="w-[54px] h-[38px] sm:w-[76px] sm:h-[50px] relative bg-white border border-gray-100 rounded-lg flex items-center justify-center shadow-sm shrink-0">
                 <Image src="/Razorpay.avif" alt="Razorpay" fill className="object-contain p-0.5" sizes="(max-width: 640px) 54px, 76px" />
               </div>
               {/* PhonePe */}
               <div className="w-[54px] h-[38px] sm:w-[76px] sm:h-[50px] relative bg-white border border-gray-100 rounded-lg flex items-center justify-center shadow-sm shrink-0">
                 <Image src="/PhonePe.avif" alt="PhonePe" fill className="object-contain p-0.5" sizes="(max-width: 640px) 54px, 76px" />
               </div>
             </div>
          </div>
        </div>

        {/* Final Bottom Bar */}
        <div className="pt-12 border-t border-gray-100 flex flex-col items-center justify-center gap-4 text-center">
           <p className="text-[14px] font-bold text-gray-500">
             © {new Date().getFullYear()} Global Webify. All rights reserved.
           </p>
           <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 sm:gap-x-8 text-center">
             {["Privacy Policy", "Terms of Service", "Cookie Policy", "Sitemap"].map((link) => (
               <Link key={link} href="#" className="text-[13px] font-bold text-gray-400 hover:text-[#1a8b4c] transition-colors">
                 {link}
               </Link>
             ))}
           </div>
        </div>
      </div>
    </footer>
  );
}
