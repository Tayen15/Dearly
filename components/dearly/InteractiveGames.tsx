"use client";

import { useState, useRef } from "react";
import { Heart, Send, CalendarHeart, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";

type LetterProps = {
  interactive_type?: string;
  interactive_data?: Record<string, string>;
  whatsapp_number?: string;
};

export default function InteractiveGames({ letter }: { letter: LetterProps | null }) {
  const [answered, setAnswered] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const noBtnRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  if (!letter) return null;

  if (letter.interactive_type === 'none' || !letter.interactive_type) {
    // If no interactive game, just show a simple reply button if WhatsApp is provided
    if (letter.whatsapp_number) {
      return (
        <div className="w-full max-w-2xl mt-12 flex flex-col items-center justify-center p-8 bg-white/50 backdrop-blur-sm rounded-3xl border border-white/40 shadow-xl">
          <p className="text-muted-foreground mb-4">Balas pesan ini</p>
          <a
            href={`https://wa.me/${letter.whatsapp_number}?text=${encodeURIComponent("Halo, aku sudah baca surat dari kamu!")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-medium shadow-md hover:bg-primary/90 transition-all"
          >
            <Send size={18} /> Kirim Balasan
          </a>
        </div>
      );
    }
    return null;
  }

  const { interactive_type, interactive_data, whatsapp_number } = letter;

  const handleMoveNo = () => {
    if (!noBtnRef.current || !containerRef.current) return;
    
    const btn = noBtnRef.current;
    const container = containerRef.current;
    
    const containerRect = container.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    
    const minX = 16;
    const minY = 16;
    const maxX = containerRect.width - btnRect.width - 16;
    const maxY = containerRect.height - btnRect.height - 16;

    // In case the container is too small, just don't move or move to 0
    const safeMaxX = Math.max(minX, maxX);
    const safeMaxY = Math.max(minY, maxY);
    
    const randomX = Math.random() * (safeMaxX - minX) + minX;
    const randomY = Math.random() * (safeMaxY - minY) + minY;
    
    btn.style.position = 'absolute';
    btn.style.left = `${randomX}px`;
    btn.style.top = `${randomY}px`;
  };

  const handleAnswer = (answer: string) => {
    setAnswered(true);
    triggerConfetti();
    if (whatsapp_number) {
      const text = `Hai! Aku udah baca suratnya dan jawaban aku: *${answer}* ❤️`;
      window.open(`https://wa.me/${whatsapp_number}?text=${encodeURIComponent(text)}`, "_blank");
    }
  };

  const triggerConfetti = () => {
    const end = Date.now() + 1.5 * 1000;
    const colors = ["#ffb6c1", "#fdfbf7", "#ff69b4", "#90EE90"];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  if (interactive_type === 'password_lock' && !answered) {
    const question = interactive_data?.question || "Masukkan password untuk membuka surat ini";
    const correctPassword = interactive_data?.password || "";

    const handlePasswordSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (passwordInput.toLowerCase() === correctPassword.toLowerCase()) {
        setAnswered(true);
        triggerConfetti();
      } else {
        setPasswordError(true);
        setTimeout(() => setPasswordError(false), 500); // remove shake class
      }
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-4">
        <div className={`w-full max-w-md bg-white p-8 rounded-3xl shadow-2xl border border-border flex flex-col items-center justify-center transition-all ${passwordError ? 'animate-in slide-in-from-left-2 duration-100' : ''}`}>
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <LockKeyhole size={32} className="text-primary" />
          </div>
          <h3 className="font-heading text-2xl font-bold text-center mb-6">{question}</h3>
          <form onSubmit={handlePasswordSubmit} className="w-full flex flex-col gap-4">
            <input 
              type="text" 
              placeholder="Masukkan jawaban..."
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className={`w-full h-14 px-4 text-center text-lg rounded-xl border-2 focus:outline-none transition-all ${passwordError ? 'border-destructive bg-destructive/5 text-destructive' : 'border-border focus:border-primary'}`}
            />
            {passwordError && <p className="text-destructive text-sm text-center font-medium">Jawaban salah, coba lagi!</p>}
            <Button type="submit" className="h-14 rounded-xl text-lg w-full mt-2">Buka Surat</Button>
          </form>
        </div>
      </div>
    );
  }

  if (interactive_type === 'password_lock' && answered) {
    return null; // Already unlocked, no need to show anything at the bottom
  }

  if (interactive_type === 'runaway_button') {
    const question = interactive_data?.question || "Maukah kamu?";
    const yesLabel = interactive_data?.yesLabel || "Iya";
    const noLabel = interactive_data?.noLabel || "Tidak";

    return (
      <div ref={containerRef} className="relative w-full max-w-2xl mt-12 flex flex-col items-center justify-center p-8 bg-white/50 backdrop-blur-sm rounded-3xl border border-white/40 shadow-xl overflow-hidden min-h-[300px]">
        {answered ? (
          <div className="text-center animate-in zoom-in duration-500">
            <Heart size={48} className="text-primary mx-auto mb-4 animate-bounce" fill="currentColor" />
            <h3 className="font-heading text-2xl font-bold text-foreground">Terima kasih atas jawabanmu! ❤️</h3>
            <p className="text-muted-foreground mt-2">Semoga harimu menyenangkan.</p>
          </div>
        ) : (
          <div className="text-center relative w-full h-full flex flex-col items-center justify-center">
            <h3 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-10">{question}</h3>
            <div className="flex gap-4 items-center justify-center w-full">
              <Button 
                onClick={() => handleAnswer(yesLabel)}
                className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 py-6 text-lg shadow-lg z-10 transition-all duration-300"
              >
                {yesLabel}
              </Button>
              <button
                ref={noBtnRef}
                onMouseEnter={handleMoveNo}
                onClick={handleMoveNo} // for mobile taps
                className="bg-muted text-muted-foreground rounded-full px-8 py-3 text-lg font-medium shadow-sm border border-border/50 hover:bg-muted/80 z-20 transition-all duration-200"
              >
                {noLabel}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (interactive_type === 'date_options') {
    const question = interactive_data?.question || "Kita date kemana?";
    const optionsRaw = interactive_data?.options || "Nonton, Makan, Jalan-jalan";
    const options = optionsRaw.split(',').map((o: string) => o.trim()).filter(Boolean);

    return (
      <div className="w-full max-w-2xl mt-12 flex flex-col items-center justify-center p-8 bg-white/50 backdrop-blur-sm rounded-3xl border border-white/40 shadow-xl">
        {answered ? (
          <div className="text-center animate-in zoom-in duration-500">
            <CalendarHeart size={48} className="text-primary mx-auto mb-4 animate-bounce" />
            <h3 className="font-heading text-2xl font-bold text-foreground">Yeay! Can&apos;t wait! ❤️</h3>
            <p className="text-muted-foreground mt-2">Pilihanmu sudah dikirim via WhatsApp.</p>
          </div>
        ) : (
          <div className="text-center w-full">
            <h3 className="font-heading text-2xl font-bold text-foreground mb-8">{question}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md mx-auto">
              {options.map((opt: string, idx: number) => (
                <Button 
                  key={idx}
                  onClick={() => handleAnswer(opt)}
                  variant="outline"
                  className="rounded-xl py-4 text-base border-primary/20 hover:border-primary hover:bg-primary/5 whitespace-normal h-full"
                >
                  {opt}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}
