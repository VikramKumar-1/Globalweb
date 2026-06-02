import React from 'react';
import HomeView from '@/features/home/components/HomeView';

export function CityLandingView({ cityKey, cityInfo }: { cityKey: string; cityInfo: { name: string; subtitle: string } }) {
  const locationName = cityInfo.name;
  return <HomeView city={locationName} cityKey={cityKey} />;
}
