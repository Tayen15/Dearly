"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface Polaroid {
  id: string;
  imageUrl: string;
  caption: string;
}

interface PolaroidGalleryProps {
  photos: Polaroid[];
}

export default function PolaroidGallery({ photos }: PolaroidGalleryProps) {
  return (
    <div className="w-full max-w-5xl mx-auto p-6 mt-24 mb-32">
      <motion.h2 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="font-heading text-2xl text-center text-muted-foreground/50 mb-16 uppercase tracking-widest"
      >
        Our Memories
      </motion.h2>
      
      <div className="flex flex-wrap justify-center gap-10 md:gap-16">
        {photos.map((photo, i) => (
          <PolaroidCard key={photo.id} photo={photo} index={i} />
        ))}
      </div>
    </div>
  );
}

function PolaroidCard({ photo, index }: { photo: Polaroid; index: number }) {
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Random rotation between -6 and 6 degrees
  const rotation = (index % 2 === 0 ? 1 : -1) * ((index * 3) % 6 + 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ scale: 1.05, rotate: 0, zIndex: 10 }}
      className="relative cursor-pointer"
      style={{ 
        rotate: `${rotation}deg`,
        perspective: "1000px" 
      }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="w-64 h-72 md:w-72 md:h-80 relative transition-transform duration-500"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
      >
        {/* Front */}
        <div 
          className="absolute inset-0 bg-white p-4 pb-16 shadow-lg border border-gray-100 rounded-sm"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="w-full h-full bg-gray-100 overflow-hidden relative border border-gray-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={photo.imageUrl} 
              alt={photo.caption} 
              className="w-full h-full object-cover"
            />
          </div>
          {/* Subtle tape effect at top */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-8 bg-white/40 backdrop-blur-md shadow-sm rotate-[-2deg] opacity-80" />
        </div>
        
        {/* Back */}
        <div 
          className="absolute inset-0 bg-[#fdfbf7] p-6 shadow-lg border border-gray-200 rounded-sm flex items-center justify-center text-center" 
          style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
        >
          <p className="font-caveat text-3xl text-foreground leading-tight px-4">
            {photo.caption}
          </p>
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-8 bg-white/40 backdrop-blur-md shadow-sm rotate-[2deg] opacity-80" />
        </div>
      </motion.div>
    </motion.div>
  );
}
