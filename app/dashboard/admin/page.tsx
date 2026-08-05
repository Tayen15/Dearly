import { createClient } from "@/utils/supabase/server";
import { Users, Mail, Eye, ShieldAlert } from "lucide-react";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  
  // Stats queries
  const [{ count: totalUsers }, { count: totalLetters }, { data: letters }] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("letters").select("*", { count: "exact", head: true }),
    supabase.from("letters").select("views")
  ]);

  const totalViews = letters?.reduce((acc, curr) => acc + (curr.views || 0), 0) || 0;

  // Recent users
  const { data: recentUsers } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground font-heading flex items-center gap-2">
            <ShieldAlert className="text-primary" /> Admin Control
          </h2>
          <p className="text-muted-foreground mt-2 text-lg">Platform metrics and system overview.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="p-8 bg-white border border-border/60 rounded-2xl shadow-sm flex flex-col">
          <div className="flex items-center text-muted-foreground mb-6">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mr-3">
              <Users size={20} className="text-blue-500" />
            </div>
            <h3 className="font-medium text-lg">Total Users</h3>
          </div>
          <p className="text-5xl font-bold font-heading text-foreground">{totalUsers || 0}</p>
        </div>
        
        <div className="p-8 bg-white border border-border/60 rounded-2xl shadow-sm flex flex-col">
          <div className="flex items-center text-muted-foreground mb-6">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
              <Mail size={20} className="text-primary" />
            </div>
            <h3 className="font-medium text-lg">Total Letters</h3>
          </div>
          <p className="text-5xl font-bold font-heading text-foreground">{totalLetters || 0}</p>
        </div>
        
        <div className="p-8 bg-white border border-border/60 rounded-2xl shadow-sm flex flex-col">
          <div className="flex items-center text-muted-foreground mb-6">
            <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center mr-3">
              <Eye size={20} className="text-secondary-foreground" />
            </div>
            <h3 className="font-medium text-lg">Total Views</h3>
          </div>
          <p className="text-5xl font-bold font-heading text-foreground">{totalViews}</p>
        </div>
      </div>

      <div className="mt-12 bg-white rounded-2xl shadow-sm border border-border/60 overflow-hidden">
        <div className="p-6 border-b border-border/60">
          <h3 className="text-xl font-heading font-semibold">Recent Registrations</h3>
        </div>
        <div className="divide-y divide-border/60">
          {recentUsers?.map((user) => (
            <div key={user.id} className="p-6 flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">{user.full_name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <div className="text-right">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                  {user.role}
                </span>
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
