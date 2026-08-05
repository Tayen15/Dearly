"use client";

import { useState, useEffect } from "react";
import { Search, Loader2, Music, Play, Pause, Check } from "lucide-react";
import { searchYoutubeSong, YoutubeSearchResult } from "@/app/actions/youtube";
import { cn } from "@/lib/utils";

export default function YoutubeSearch({
  onSelect,
  initialUrl = "",
}: {
  onSelect?: (url: string) => void;
  initialUrl?: string;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<YoutubeSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Extract ID from initialUrl if provided
  const getInitialId = () => {
    if (!initialUrl) return "";
    const match = initialUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
    return match ? match[1] : "";
  };
  const getInitialStart = () => {
    if (!initialUrl) return 0;
    const match = initialUrl.match(/[?&](?:start|t)=([0-9]+)s?/);
    return match ? parseInt(match[1]) : 0;
  };

  const [selectedBaseId, setSelectedBaseId] = useState<string>(getInitialId());
  const [customStart, setCustomStart] = useState<number>(getInitialStart());
  const [previewingId, setPreviewingId] = useState<{ id: string; start: number } | null>(null);

  // Auto-search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (query.trim().length < 3) {
        setResults([]);
        setSearched(false);
        return;
      }

      setIsLoading(true);
      setSearched(true);
      try {
        const vids = await searchYoutubeSong(query);
        setResults(vids);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }, 700);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const parseDurationToSeconds = (durationStr: string) => {
    if (!durationStr) return 0;
    const parts = durationStr.split(':').map(Number);
    if (parts.length === 2) return parts[0] * 60 + parts[1]; // mm:ss
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]; // hh:mm:ss
    return 0;
  };

  const handleSelect = (vid: YoutubeSearchResult) => {
    setSelectedBaseId(vid.id);
    
    // Smart Chorus Estimation: Start at 33% of the song
    const totalSecs = parseDurationToSeconds(vid.duration);
    const estimatedStart = Math.floor(totalSecs * 0.33);
    
    setCustomStart(estimatedStart);
    setPreviewingId({ id: vid.id, start: estimatedStart });
    
    const url = `https://www.youtube.com/watch?v=${vid.id}${estimatedStart > 0 ? `&start=${estimatedStart}` : ''}`;
    if (onSelect) onSelect(url);
  };

  const togglePreview = (e: React.MouseEvent, vid: YoutubeSearchResult) => {
    e.stopPropagation();
    if (previewingId?.id === vid.id) {
      setPreviewingId(null);
    } else {
      const isSelected = selectedBaseId === vid.id;
      if (isSelected) {
        setPreviewingId({ id: vid.id, start: customStart });
      } else {
        const totalSecs = parseDurationToSeconds(vid.duration);
        setPreviewingId({ id: vid.id, start: Math.floor(totalSecs * 0.33) });
      }
    }
  };

  const handleCustomStartChange = (val: number) => {
    setCustomStart(val);
    if (previewingId?.id === selectedBaseId) {
      // Update preview to new start time
      setPreviewingId({ id: selectedBaseId, start: val });
    }
    
    let url = `https://www.youtube.com/watch?v=${selectedBaseId}`;
    if (val > 0) url += `&start=${val}`;
    if (onSelect) onSelect(url);
  };
  

  return (
    <div className="w-full space-y-4">
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {isLoading ? (
            <Loader2 size={16} className="text-primary animate-spin" />
          ) : (
            <Search size={16} className="text-muted-foreground" />
          )}
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari lagu latar belakang (mis: Perfect Ed Sheeran)"
          className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
        />
      </div>

      {/* Results List */}
      <div className="space-y-1.5 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
        {results.map((vid) => {
          const isSelected = selectedBaseId === vid.id;
          const isPreviewing = previewingId?.id === vid.id;
          
          return (
            <div
              key={vid.id}
              onClick={() => handleSelect(vid)}
              className={cn(
                "flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all border group",
                isSelected
                  ? "bg-primary/10 border-primary/40 shadow-sm"
                  : "bg-transparent border-transparent hover:bg-muted/40"
              )}
            >
              {/* Thumbnail (Square Spotify Style) */}
              <div 
                className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden flex-shrink-0 shadow-sm"
                onClick={(e) => togglePreview(e, vid)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={vid.thumbnail}
                  alt={vid.title}
                  className="w-full h-full object-cover scale-110" 
                />
                <div className={cn(
                  "absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center transition-all",
                  isPreviewing ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                )}>
                  {isPreviewing ? (
                    <Pause size={20} className="text-white fill-white" />
                  ) : (
                    <Play size={20} className="text-white fill-white ml-1" />
                  )}
                </div>
              </div>
              
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <h4 className={cn("text-sm font-semibold truncate transition-colors", isSelected ? "text-primary" : "text-foreground")}>
                  {vid.title}
                </h4>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                  <span className="truncate max-w-[120px] sm:max-w-[200px]">{vid.author}</span>
                  <span className="text-[10px]">•</span>
                  <span>{vid.duration}</span>
                </div>
              </div>

              {isSelected && (
                <div className="flex-shrink-0 pr-2">
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-sm animate-in zoom-in">
                    <Check size={12} strokeWidth={3} />
                  </div>
                </div>
              )}
            </div>
          );
        })}
        
        {searched && results.length === 0 && !isLoading && (
          <div className="text-center py-6 text-sm text-muted-foreground">
            Lagu tidak ditemukan. Coba kata kunci lain.
          </div>
        )}
      </div>
      
      {/* Current selection summary */}
      {selectedBaseId && (
        <div className="flex flex-col gap-3 p-4 bg-primary/5 rounded-xl border border-primary/10">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Music size={16} className="text-primary" />
            <span className="truncate flex-1 font-medium">Lagu Terpilih</span>
            <button 
              type="button"
              onClick={() => {
                setSelectedBaseId("");
                setPreviewingId(null);
                if (onSelect) onSelect("");
              }}
              className="text-destructive hover:underline text-xs"
            >
              Hapus Lagu
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <label className="text-xs font-medium text-foreground whitespace-nowrap">Mulai Lagu dari (Detik):</label>
            <input
              type="number"
              min="0"
              value={customStart}
              onChange={(e) => handleCustomStartChange(parseInt(e.target.value) || 0)}
              className="w-20 px-2 py-1 text-sm border border-border rounded bg-white focus:outline-primary"
            />
            <span className="text-[10px] text-muted-foreground leading-tight">
              Ubah angka ini jika Anda ingin lagunya<br/>diputar mulai dari tengah (reff) untuk penerima.
            </span>
          </div>
        </div>
      )}

      {/* Hidden Preview Player */}
      {previewingId && (
        <div className="fixed opacity-0 pointer-events-none w-0 h-0 overflow-hidden">
          <iframe
            width="100"
            height="100"
            src={`https://www.youtube.com/embed/${previewingId.id}?autoplay=1&start=${previewingId.start}&controls=0`}
            allow="autoplay"
          />
        </div>
      )}
    </div>
  );
}
