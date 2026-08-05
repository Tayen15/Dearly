"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Heart } from "lucide-react";
import YoutubeAudioPlayer, { AudioPlayerRef } from "@/components/dearly/YoutubeAudioPlayer";

interface EnvelopeUnboxingProps {
  onOpen?: () => void;
  recipientName: string;
  senderName?: string;
  bgmUrl?: string;
  children?: React.ReactNode;
}

export default function EnvelopeUnboxing({
  onOpen,
  recipientName,
  senderName,
  bgmUrl,
  children,
}: EnvelopeUnboxingProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [unboxState, setUnboxState] = useState<"idle" | "opening" | "opened">("idle");
  const [isPlaying, setIsPlaying] = useState(false);
  const audioPlayerRef = useRef<AudioPlayerRef>(null);

  const handleOpen = () => {
    if (unboxState !== "idle") return;
    
    // Play audio synchronously to bypass browser autoplay blocks
    if (audioPlayerRef.current) {
      audioPlayerRef.current.playAudio();
    }
    
    setUnboxState("opening");
    setIsPlaying(true);

    // Trigger confetti from both sides
    const duration = 2 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#ffb6c1", "#fdfbf7", "#ff69b4", "#90EE90"],
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#ffb6c1", "#fdfbf7", "#ff69b4", "#90EE90"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    // Sequence for realistic unboxing
    setTimeout(() => {
      setUnboxState("opened"); // Surat mulai meluncur naik
    }, 800);

    setTimeout(() => {
      setIsOpen(true); // Keseluruhan amplop menghilang, transisi ke halaman surat
      if (onOpen) onOpen();
    }, 2400);
  };

  return (
    <>
      {children}
      {bgmUrl && <YoutubeAudioPlayer ref={audioPlayerRef} url={bgmUrl} playing={isPlaying} />}
      <AnimatePresence>
        {!isOpen && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="fixed inset-0 z-40 flex items-center justify-center bg-background p-4"
        >
          <motion.div
            whileHover={unboxState === "idle" ? { scale: 1.02 } : {}}
            whileTap={unboxState === "idle" ? { scale: 0.98 } : {}}
            className="relative cursor-pointer max-w-md w-full aspect-[4/3] bg-[#e6e2d6] rounded-xl shadow-2xl flex items-center justify-center border border-border/50"
            style={{ perspective: "1000px" }}
            onClick={handleOpen}
          >
            {/* Inner Letter (Slides Up) */}
            <motion.div 
              initial={{ y: "10%", opacity: 0 }}
              animate={
                unboxState === "opened" ? { y: "-40%", opacity: 1 } :
                unboxState === "opening" ? { y: "10%", opacity: 1 } :
                { y: "10%", opacity: 0 }
              }
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute inset-x-6 top-6 bottom-6 bg-[#fcfbf9] rounded-md shadow-inner border border-slate-200 z-10 flex flex-col items-center justify-start p-6"
            >
              {/* Dummy text lines to simulate letter content */}
              <div className="w-full h-3 bg-slate-200 rounded mb-4 opacity-50"></div>
              <div className="w-3/4 h-3 bg-slate-200 rounded mb-6 opacity-50"></div>
              <div className="w-full h-2 bg-slate-100 rounded mb-3"></div>
              <div className="w-full h-2 bg-slate-100 rounded mb-3"></div>
              <div className="w-5/6 h-2 bg-slate-100 rounded mb-3"></div>
              <div className="w-full h-2 bg-slate-100 rounded mb-3"></div>
            </motion.div>

            {/* Left Flap */}
            <div className="absolute inset-0 bg-[#f4f0e6] z-15 rounded-xl border-r border-border/20" style={{ clipPath: "polygon(0 0, 50% 50%, 0 100%)" }} />
            
            {/* Right Flap */}
            <div className="absolute inset-0 bg-[#efeadd] z-15 rounded-xl border-l border-border/20" style={{ clipPath: "polygon(100% 0, 50% 50%, 100% 100%)" }} />
            
            {/* Bottom Flap */}
            <div className="absolute inset-0 bg-[#fdfbf7] z-20 rounded-b-xl shadow-[0_-4px_10px_rgba(0,0,0,0.02)]" style={{ clipPath: "polygon(0 100%, 50% 50%, 100% 100%)" }} />

            {/* Top Flap */}
            <motion.div
              animate={{ 
                rotateX: unboxState !== "idle" ? 180 : 0,
                zIndex: unboxState === "opened" ? 5 : 30 
              }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              style={{ transformOrigin: "top center", clipPath: "polygon(0 0, 100% 0, 50% 50%)" }}
              className="absolute top-0 inset-x-0 h-full bg-[#fcf9f2] rounded-t-xl drop-shadow-md origin-top border-b border-border/10"
            />

            {/* Wax Seal & Text (Fades out when opening) */}
            <motion.div 
              animate={{ 
                opacity: unboxState !== "idle" ? 0 : 1, 
                scale: unboxState !== "idle" ? 0.5 : 1 
              }}
              transition={{ duration: 0.3 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 flex flex-col items-center pointer-events-none"
            >
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.5 }}
                className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-lg border-2 border-primary/20"
              >
                <Heart className="text-white fill-white" size={28} />
              </motion.div>
              <div className="mt-6 text-center bg-white/60 backdrop-blur-sm py-2 px-6 rounded-full shadow-sm">
                <p className="text-foreground font-heading font-medium">
                  For:{" "}
                  <span className="font-caveat text-xl text-primary">
                    {recipientName}
                  </span>
                </p>
                {senderName && (
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    From: <span className="font-semibold">{senderName}</span>
                  </p>
                )}
                <p className="text-[10px] text-muted-foreground/70 mt-1 uppercase tracking-widest">
                  Tap to open
                </p>
              </div>
            </motion.div>

          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </>
  );
}
