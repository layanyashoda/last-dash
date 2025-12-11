import {
  ShoppingBag,
  Forklift,
  Mail,
  MessageSquare,
  Calendar,
  Kanban,
  ReceiptText,
  Users,
  Lock,
  Fingerprint,
  SquareArrowUpRight,
  LayoutDashboard,
  ChartBar,
  Banknote,
  Gauge,
  GraduationCap,
  type LucideIcon,
  Droplets,
  BadgeDollarSign,
  ChartPie,
  ChartSpline,
  Plane,
  Proportions,
} from "lucide-react";

export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  subItems?: NavSubItem[];
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Dashboards",
    items: [
      {
        title: "Summary",
        url: "/dashboard/default",
        icon: LayoutDashboard,
      },
      {
        title: "Refined Products Imports",
        url: "/dashboard/refined-products",
        icon: ChartSpline,
      },
      {
        title: "Landed Cost",
        url: "/dashboard/finance",
        icon: Proportions,
      },
      {
        title: "Platts",
        url: "/dashboard/coming-soon",
        icon: ChartPie,
      },
      {
        title: "Jet A-1 Sales",
        url: "/dashboard/coming-soon",
        icon: Plane,
      },
      {
        title: "Oil Balance Summary",
        url: "/dashboard/coming-soon",
        icon: Droplets,
      },
    ],
  },
  {
    id: 2,
    label: "Additional Pages",
    items: [
      {
        title: "SAP Monthly Total Sales",
        url: "/dashboard/coming-soon",
        icon: BadgeDollarSign,
      },
      {
        title: "SAP Power Plant Sales",
        url: "/dashboard/coming-soon",
        icon: BadgeDollarSign,
      },
    ],
  }
];
