import { Metadata } from 'next';
import PartnershipClient from '@/features/company/components/PartnershipClient';
import { db } from '@/lib/db';

export const revalidate = 0; // Fetch immediately when loaded

export async function generateMetadata(): Promise<Metadata> {
  try {
    const titleSetting = await db.siteSetting.findUnique({
      where: { key: 'partnershipPageTitle' }
    });
    const descSetting = await db.siteSetting.findUnique({
      where: { key: 'partnershipHeroDesc' }
    });
    return {
      title: titleSetting?.value || 'Partner Network | GlobalWeblify',
      description: descSetting?.value || 'Join the GlobalWeblify Partner Network. Unlock co-marketing, referral programs, dedicated support, and grow your agency or consultancy services with us.',
      keywords: ['GlobalWeblify Partnerships', 'Agency Partnership Program', 'Outsource Web Development', 'Referral Affiliate Program']
    };
  } catch {
    return {
      title: 'Partner Network | GlobalWeblify',
      description: 'Join the GlobalWeblify Partner Network. Unlock co-marketing, referral programs, dedicated support, and grow your agency or consultancy services with us.'
    };
  }
}

export default async function PartnershipPage() {
  let settings = {};
  try {
    const allSettings = await db.siteSetting.findMany();
    const settingsMap = allSettings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);

    settings = {
      partnershipPageTitle: settingsMap['partnershipPageTitle'],
      partnershipPageSlug: settingsMap['partnershipPageSlug'],
      partnershipHeroTitle: settingsMap['partnershipHeroTitle'],
      partnershipHeroDesc: settingsMap['partnershipHeroDesc'],
      partnershipHeading: settingsMap['partnershipHeading'],
      partnershipDesc: settingsMap['partnershipDesc'],
      partnershipPageImage: settingsMap['partnershipPageImage'],
      partnershipExpandHeading: settingsMap['partnershipExpandHeading'],
      partnershipExpandParagraph: settingsMap['partnershipExpandParagraph']
    };
  } catch (err) {
    console.error(err);
  }

  return <PartnershipClient settings={settings} />;
}
