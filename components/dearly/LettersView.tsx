"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Calendar, EyeIcon, ExternalLink, Search } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import DeleteLetterButton from "@/app/dashboard/DeleteLetterButton";

export default function LettersView({ letters }: { letters: Record<string, unknown>[] }) {
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [sort, setSort] = useState<"newest" | "oldest" | "most_viewed">("newest");
  const [search, setSearch] = useState("");

  // Apply filters and sorting
  const filteredLetters = letters.filter(letter => {
    const matchesFilter = filter === "all" || letter.status === filter;
    const matchesSearch = 
      (letter.title as string).toLowerCase().includes(search.toLowerCase()) || 
      (letter.recipient_name as string).toLowerCase().includes(search.toLowerCase());
    
    return matchesFilter && matchesSearch;
  }).sort((a, b) => {
    if (sort === "newest") {
      return new Date(b.created_at as string).getTime() - new Date(a.created_at as string).getTime();
    } else if (sort === "oldest") {
      return new Date(a.created_at as string).getTime() - new Date(b.created_at as string).getTime();
    } else if (sort === "most_viewed") {
      return ((b.views as number) || 0) - ((a.views as number) || 0);
    }
    return 0;
  });

  return (
    <div className="space-y-8">
      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between bg-white p-4 rounded-2xl border border-border/60 shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input 
            type="text" 
            placeholder="Cari nama atau judul..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 h-10 rounded-xl bg-muted/30 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-muted/30 p-1 rounded-xl border border-border/50">
            <button 
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${filter === "all" ? "bg-white shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              Semua
            </button>
            <button 
              onClick={() => setFilter("published")}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${filter === "published" ? "bg-white shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              Published
            </button>
            <button 
              onClick={() => setFilter("draft")}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${filter === "draft" ? "bg-white shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              Draft
            </button>
          </div>
          
          <select 
            value={sort}
            onChange={(e) => setSort(e.target.value as "newest" | "oldest" | "most_viewed")}
            className="h-10 px-3 py-2 bg-white border border-border/50 rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
          >
            <option value="newest">Terbaru</option>
            <option value="oldest">Terlama</option>
            <option value="most_viewed">Paling Banyak Dilihat</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {filteredLetters.length === 0 ? (
        <div className="bg-white border border-border/60 rounded-2xl shadow-sm p-12 text-center flex flex-col items-center justify-center">
          <Mail className="text-muted-foreground/30 mb-4" size={48} />
          <p className="text-muted-foreground text-lg mb-6">
            {letters.length === 0 
              ? "Anda belum membuat surat apa pun." 
              : "Tidak ada surat yang cocok dengan pencarian/filter."}
          </p>
          {letters.length === 0 && (
            <Link href="/dashboard/letters/new" className={buttonVariants({ className: "rounded-full" })}>
              Buat Surat Pertama
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredLetters.map((letter: Record<string, unknown>) => (
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
              <p className="text-muted-foreground text-sm mb-4">Untuk: <span className="font-medium text-foreground">{letter.recipient_name as string}</span></p>
              
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
  );
}
