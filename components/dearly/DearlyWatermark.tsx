"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function DearlyWatermark() {
  const [isVisible, setIsVisible] = useState(false);

  // Tampilkan dengan delay agar penerima fokus ke surat/amplop terlebih dahulu
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 4000); // 4 detik delay

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full flex justify-center mt-12 pb-10 relative z-20"
        >
          <Link
            href="/"
            className="flex items-center gap-2 px-5 py-2.5 bg-white/30 hover:bg-white/60 backdrop-blur-md border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-full text-xs font-medium text-slate-700 transition-all duration-300"
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-500" />
            <span>
              Crafted with <strong className="font-bold text-slate-800">Dearly</strong>
            </span>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
