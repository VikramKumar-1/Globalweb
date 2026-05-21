import DynamicPage, { generateMetadata as gm } from '../[slug]/page';

export const generateMetadata = () => gm({ params: { slug: 'social-media-marketing' } });

export default function Page() {
  return <DynamicPage params={{ slug: 'social-media-marketing' }} />;
}
