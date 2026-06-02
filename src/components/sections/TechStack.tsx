"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Section } from '../layout/Responsive/Section';

const techStack = [
  { 
    name: "Shopify", 
    icon: "https://cdn.simpleicons.org/shopify/96BF48",
    desc: "E-commerce",
    color: "#96BF48",
    bg: "bg-[#96BF48]/5"
  },
  { 
    name: "PHP", 
    icon: "https://cdn.simpleicons.org/php/777BB4",
    desc: "Backend",
    color: "#777BB4",
    bg: "bg-[#777BB4]/5"
  },
  { 
    name: "WordPress", 
    icon: "https://cdn.simpleicons.org/wordpress/21759B",
    desc: "CMS",
    color: "#21759B",
    bg: "bg-[#21759B]/5"
  },
  { 
    name: "JavaScript", 
    icon: "https://cdn.simpleicons.org/javascript/F7DF1E",
    desc: "Frontend",
    color: "#F7DF1E",
    bg: "bg-[#F7DF1E]/5"
  },
  { 
    name: "React", 
    icon: "https://cdn.simpleicons.org/react/61DAFB",
    desc: "Library",
    color: "#61DAFB",
    bg: "bg-[#61DAFB]/5"
  },
  { 
    name: "CodeIgniter", 
    icon: "https://cdn.simpleicons.org/codeigniter/EE4323",
    desc: "PHP Framework",
    color: "#EE4323",
    bg: "bg-[#EE4323]/5"
  },
  { 
    name: "Android", 
    icon: "https://cdn.simpleicons.org/android/3DDC84",
    desc: "Mobile",
    color: "#3DDC84",
    bg: "bg-[#3DDC84]/5"
  },
  { 
    name: "iOS", 
    icon: "https://cdn.simpleicons.org/apple/000000",
    desc: "Mobile",
    color: "#000000",
    bg: "bg-gray-100/50"
  },
  { 
    name: "Google Ads", 
    icon: "https://cdn.simpleicons.org/googleads/4285F4",
    desc: "Marketing",
    color: "#4285F4",
    bg: "bg-[#4285F4]/5"
  }
];

export default function TechStack() {
  return (
    <Section id="tech-stack" variant="white" className="bg-white relative overflow-hidden font-sans">
      {/* Decorative background blur */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-green-50/50 blur-[100px] rounded-full -mr-48 -mt-48" />
      
      <div className="relative z-10">
        <div className="text-center max-w-[1100px] mx-auto mb-8 md:mb-12 px-4">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-green-50 border border-green-100 text-[#1a8b4c] text-[11px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4 shadow-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1a8b4c] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1a8b4c]" />
            </span>
            Powering Innovation
          </motion.span>
          <h2 className="text-[28px] md:text-[36px] font-bold text-gray-900 leading-tight tracking-tight mb-4">
            Our <span className="text-[#1a8b4c]">Cutting-Edge</span> Tech Stack
          </h2>
          <p className="text-gray-500 text-[13px] md:text-[15px] font-medium mx-auto lg:whitespace-nowrap">
            We use the most powerful and modern technologies to build scalable, high-performance digital solutions for your business.
          </p>
        </div>

        {/* Tech Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-3 md:gap-4 max-w-[1400px] mx-auto">
          {techStack.map((tech, i) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "150px" }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="group flex flex-col items-center"
            >
              <div className={`w-full aspect-square ${tech.bg} border-[2px] border-gray-200 rounded-2xl p-3 md:p-5 flex items-center justify-center transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.05)] group-hover:shadow-xl group-hover:bg-white group-hover:border-[#1a8b4c]/40 relative overflow-hidden`}>
                <Image 
                  src={tech.icon} 
                  alt={tech.name} 
                  width={48}
                  height={48}
                  className="w-8 h-8 md:w-10 md:h-10 object-contain filter transition-all duration-300 group-hover:scale-110 relative z-10"
                  unoptimized={tech.icon.includes('.org')} // External dynamic SVGs often need to be unoptimized or handled carefully
                />
                
                {/* Subtle Glow on Hover */}
                <div className="absolute inset-0 bg-[#1a8b4c]/5 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity pointer-events-none" />
              </div>
              
              <div className="mt-3 text-center">
                <p className="text-[11px] md:text-[13px] font-semibold text-gray-900 group-hover:text-[#1a8b4c] transition-colors line-clamp-1">{tech.name}</p>
                <p className="hidden md:block text-[9px] font-medium text-gray-400 uppercase tracking-widest mt-0.5">{tech.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dynamic Background Text (Watermark) */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-[120px] md:text-[200px] font-bold text-gray-50 pointer-events-none select-none whitespace-nowrap -z-10 opacity-40 uppercase tracking-tighter">
          Technologies
        </div>
      </div>
    </Section>
  );
}
