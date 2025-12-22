"use client";
import * as React from "react";
import { useRouter } from "next/navigation";

import { LayoutDashboard, ChartBar, Gauge, ShoppingBag, GraduationCap, Forklift, Search, Plane, Droplets, BadgeDollarSign, ChartPie, ChartSpline, Proportions } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

const searchItems = [
  { group: "Dashboards", icon: LayoutDashboard, label: "Summary", href: "/dashboard/default" },
  { group: "Dashboards", icon: ChartSpline, label: "Refined Products Imports", href: "/dashboard/refined-products" },
  { group: "Dashboards", icon: Proportions, label: "Landed Cost", href: "/dashboard/landed-cost" },
  { group: "Dashboards", icon: ChartPie, label: "Platts", href: "/dashboard/platts" },
  { group: "Dashboards", icon: Plane, label: "Jet A-1 Sales", href: "/dashboard/jet-a1-sales" },
  { group: "Dashboards", icon: Droplets, label: "Oil Balance Summary", href: "/dashboard/oil-balance" },
  { group: "Additional Reports", icon: BadgeDollarSign, label: "SAP Monthly Total Sales", href: "/dashboard/sap-sales" },
  { group: "Additional Reports", icon: BadgeDollarSign, label: "Power Plant Sales", href: "/dashboard/power-plant-sales" },
];

export function SearchDialog() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <>
      <Button
        variant="link"
        className="text-muted-foreground !px-0 font-normal hover:no-underline"
        onClick={() => setOpen(true)}
      >
        <Search className="size-4" />
        Search
        <kbd className="bg-muted inline-flex h-5 items-center gap-1 rounded border px-1.5 text-[10px] font-medium select-none">
          <span className="text-xs">Ctrl + J</span>
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search reports..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {[...new Set(searchItems.map((item) => item.group))].map((group, i) => (
            <React.Fragment key={group}>
              {i !== 0 && <CommandSeparator />}
              <CommandGroup heading={group} key={group}>
                {searchItems
                  .filter((item) => item.group === group)
                  .map((item) => (
                    <CommandItem 
                      className="!py-1.5" 
                      key={item.label} 
                      onSelect={() => handleSelect(item.href)}
                    >
                      {item.icon && <item.icon />}
                      <span>{item.label}</span>
                    </CommandItem>
                  ))}
              </CommandGroup>
            </React.Fragment>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}