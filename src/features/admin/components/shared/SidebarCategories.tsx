'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams, usePathname } from 'next/navigation';

interface SidebarCategoriesProps {
  initialActiveServiceCategory?: string;
}

export default function SidebarCategories({ initialActiveServiceCategory }: SidebarCategoriesProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Determine active category
  let activeCategory = searchParams.get('category') || '';

  // If activeCategory is empty and we are on a service edit page, determine category from initialActiveServiceCategory
  if (!activeCategory && pathname.startsWith('/admin/services/')) {
    activeCategory = initialActiveServiceCategory || '';
  }

  const getLinkClass = (catKey: string) => {
    const isActive = activeCategory === catKey;
    return `text-xs font-semibold tracking-wide block px-3.5 py-2.5 rounded-xl transition-all duration-200 border ${
      isActive
        ? 'text-green-400 bg-[#1a8b4c]/10 border-[#1a8b4c]/30 shadow-md font-bold'
        : 'text-gray-400 bg-gray-950/30 hover:bg-gray-950/60 border-gray-900/60 hover:border-gray-800 hover:text-white'
    }`;
  };

  return (
    <div className="mt-2.5 mx-2.5 p-2 rounded-2xl bg-gray-900/50 border border-gray-900/80 flex flex-col gap-2 text-gray-400">
      
      <div className="px-2 pb-1 border-b border-gray-950 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
        Submenus
      </div>

      <Link href="/admin/services?category=website" className={getLinkClass('website')}>
        Website Services
      </Link>
      <Link href="/admin/services?category=marketing" className={getLinkClass('marketing')}>
        Digital Marketing
      </Link>
      <Link href="/admin/services?category=branding" className={getLinkClass('branding')}>
        Branding & PR
      </Link>
      <Link href="/admin/services?category=hosting" className={getLinkClass('hosting')}>
        Hosting & Server
      </Link>
    </div>
  );
}
