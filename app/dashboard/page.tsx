import { getUserLetters } from "@/app/actions";
import { Mail, Eye, Plus, ExternalLink, Calendar, EyeIcon } from "lucide-react";
import DeleteLetterButton from "./DeleteLetterButton";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default async function DashboardPage() {
  const letters = await getUserLetters();
  
  const stats = {
    totalLetters: letters.length,
    totalViews: letters.reduce((acc: number, letter: Record<string, unknown>) => acc + ((letter.views as number) || 0), 0),
  };

  const recentLetters = letters.slice(0, 3);

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground font-heading">Welcome back, Creator!</h2>
          <p className="text-muted-foreground mt-2 text-lg">Here&apos;s what&apos;s happening with your letters today.</p>
        </div>
        <Link href="/dashboard/letters/new" className={buttonVariants({ className: "rounded-full shadow-md h-12 px-6" })}>
          <Plus size={20} className="mr-2" />
          Create New Letter
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="p-8 bg-white border border-border/60 rounded-2xl shadow-sm flex flex-col hover:border-primary/30 transition-colors">
          <div className="flex items-center text-muted-foreground mb-6">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
              <Mail size={20} className="text-primary" />
            </div>
            <h3 className="font-medium text-lg">Total Letters</h3>
          </div>
          <p className="text-5xl font-bold font-heading text-foreground">{stats.totalLetters}</p>
        </div>
        
        <div className="p-8 bg-white border border-border/60 rounded-2xl shadow-sm flex flex-col hover:border-primary/30 transition-colors">
          <div className="flex items-center text-muted-foreground mb-6">
            <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center mr-3">
              <Eye size={20} className="text-secondary-foreground" />
            </div>
            <h3 className="font-medium text-lg">Total Views</h3>
          </div>
          <p className="text-5xl font-bold font-heading text-foreground">{stats.totalViews}</p>
        </div>
        
        <div className="p-8 bg-[#fdfbf7] border-dashed border-2 border-border/80 rounded-2xl flex flex-col justify-center items-center text-center">
          <p className="text-muted-foreground mb-6 font-medium">Want to surprise someone else?</p>
          <Link href="/dashboard/letters/new" className={buttonVariants({ variant: "outline", className: "rounded-full w-full h-12 border-primary/20 hover:bg-primary/5" })}>
            Draft New Letter
          </Link>
        </div>
      </div>
      
      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-heading font-semibold">Recent Letters</h3>
          {letters.length > 3 && (
            <Link href="/dashboard/letters" className="text-sm font-medium text-primary hover:underline">
              Lihat Semua
            </Link>
          )}
        </div>
        
        {recentLetters.length === 0 ? (
          <div className="bg-white border border-border/60 rounded-2xl shadow-sm p-12 text-center flex flex-col items-center justify-center">
            <Mail className="text-muted-foreground/30 mb-4" size={48} />
            <p className="text-muted-foreground text-lg mb-6">You haven&apos;t created any letters yet.</p>
            <Link href="/dashboard/letters/new" className={buttonVariants({ className: "rounded-full" })}>
              Create your first letter
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recentLetters.map((letter: Record<string, unknown>) => (
              <div key={letter.id as string} className="bg-white border border-border/60 rounded-2xl shadow-sm p-6 flex flex-col hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${letter.status === 'published' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                    {letter.status === 'published' ? "Published" : "Draft"}
                  </div>
                  <div className="flex items-center gap-2">
                    <Link 
                      href={`/to/${letter.slug as string}`}
                      target="_blank"
                      className="text-muted-foreground hover:text-primary transition-colors p-1"
                      title="View Letter"
                    >
                      <ExternalLink size={16} />
                    </Link>
                    <DeleteLetterButton slug={letter.slug as string} />
                  </div>
                </div>
                
                <h4 className="font-heading font-semibold text-lg line-clamp-1 mb-1">{letter.title as string}</h4>
                <p className="text-muted-foreground text-sm mb-4">To: <span className="font-medium text-foreground">{letter.recipient_name as string}</span></p>
                
                <div className="mt-auto pt-4 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar size={14} className="mr-1.5" />
                    {new Date(letter.created_at as string).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </div>
                  <div className="flex items-center" title="Views">
                    <EyeIcon size={14} className="mr-1.5" />
                    {(letter.views as number) || 0}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
