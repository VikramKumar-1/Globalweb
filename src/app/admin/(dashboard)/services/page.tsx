import React from 'react';
import { Metadata } from 'next';
import { db } from '@/lib/db';
import ServiceListClient from '@/features/admin/components/services/ServiceListClient';
import Link from 'next/link';
import { Edit2, Plus } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Parent-level routes that have their own dedicated Next.js pages
const PARENT_PAGES = [
  { label: 'Web Development', slug: '/web-development', category: 'website' },
  { label: 'Digital Marketing', slug: '/digital-marketing', category: 'marketing' },
  { label: 'Branding & PR', slug: '/branding-pr', category: 'branding' },
];

export default async function AdminServicesPage() {
  let services: any[] = [];
  let parentPages: any[] = [];
  
  try {
    services = await db.servicePage.findMany({
      orderBy: { updatedAt: 'desc' },
    });

    // Find any saved parent page records
    const parentSlugs = PARENT_PAGES.map(p => p.slug);
    parentPages = await db.servicePage.findMany({
      where: { slug: { in: parentSlugs } },
      select: { id: true, slug: true, title: true },
    });
  } catch (error) {
    console.error('Failed to query services:', error);
  }

  return (
    <ServiceListClient services={services} />
  );
}
