"use client";

import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { Volume2, VolumeX, Play, AlertCircle } from "lucide-react";

export interface AudioPlayerRef {
  playAudio: () => void;
}

const YoutubeAudioPlayer = forwardRef<AudioPlayerRef, { url: string; playing: boolean }>(({ url, playing: autoPlay }, ref) => {
  const [userIsPlaying, setUserIsPlaying] = useState<boolean | null>(null);
  const [muted, setMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [origin, setOrigin] = useState("");
  
  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  const isPlaying = userIsPlaying !== null ? userIsPlaying : autoPlay;
  const isYoutube = url.includes("youtube.com") || url.includes("youtu.be");

  // Extract YouTube Video ID and Start Time
  const getYoutubeId = (urlStr: string) => {
    const match = urlStr.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
    return match ? match[1] : null;
  };
  const getYoutubeStart = (urlStr: string) => {
    const match = urlStr.match(/[?&](?:start|t)=([0-9]+)s?/);
    return match ? match[1] : null;
  };

  const videoId = isYoutube ? getYoutubeId(url) : null;
  const startTime = isYoutube ? getYoutubeStart(url) : null;

  useImperativeHandle(ref, () => ({
    playAudio: () => {
      // Synchronous play for Native Audio
      if (!isYoutube && audioRef.current) {
         audioRef.current.play().catch(e => {
           console.error("🎵 Native Audio block:", e);
           setError("Browser memblokir audio");
           setUserIsPlaying(false);
         });
         setUserIsPlaying(true);
      }
      
      // Synchronous play for YouTube IFrame
      if (isYoutube && iframeRef.current && iframeRef.current.contentWindow) {
         iframeRef.current.contentWindow.postMessage(JSON.stringify({
           event: 'command',
           func: 'playVideo',
           args: []
         }), '*');
         setUserIsPlaying(true);
      }
    }
  }));

  // Handle Pause programmatically (via state)
  useEffect(() => {
    if (isPlaying) return; // Play is handled synchronously by playAudio()
    
    if (isYoutube && iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(JSON.stringify({
        event: 'command',
        func: 'pauseVideo',
        args: []
      }), '*');
    } else if (!isYoutube && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, isYoutube]);

  // Handle Mute programmatically
  useEffect(() => {
    if (isYoutube && iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(JSON.stringify({
        event: 'command',
        func: muted ? 'mute' : 'unMute',
        args: []
      }), '*');
      // Also force volume to 100 on YouTube just in case
      if (!muted) {
        iframeRef.current.contentWindow.postMessage(JSON.stringify({
          event: 'command',
          func: 'setVolume',
          args: [100]
        }), '*');
      }
    } else if (!isYoutube && audioRef.current) {
      audioRef.current.muted = muted;
    }
  }, [muted, isYoutube]);

  // Sync YouTube state back to React
  useEffect(() => {
    if (!isYoutube) return;
    
    const handleMessage = (e: MessageEvent) => {
      // YouTube IFrame API posts JSON strings
      if (typeof e.data !== 'string') return;
      try {
        const data = JSON.parse(e.data);
        if (data.event === "infoDelivery" && data.info) {
          if (data.info.playerState === 1) { // 1 = playing
            setUserIsPlaying(true);
            setError(null);
          } else if (data.info.playerState === 2 || data.info.playerState === 0) { // 2 = paused, 0 = ended
            setUserIsPlaying(false);
          }
        }
      } catch {
        // ignore JSON parse errors from other messages
      }
    };
    
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [isYoutube]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {error && (
        <div className="bg-destructive/10 text-destructive text-[10px] px-3 py-1.5 rounded-full flex items-center gap-1">
          <AlertCircle size={12} /> {error}
        </div>
      )}
      
      {/* YouTube Player - Raw Iframe */}
      {isYoutube && videoId && (
        <div className="absolute top-0 left-0 w-[300px] h-[300px] -z-10 overflow-hidden" style={{ clipPath: "inset(100%)" }}>
          <iframe
            ref={iframeRef}
            width="300"
            height="300"
            src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&controls=0&origin=${origin}${startTime ? `&start=${startTime}` : ''}`}
            allow="autoplay"
            style={{ border: 'none' }}
          />
        </div>
      )}
      
      {/* Native HTML5 Audio Element for MP3 */}
      {!isYoutube && (
        <audio 
          ref={audioRef}
          src={url} 
          loop 
          onPlay={() => { 
            setUserIsPlaying(true); 
            setError(null); 
          }}
          onPause={() => setUserIsPlaying(false)}
          onError={() => setError("URL MP3 tidak valid")}
          className="hidden"
        />
      )}
      
      {isPlaying ? (
        <button
          onClick={() => setMuted(!muted)}
          className="p-3 bg-white/70 backdrop-blur-md rounded-full shadow-lg hover:bg-white transition-all text-primary border border-primary/20 cursor-pointer flex items-center gap-2 group"
          title={muted ? "Unmute BGM" : "Mute BGM"}
        >
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          <div className="w-0 overflow-hidden group-hover:w-auto transition-all">
            <span className="text-[10px] font-bold pr-1">{muted ? "Muted" : "Playing"}</span>
          </div>
        </button>
      ) : (
        <button
          onClick={() => {
            // If user manually clicks play, we trigger it synchronously
            if (isYoutube && iframeRef.current?.contentWindow) {
              iframeRef.current.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'playVideo', args: [] }), '*');
            } else if (!isYoutube && audioRef.current) {
              audioRef.current.play().catch(() => {});
            }
            setUserIsPlaying(true);
            setMuted(false);
          }}
          className="p-3 bg-white/70 backdrop-blur-md rounded-full shadow-lg hover:bg-white transition-all text-primary border border-primary/20 cursor-pointer animate-pulse flex items-center gap-2"
          title="Play BGM"
        >
          <Play size={18} className="ml-0.5 fill-primary" />
          <span className="text-[10px] font-bold pr-1">Play Music</span>
        </button>
      )}
    </div>
  );
});

YoutubeAudioPlayer.displayName = "YoutubeAudioPlayer";
export default YoutubeAudioPlayer;
