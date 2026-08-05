"use client";

import { useEffect, useRef } from "react";

export default function LetterWatermark() {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Kita menempelkan watermark langsung ke elemen parent dari komponen ini (yaitu kertas surat)
    // agar lebih sulit dihapus dengan inspect element
    const paperContainer = sentinelRef.current?.parentElement;
    if (!paperContainer) return;

    // Buat elemen watermark
    const watermark = document.createElement("div");
    watermark.innerText = "DEARLY";
    
    // Fungsi untuk menerapkan gaya CSS agar selalu konsisten
    const applyStyles = () => {
      watermark.style.position = "absolute";
      watermark.style.bottom = "1.5rem";
      watermark.style.right = "2rem";
      watermark.style.opacity = "0.15"; // Tipis transparansi
      watermark.style.fontFamily = "system-ui, -apple-system, sans-serif";
      watermark.style.fontWeight = "700";
      watermark.style.letterSpacing = "0.25em";
      watermark.style.fontSize = "0.75rem";
      watermark.style.pointerEvents = "none";
      watermark.style.userSelect = "none";
      watermark.style.display = "block";
      watermark.style.visibility = "visible";
      watermark.style.color = "currentColor";
      watermark.style.zIndex = "50";
    };

    applyStyles();
    paperContainer.appendChild(watermark);

    // Gunakan MutationObserver untuk memantau jika watermark dihapus atau di-hide (display: none)
    const observer = new MutationObserver((mutations) => {
      let shouldReappend = false;
      let shouldRestyle = false;

      mutations.forEach((mutation) => {
        // Jika node dihapus dari DOM
        if (mutation.type === "childList") {
          const removedNodes = Array.from(mutation.removedNodes);
          if (removedNodes.includes(watermark)) {
            shouldReappend = true;
          }
        } 
        // Jika style/class diubah (e.g. visibility hidden, opacity 0, display none)
        else if (mutation.type === "attributes" && mutation.target === watermark) {
          shouldRestyle = true;
        }
      });

      // Kembalikan seperti semula
      if (shouldReappend) {
        observer.disconnect();
        paperContainer.appendChild(watermark);
        observe();
      } else if (shouldRestyle) {
        observer.disconnect();
        applyStyles();
        observe();
      }
    });

    const observe = () => {
      observer.observe(paperContainer, { childList: true });
      observer.observe(watermark, { 
        attributes: true, 
        attributeFilter: ["style", "class", "hidden"] 
      });
    };

    observe();

    return () => {
      observer.disconnect();
      if (paperContainer.contains(watermark)) {
        paperContainer.removeChild(watermark);
      }
    };
  }, []);

  return <div ref={sentinelRef} className="hidden" aria-hidden="true" />;
}
