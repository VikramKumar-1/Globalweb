import React from 'react';
import HomeView from '@/features/home/components/HomeView';

export function CityLandingView({ cityKey, cityInfo, subdomainContent }: { cityKey: string; cityInfo: { name: string; subtitle: string }; subdomainContent?: any }) {
  const locationName = cityInfo.name;
  return <HomeView city={locationName} cityKey={cityKey} subdomainContent={subdomainContent} location={locationName} />;
}
