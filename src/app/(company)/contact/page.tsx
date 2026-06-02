import { Metadata } from 'next';
import ContactClient from '@/features/company/components/ContactClient';

export const metadata: Metadata = {
  title: 'Contact Us | GlobalWebify',
  description: 'Get in touch with GlobalWebify. Have a project in mind or just want to say hi? We\'d love to hear from you. Our team is ready to help you scale.',
  keywords: ['Contact GlobalWebify', 'Hire Web Developers', 'Digital Marketing Agency Contact', 'Web Design Services India']
};

export default function ContactPage() {
  return <ContactClient />;
}
