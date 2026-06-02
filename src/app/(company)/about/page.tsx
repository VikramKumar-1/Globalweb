import { Metadata } from 'next';
import AboutClient from '@/features/company/components/AboutClient';

export const metadata: Metadata = {
  title: 'About Us | GlobalWebify - Leading Digital Agency',
  description: 'Learn about GlobalWebify, a team of passionate creators, developers, and strategists dedicated to redefining what\'s possible in the digital realm.',
  keywords: ['About GlobalWebify', 'Digital Agency Team', 'Web Development Company', 'Digital Marketing Experts']
};

export default function AboutPage() {
  return <AboutClient />;
}
