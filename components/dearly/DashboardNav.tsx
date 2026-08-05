"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Mail, Settings, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardNav({ isMobile = false, isAdmin = false }: { isMobile?: boolean, isAdmin?: boolean }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard, exact: true },
    { name: "Letters", href: "/dashboard/letters", icon: Mail, exact: false },
    ...(isAdmin ? [{ name: "Admin", href: "/dashboard/admin", icon: Shield, exact: false }] : []),
    { name: "Settings", href: "/dashboard/settings", icon: Settings, exact: false },
  ];

  const checkActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  if (isMobile) {
    return (
      <>
        {navItems.map((item) => {
          const isActive = checkActive(item.href, item.exact);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-16 h-full transition-colors duration-200",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon size={20} className="mb-1" />
              <span className={cn("text-[10px]", isActive ? "font-bold" : "font-medium")}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </>
    );
  }

  return (
    <nav className="flex-1 px-4 py-8 flex flex-col gap-2">
      {navItems.map((item) => {
        const isActive = checkActive(item.href, item.exact);
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200",
              isActive 
                ? "bg-primary/10 text-primary" 
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            )}
          >
            <item.icon size={20} className={cn("transition-colors", isActive ? "text-primary" : "text-muted-foreground")} />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
