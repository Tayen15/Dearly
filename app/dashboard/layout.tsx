import { ReactNode } from "react";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { logout } from "@/app/auth/actions";
import DashboardNav from "@/components/dearly/DashboardNav";
import { createClient } from "@/utils/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    if (profile?.role === "admin") isAdmin = true;
  }

  return (
    <div className="min-h-screen bg-muted/20 flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border/60 bg-white hidden md:flex flex-col sticky top-0 h-screen">
        <div className="h-20 flex items-center px-8 border-b border-border/50">
          <Link
            href="/"
            className="font-heading font-bold text-2xl text-primary"
          >
            Dearly.
          </Link>
        </div>
        <DashboardNav isAdmin={isAdmin} />
        <div className="p-6 border-t border-border/50">
          <form action={logout}>
            <button
              type="submit"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors font-medium w-full"
            >
              <LogOut size={20} />
              Logout
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-20 border-b border-border/50 bg-white/70 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10">
          <h1 className="font-heading text-xl font-semibold text-foreground">
            Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>
        <div className="flex-1 p-6 md:p-10 overflow-y-auto pb-24 md:pb-10">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-border/60 flex items-center justify-around px-4 z-50 safe-area-bottom">
        <DashboardNav isMobile={true} isAdmin={isAdmin} />
        <form
          action={logout}
          className="flex flex-col items-center justify-center w-16 h-full"
        >
          <button
            type="submit"
            className="flex flex-col items-center justify-center text-muted-foreground hover:text-destructive transition-colors w-full h-full"
          >
            <LogOut size={20} className="mb-1" />
            <span className="text-[10px] font-medium">Logout</span>
          </button>
        </form>
      </div>
    </div>
  );
}
