import { 
  Home, HeartPulse, Utensils, GraduationCap, 
  Plane, ShoppingBag, Building2, ShoppingCart, 
  Sparkles, HeartHandshake, Hotel, Newspaper, LucideIcon
} from 'lucide-react';

export interface IndustryConfig {
  icon: LucideIcon;
  label: string;
  color: string;
}

export const INDUSTRIES_LIST: IndustryConfig[] = [
  { icon: Home, label: "Real Estate", color: "text-rose-500" },
  { icon: HeartPulse, label: "Medical & Doctors", color: "text-red-500" },
  { icon: Utensils, label: "Food & Beverage", color: "text-amber-600" },
  { icon: GraduationCap, label: "School & Education", color: "text-indigo-600" },
  { icon: Plane, label: "Tours & Travel", color: "text-cyan-600" },
  { icon: ShoppingBag, label: "B2C", color: "text-emerald-600" },
  { icon: Building2, label: "B2B", color: "text-blue-600" },
  { icon: ShoppingCart, label: "E-Commerce", color: "text-purple-600" },
  { icon: Sparkles, label: "Health & Beauty", color: "text-pink-500" },
  { icon: HeartHandshake, label: "Community Web Design", color: "text-green-600" },
  { icon: Hotel, label: "Hotels & Restaurants", color: "text-teal-600" },
  { icon: Newspaper, label: "News & Publication", color: "text-gray-600" }
];
