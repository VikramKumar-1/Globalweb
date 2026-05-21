"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Globe } from 'lucide-react';

const projects = [
  {
    id: 1,
    title: "Forte Migration Australia",
    category: "Web Development",
    image: "/portfolio/fortemigration.png",
    desc: "A premium migration agency platform designed with custom onboarding workflows, interactive visa criteria checkers, and professional corporate branding.",
    link: "https://www.fortemigration.com.au/",
    displayUrl: "fortemigration.com.au",
    tags: ["Next.js", "Tailwind CSS", "Framer Motion", "Lead Capture"]
  },
  {
    id: 2,
    title: "Artival India",
    category: "E-Commerce",
    image: "/portfolio/artival.png",
    desc: "An upscale luxury storefront for handcrafted rugs and artisanal carpets, focusing on high-fidelity image displays, robust filters, and frictionless checkout.",
    link: "https://artival.in/",
    displayUrl: "artival.in",
    tags: ["React", "Shopify", "Tailwind CSS", "Premium Design"]
  },
  {
    id: 3,
    title: "Pyoras Group",
    category: "Corporate",
    image: "/portfolio/pyoras.png",
    desc: "Corporate marketing website for a leading sustainable group. Highlighted by crisp modern grids and showcases of eco-friendly hydration products.",
    link: "https://pyoras.com/",
    displayUrl: "pyoras.com",
    tags: ["Next.js", "Animations", "Responsive Design", "Green Tech"]
  },
  {
    id: 4,
    title: "RSR Foodstuff",
    category: "B2B Portal",
    image: "/portfolio/rsrfoodstuff.png",
    desc: "A dynamic B2B agriculture exporting portal. Includes comprehensive specifications for grains, pulses, and spices alongside custom lead inquiry features.",
    link: "https://rsrfoodstuff.com/",
    displayUrl: "rsrfoodstuff.com",
    tags: ["Web Design", "B2B Catalog", "Inquiry System", "SEO Optimized"]
  },
  {
    id: 5,
    title: "FutureNxt Technologies",
    category: "Web Development",
    image: "/portfolio/futurenxt.png",
    desc: "A futuristic enterprise tech agency web app, featuring high-tech visual cues and clean layouts highlighting AI and software engineering services.",
    link: "https://futurenxt.io/index.php",
    displayUrl: "futurenxt.io",
    tags: ["React", "Futuristic UI", "Dynamic Scripts", "Tech Agency"]
  }
];

const categories = ["All", "Web Development", "E-Commerce", "Corporate", "B2B Portal"];

const ProjectCard = ({ project }: { project: typeof projects[0] }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [containerHeight, setContainerHeight] = useState(320);
  const [imageHeight, setImageHeight] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const updateHeights = () => {
    if (containerRef.current) {
      setContainerHeight(containerRef.current.clientHeight);
    }
    if (imageRef.current) {
      setImageHeight(imageRef.current.clientHeight);
    }
  };

  useEffect(() => {
    updateHeights();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      updateHeights();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3 }}
      className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(26,139,76,0.12)] border border-gray-100 transition-all duration-500"
    >
      {/* Browser Header Mockup */}
      <div className="bg-gray-50/80 border-b border-gray-100 px-4 py-3 flex items-center gap-2 rounded-t-3xl">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
        </div>
        <div className="flex-1 bg-gray-100/80 border border-gray-200/30 rounded-lg py-1 px-3 text-[11px] text-gray-400 truncate max-w-[220px] mx-auto text-center font-mono select-none flex items-center justify-center gap-1.5">
          <Globe size={10} className="text-gray-400" />
          <span>{project.displayUrl}</span>
        </div>
      </div>

      {/* Scrollable Screenshot Area - Clickable to Live Site */}
      <a 
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        ref={containerRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative w-full aspect-[4/3] overflow-hidden bg-gray-50 cursor-pointer block"
      >
        <motion.div
          className="absolute top-0 left-0 w-full will-change-transform"
          animate={{
            y: isHovered && imageHeight > containerHeight 
              ? -(imageHeight - containerHeight) 
              : 0
          }}
          transition={{
            type: "tween",
            ease: isHovered ? "linear" : "easeOut",
            duration: isHovered 
              ? Math.max(3, (imageHeight - containerHeight) / 180) 
              : 1.5
          }}
        >
          <img 
            ref={imageRef}
            src={project.image} 
            alt={project.title}
            className="w-full h-auto block"
            loading="lazy"
            onLoad={updateHeights}
          />
        </motion.div>

        {/* Quick Hover Guidance Overlay */}
        <div className="absolute inset-0 bg-black/[0.02] pointer-events-none transition-opacity duration-300 hover:opacity-0" />
      </a>

      {/* Project Details */}
      <div className="p-5 flex flex-col flex-1 bg-white justify-between">
        <div>
          <div className="mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#1a8b4c] bg-green-50 px-2.5 py-1 rounded-full">
              {project.category}
            </span>
          </div>

          <h3 className="text-[19px] md:text-[20px] font-bold text-gray-900 mb-3 leading-tight group-hover:text-[#1a8b4c] transition-colors duration-300">
            {project.title}
          </h3>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
          <a 
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-[#1a8b4c] hover:bg-[#15803d] text-white text-center py-2.5 px-4 rounded-xl text-[14px] font-bold transition-all flex items-center justify-center gap-2 shadow-sm shadow-green-900/10 hover:shadow-md hover:shadow-green-900/20"
          >
            <span>Visit Live Site</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default function PortfolioClient() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProjects = activeCategory === "All" 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  return (
    <div className="pt-0 sm:pt-1 pb-16 sm:pb-24 bg-[#f8fafc] font-sans relative overflow-hidden min-h-screen">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-100/30 blur-[130px] rounded-full -mr-72 -mt-72" />
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-green-100/20 blur-[120px] rounded-full -ml-64" />

      <div className="relative z-10 container-custom">
        {/* Header Block */}
        <div className="text-center mb-8 sm:mb-10 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="inline-flex items-center gap-2 bg-green-100/50 border border-green-200 px-4 py-1.5 rounded-full mb-4"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#1a8b4c] animate-pulse" />
            <span className="text-[#1a8b4c] text-[12px] font-bold uppercase tracking-widest">Our Work Showcase</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-heading text-gray-900 mb-4 leading-tight"
          >
            Websites That Drive <span className="text-[#1a8b4c] underline decoration-green-200 decoration-4 sm:decoration-8 underline-offset-4">Growth & Results</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="text-gray-600 text-sm sm:text-base md:text-lg mb-5 leading-relaxed"
          >
            Explore our curated projects. Hover over any browser card below to automatically scroll through the complete, high-definition website homepage mockup.
          </motion.p>

          {/* Filtering buttons */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full text-[12px] sm:text-[14px] font-bold transition-all duration-300 ${
                  activeCategory === cat 
                  ? "bg-[#1a8b4c] text-white shadow-lg shadow-green-900/20" 
                  : "bg-white text-gray-600 border border-gray-200/80 hover:bg-gray-50 hover:border-gray-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid layout */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 max-w-[1400px] mx-auto"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
