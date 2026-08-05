import Link from "next/link";
import { Heart } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";

export default async function SiteHeader() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="w-full border-b border-border/40 bg-white/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-heading font-bold text-2xl text-primary flex items-center gap-2">
          <Heart size={24} className="fill-primary/20" /> Dearly.
        </Link>
        
        <nav className="flex items-center gap-4">
          {user ? (
            <Link href="/dashboard" className={buttonVariants({ className: "rounded-full shadow-sm" })}>
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/auth/login" className={buttonVariants({ variant: "ghost", className: "rounded-full hidden sm:inline-flex" })}>
                Masuk
              </Link>
              <Link href="/auth/login" className={buttonVariants({ className: "rounded-full shadow-sm" })}>
                Mulai Gratis
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
