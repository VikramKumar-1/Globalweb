import React from 'react';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import ServiceForm from '../ServiceForm';
import { getSlugTitle } from '@/lib/replaceLocation';

interface Props {
  params: { slug: string };
}

export default async function EditServicePage({ params }: Props) {
  // Service slug starts with '/' in the database. Format it correctly.
  const serviceSlug = `/${params.slug}`;

  const service = await db.servicePage.findUnique({
    where: { slug: serviceSlug },
  });

  if (!service) {
    notFound();
  }

  // Format Service model properties to match expected Service type in ServiceForm
  const formattedService = {
    id: service.id,
    title: service.title,
    contentTitle: service.contentTitle || undefined,
    slug: service.slug,
    category: service.category,
    seoTitle: service.seoTitle || undefined,
    seoDescription: service.seoDescription || undefined,
    heroDescription: service.heroDescription || undefined,
    seoKeywords: service.seoKeywords || undefined,
    content: service.content,
    image: service.image || undefined,
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <h2 className="text-xl md:text-2xl font-black text-gray-900 font-lexend uppercase tracking-tight">
          Edit Service Page: {getSlugTitle(service.slug)}
        </h2>
        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
          Update service page details, category, and SEO metadata settings
        </p>
      </div>

      <ServiceForm service={formattedService} />
    </div>
  );
}
