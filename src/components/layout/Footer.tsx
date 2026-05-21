"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Facebook, Twitter, Instagram, Linkedin, Youtube, 
  Mail, Phone, MapPin, Code, ShoppingCart, Globe, 
  Smartphone, Settings, Search, Share2, FileText, 
  Megaphone, BarChart3, Headphones, Award,
  ExternalLink
} from 'lucide-react';
import { Section } from './Responsive/Section';
import { SOCIAL_LINKS } from '@/constants/navigation';

const serviceLinks = [
  { name: "Custom Web Development", icon: <Code size={16} />, color: "bg-purple-50 text-purple-600" },
  { name: "E-commerce Solutions", icon: <ShoppingCart size={16} />, color: "bg-blue-50 text-blue-600" },
  { name: "WordPress Development", icon: <Globe size={16} />, color: "bg-green-50 text-green-600" },
  { name: "Responsive Design", icon: <Smartphone size={16} />, color: "bg-amber-50 text-amber-600" },
  { name: "Website Maintenance", icon: <Settings size={16} />, color: "bg-pink-50 text-pink-600" },
  { name: "SEO Services", icon: <Search size={16} />, color: "bg-emerald-50 text-emerald-600" },
  { name: "Social Media Marketing", icon: <Share2 size={16} />, color: "bg-orange-50 text-orange-600" },
  { name: "Content Marketing", icon: <FileText size={16} />, color: "bg-indigo-50 text-indigo-600" },
  { name: "PPC Advertising", icon: <Megaphone size={16} />, color: "bg-rose-50 text-rose-600" },
  { name: "Digital Marketing", icon: <BarChart3 size={16} />, color: "bg-cyan-50 text-cyan-600" },
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

          {/* Services Columns */}
          <div className="lg:col-span-5 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div className="md:col-span-2 flex items-center gap-3 mb-4 justify-center md:justify-start">
               <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-[#1a8b4c]">
                 <Settings size={20} className="animate-spin-slow" />
               </div>
               <h4 className="text-[20px] font-black text-gray-950 uppercase tracking-tight">Our Services</h4>
            </div>
            {serviceLinks.map((service, i) => (
              <Link 
                key={i} 
                href="#" 
                className="group flex items-center gap-4 p-3 bg-white border border-gray-50 rounded-2xl shadow-sm hover:shadow-md hover:border-[#1a8b4c]/20 transition-all duration-300"
              >
                <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center ${service.color} transition-transform group-hover:scale-110`}>
                  {service.icon}
                </div>
                <span className="text-[14px] font-bold text-gray-700 group-hover:text-[#1a8b4c] transition-colors">{service.name}</span>
              </Link>
            ))}
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
