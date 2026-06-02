import React from 'react';
import HomeView from '@/features/home/components/HomeView';

export const dynamic = 'force-dynamic';

export default async function Home() {
  return <HomeView />;
}
