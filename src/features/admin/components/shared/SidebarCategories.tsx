'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams, usePathname } from 'next/navigation';

interface SidebarCategoriesProps {
  initialActiveServiceCategory?: string;
  prefix?: string;
}

export default function SidebarCategories({ initialActiveServiceCategory, prefix = '/admin/services' }: SidebarCategoriesProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  let activeCategory = '';

  // Only read the category parameter or initialActiveServiceCategory if we are actually in this section
  if (pathname.startsWith(prefix)) {
    activeCategory = searchParams.get('category') || '';
    if (!activeCategory && pathname.startsWith(prefix + '/')) {
      activeCategory = initialActiveServiceCategory || '';
    }
  }

  const getLinkClass = (catKey: string, exactMatch: boolean = false) => {
    const isActive = exactMatch ? pathname === catKey : activeCategory === catKey;
    return `text-xs font-semibold tracking-wide block px-3.5 py-2.5 rounded-xl transition-all duration-300 border ${
      isActive
        ? 'text-[#22c55e] bg-gradient-to-r from-[#1a8b4c]/20 to-transparent border-[#1a8b4c]/30 shadow-md font-bold'
        : 'text-gray-400 bg-transparent hover:bg-[#132a1d]/40 border-transparent hover:border-[#132a1d] hover:text-white'
    }`;
  };

  return (
    <div className="mt-2.5 mx-2.5 p-2 rounded-2xl bg-[#06100b]/80 backdrop-blur-md border border-[#132a1d] flex flex-col gap-2 text-gray-400 shadow-xl">
      
      <div className="px-2 pb-1 border-b border-[#132a1d]/50 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
        Submenus
      </div>


      <Link href={`${prefix}?category=website`} className={getLinkClass('website')}>
        Website Services
      </Link>
      <Link href={`${prefix}?category=marketing`} className={getLinkClass('marketing')}>
        Digital Marketing
      </Link>
      <Link href={`${prefix}?category=branding`} className={getLinkClass('branding')}>
        Branding & PR
      </Link>
      <Link href={`${prefix}?category=hosting`} className={getLinkClass('hosting')}>
        Hosting & Server
      </Link>
    </div>
  );
}
