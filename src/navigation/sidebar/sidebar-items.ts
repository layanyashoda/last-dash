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
        url: "/dashboard/landed-cost",
        icon: Proportions,
      },
      {
        title: "Platts",
        url: "/dashboard/platts",
        icon: ChartPie,
      },
      {
        title: "Jet A-1 Sales",
        url: "/dashboard/jet-a1-sales",
        icon: Plane,
      },
      {
        title: "Oil Balance Summary",
        url: "/dashboard/oil-balance",
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
        url: "/dashboard/sap-sales",
        icon: BadgeDollarSign,
      },
      {
        title: "Power Plant Sales",
        url: "/dashboard/power-plant-sales",
        icon: BadgeDollarSign,
      },
    ],
  }
];
