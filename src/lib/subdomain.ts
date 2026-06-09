import { CITIES } from '@/app/admin/(dashboard)/homepage/cities';

export function getSubdomainLocation(host: string | null): string | null {
  if (!host) return null;
  
  // Remove port if exists
  const hostname = host.split(':')[0];
  
  // If localhost, we might test subdomains like delhi.localhost
  // In production, globalwebify.com
  
  const parts = hostname.split('.');
  
  // If it's just localhost or globalwebify.com
  if (parts.length <= 2 && !hostname.includes('localhost')) {
    return null;
  }
  
  if (parts.length === 1 && hostname.includes('localhost')) {
    return null;
  }

  const subdomain = parts[0].toLowerCase();

  // Exclude 'www' and other non-location subdomains
  if (['www', 'api', 'admin', 'mail', 'blog', 'localhost'].includes(subdomain)) {
    return null;
  }

  // Check if the subdomain exists in our predefined market areas (CITIES)
  const matchedCity = CITIES.find(city => city.key === subdomain);
  
  if (matchedCity) {
    return matchedCity.name;
  }

  return null;
}
