import {
  ShoppingBag,
  Car,
  Home,
  HeartPulse,
  GraduationCap,
  Coffee,
  Plane,
  Gift,
  Tv,
  Smartphone,
  Book,
  Monitor,
  Pizza,
  Music,
  Dumbbell,
  Briefcase,
  TrendingUp,
  Landmark,
  Plus,
  Trash2,
  Edit2,
  Tags,
  LucideIcon
} from "lucide-react";

export const AVAILABLE_ICONS = [
  { name: "ShoppingBag", icon: ShoppingBag },
  { name: "Car", icon: Car },
  { name: "Home", icon: Home },
  { name: "HeartPulse", icon: HeartPulse },
  { name: "GraduationCap", icon: GraduationCap },
  { name: "Coffee", icon: Coffee },
  { name: "Plane", icon: Plane },
  { name: "Gift", icon: Gift },
  { name: "Tv", icon: Tv },
  { name: "Smartphone", icon: Smartphone },
  { name: "Book", icon: Book },
  { name: "Monitor", icon: Monitor },
  { name: "Pizza", icon: Pizza },
  { name: "Music", icon: Music },
  { name: "Dumbbell", icon: Dumbbell },
  { name: "Briefcase", icon: Briefcase },
  { name: "TrendingUp", icon: TrendingUp },
  { name: "Landmark", icon: Landmark }
];

export const DEFAULT_CATEGORY_ICON_MAP: Record<string, string> = {
  "Salário": "Briefcase",
  "Freelance": "Monitor",
  "Investimentos": "TrendingUp",
  "Alimentação": "Pizza",
  "Transporte": "Car",
  "Moradia": "Home",
  "Saúde": "HeartPulse",
  "Educação": "GraduationCap",
  "Lazer": "Tv",
  "Compras": "ShoppingBag",
  "Outros": "Tags",
};

export function getIconComponent(iconName: string | undefined): LucideIcon {
  if (!iconName) return Tags;
  const found = AVAILABLE_ICONS.find(i => i.name === iconName);
  return found?.icon || Tags;
}
