import { ReactNode } from "react";
import SiteHeader from "@/components/dearly/SiteHeader";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <footer className="py-12 text-center text-sm text-muted-foreground border-t border-border/30 bg-white">
        <p>© {new Date().getFullYear()} Dearly. Crafted with love.</p>
      </footer>
    </div>
  );
}
