import DynamicPage, { generateMetadata as gm } from '../[slug]/page';

export const generateMetadata = () => gm({ params: { slug: 'seo-services' } });

export default function Page() {
  return <DynamicPage params={{ slug: 'seo-services' }} />;
}
