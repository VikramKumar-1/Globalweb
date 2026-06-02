export interface CategoryConfig {
  label: string;
  description: string;
  icons: string[];
}

export const CATEGORY_CONFIG: Record<string, CategoryConfig> = {
  website: {
    label: 'Website Development Services',
    description: 'Custom, responsive, and high-performance websites built for your business.',
    icons: ['Monitor', 'Smartphone', 'ShoppingCart', 'Layout', 'Palette', 'Settings', 'Code', 'Briefcase'],
  },
  marketing: {
    label: 'Digital Marketing Services',
    description: 'Data-driven strategies to grow your online presence and generate leads.',
    icons: ['BarChart3', 'Search', 'Share2', 'Megaphone', 'FileText', 'Globe', 'TrendingUp', 'Briefcase'],
  },
  branding: {
    label: 'Branding & PR Services',
    description: 'Build a powerful brand identity that resonates with your audience.',
    icons: ['Palette', 'Globe', 'FileText', 'Megaphone', 'Share2', 'Settings', 'Code', 'Briefcase'],
  },
};
