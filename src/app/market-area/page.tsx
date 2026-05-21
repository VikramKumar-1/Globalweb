import React from 'react';
import Link from 'next/link';
import { MapPin, ArrowRight, CheckCircle2, Phone, MessageSquare } from 'lucide-react';

export const metadata = {
  title: 'Choose Your Location | GlobalWebify',
  description: 'We serve major cities globally with expert custom web development, SEO, and digital marketing services. Select your location to explore local solutions.',
};

const CITIES = [
  { slug: 'india', title: 'India', subtitle: 'Country' },
  { slug: 'uk', title: 'UK', subtitle: 'United Kingdom' },
  { slug: 'ranchi', title: 'Ranchi', subtitle: 'Jharkhand , India' },
  { slug: 'dubai', title: 'Dubai', subtitle: 'United Arab Emirates' },
  { slug: 'delhi', title: 'Delhi', subtitle: 'India' },
  { slug: 'noida', title: 'Noida', subtitle: 'Uttar Pradesh , India' },
  { slug: 'gurugram', title: 'Gurugram', subtitle: 'Haryana , India' },
  { slug: 'bangalore', title: 'Bangalore', subtitle: 'Karnataka , India' },
  { slug: 'mumbai', title: 'Mumbai', subtitle: 'Maharashtra , India' },
  { slug: 'pune', title: 'Pune', subtitle: 'Maharashtra , India' },
  { slug: 'hyderabad', title: 'Hyderabad', subtitle: 'Telangana , India' },
  { slug: 'kolkata', title: 'Kolkata', subtitle: 'West Bengal , India' },
];

export default function MarketAreaPage() {
  return (
    <div className="bg-[#fafdfc] min-h-screen py-20 font-sans">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 text-center">
        
        {/* Header Section */}
        <div className="max-w-3xl mx-auto mb-16">
          <span className="text-[12px] font-black text-gray-400 uppercase tracking-[0.25em] block mb-3">
            Our Market Areas
          </span>
          <h1 className="text-3xl md:text-5xl lg:text-[54px] font-black text-[#1a8b4c] uppercase tracking-tight leading-none mb-6">
            Choose Your Location
          </h1>
          <p className="text-[15px] md:text-[16px] text-gray-500 font-medium leading-relaxed max-w-2xl mx-auto">
            We serve major Indian and international cities with expert digital marketing and web services. Each location offers the same high-quality, customized solutions tailored to your local market needs.
          </p>
          <div className="w-16 h-[3px] bg-[#1a8b4c] rounded-full mx-auto mt-6" />
        </div>

        {/* Location Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 mb-24">
          {CITIES.map((city, idx) => {
            const targetUrl = `/${city.slug}`;
            
            return (
              <Link
                key={idx}
                href={targetUrl}
                className="group block bg-white border border-gray-100 rounded-[32px] p-8 text-center shadow-sm hover:shadow-xl hover:border-[#1a8b4c]/30 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
              >
                {/* Decorative hover gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#f0fdf4]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                <div className="relative z-10">
                  {/* Location Title */}
                  <h3 className="text-[22px] font-black text-gray-950 tracking-tight mb-1 group-hover:text-[#1a8b4c] transition-colors">
                    {city.title}
                  </h3>
                  
                  {/* Local Subtitle */}
                  <p className="text-[13px] font-extrabold text-[#1a8b4c] tracking-wide mb-6">
                    {city.subtitle}
                  </p>

                  {/* Circular MapPin Badge */}
                  <div className="w-14 h-14 bg-[#1a8b4c] rounded-full text-white flex items-center justify-center mx-auto mb-6 shadow-md shadow-green-100 group-hover:scale-110 transition-transform">
                    <MapPin size={24} className="stroke-[2.5]" />
                  </div>

                  {/* Action Link Footer */}
                  <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none mt-2 group-hover:text-gray-600 transition-colors">
                    Click to explore our services in {city.title}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom CTA Block */}
        <div className="max-w-4xl mx-auto">
          <div 
            className="rounded-[40px] p-8 md:p-12 text-center relative overflow-hidden border border-gray-100 shadow-xl bg-white"
          >
            {/* Soft Green Ambient Circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[#f0fdf4] rounded-full blur-3xl -z-10 pointer-events-none" />

            <div className="w-14 h-14 bg-[#f0fdf4] border border-[#1a8b4c]/20 text-[#1a8b4c] rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={24} className="stroke-[2.5]" />
            </div>

            <h2 className="text-2xl md:text-3xl font-black text-gray-950 uppercase tracking-tight mb-4">
              Ready to Choose Your Location?
            </h2>
            <p className="text-sm md:text-base text-gray-600 font-medium max-w-xl mx-auto mb-8">
              Explore custom-made digital services specialized for your region. Need assistance or custom support? Contact our consulting team directly.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/contact"
                className="bg-[#2563eb] hover:bg-blue-700 text-white font-bold py-3.5 px-8 rounded-2xl transition-colors shadow-md text-xs uppercase tracking-wider flex items-center gap-2"
              >
                Contact Support <ArrowRight size={14} />
              </Link>
              <a
                href="tel:+917563901100"
                className="bg-gray-900 hover:bg-black text-white font-bold py-3.5 px-6 rounded-2xl transition-colors shadow-md text-xs uppercase tracking-wider flex items-center gap-2"
              >
                <Phone size={14} /> Call Agent
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
