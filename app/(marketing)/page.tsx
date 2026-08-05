"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Heart, Sparkles, Music } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, useScroll, useTransform } from "framer-motion";

export default function LandingPage() {
  const { scrollY } = useScroll();
  const blobY = useTransform(scrollY, [0, 1000], [0, 300]);
  const envelopeY = useTransform(scrollY, [0, 1000], [0, -150]);

  return (
    <div className="w-full bg-[#FAFAF9] overflow-hidden">
      {/* 1. Hero Section - The Emotional Hook */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
        {/* Soft Background Blobs (Parallax) */}
        <motion.div style={{ y: blobY }} className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-10 opacity-70" />
        <motion.div style={{ y: blobY }} className="absolute top-20 -right-40 w-[400px] h-[400px] bg-rose-200/20 rounded-full blur-3xl -z-10" />
        <motion.div style={{ y: blobY }} className="absolute bottom-0 -left-40 w-[500px] h-[500px] bg-orange-100/30 rounded-full blur-3xl -z-10" />

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          {/* Copywriting */}
          <div className="max-w-xl">
            <div className="inline-flex items-center justify-center px-4 py-2 bg-white rounded-full mb-8 text-primary border border-border shadow-sm">
              <Heart size={14} className="mr-2 fill-primary/20" />
              <span className="text-xs font-semibold tracking-wide">Lebih dari sekadar pesan teks</span>
            </div>
            
            <h1 className="font-heading text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-6 leading-[1.1]">
              Beri kejutan yang <span className="text-primary italic font-serif">benar-benar</span> dikenang.
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed">
              Dearly mengubah kata-katamu menjadi pengalaman membuka surat digital interaktif. Dilengkapi alunan musik, galeri memori, dan sentuhan personal yang manis.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/dashboard" 
                className={cn(buttonVariants({ size: "lg" }), "rounded-full h-14 px-8 text-lg shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all duration-300")}
              >
                Buat Surat Pertamamu
              </Link>
              <Link 
                href="/to/demo" 
                className={cn(buttonVariants({ variant: "outline", size: "lg" }), "rounded-full h-14 px-8 text-lg border-border hover:bg-white bg-white/50 backdrop-blur-sm transition-all")}
              >
                Coba Buka Surat Demo
              </Link>
            </div>
          </div>

          {/* Visual: CSS Envelope Animation (Parallax) */}
          <motion.div style={{ y: envelopeY }} className="relative hidden lg:flex justify-center items-center h-[500px] perspective-1000">
             {/* Decorative Elements */}
             <motion.div 
               animate={{ y: [0, -10, 0] }} 
               transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
               className="absolute top-10 right-20 bg-white p-4 rounded-2xl shadow-xl rotate-12 cursor-pointer"
             >
                <Music className="text-primary" size={24} />
             </motion.div>
             <motion.div 
               animate={{ y: [0, 15, 0] }} 
               transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
               className="absolute bottom-20 left-10 bg-white p-3 rounded-2xl shadow-xl -rotate-12 "
             >
                <Heart className="text-rose-400 fill-rose-100" size={32} />
             </motion.div>

             {/* Main Envelope Mockup */}
             <div className="relative w-80 h-56 bg-[#f0eadd] rounded-lg shadow-2xl hover:scale-105 transition-transform duration-500 ease-out border border-white/50">
               {/* Flap */}
               <div className="absolute top-0 left-0 w-0 h-0 border-l-[160px] border-l-transparent border-r-[160px] border-r-transparent border-t-[100px] border-t-[#e3dbcd] origin-top z-20" />
               <div className="absolute bottom-0 left-0 w-0 h-0 border-l-[160px] border-l-transparent border-r-[160px] border-r-transparent border-b-[120px] border-b-[#fcfaf7] z-30" />
               <div className="absolute top-0 left-0 w-0 h-0 border-t-[112px] border-t-transparent border-b-[112px] border-b-transparent border-l-[160px] border-l-[#f9f6f0] z-20" />
               <div className="absolute top-0 right-0 w-0 h-0 border-t-[112px] border-t-transparent border-b-[112px] border-b-transparent border-r-[160px] border-r-[#f9f6f0] z-20" />
               
               {/* Letter sticking out */}
               <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[90%] h-[90%] bg-white rounded shadow-sm z-10 p-4 border border-border/30 overflow-hidden flex flex-col items-center pt-8">
                 <div className="w-12 h-1 bg-muted/30 rounded-full mb-3" />
                 <div className="w-full h-1 bg-muted/30 rounded-full mb-2" />
                 <div className="w-3/4 h-1 bg-muted/30 rounded-full mb-2" />
                 <div className="w-5/6 h-1 bg-muted/30 rounded-full" />
                 <div className="mt-auto text-primary opacity-50"><Heart size={16} /></div>
               </div>
             </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Use Cases - Kapan Menggunakan Dearly? */}
      <section className="py-32 px-6 bg-white relative">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-20 items-start">
          
          {/* Sticky Left Column */}
          <div className="lg:w-1/3 lg:sticky lg:top-32">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6 leading-[1.1]">
              Satu ruang untuk semua ceritamu.
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Tidak perlu menunggu perayaan besar. Terkadang, pesan sederhana di hari biasa adalah kejutan yang paling manis.
            </p>
            <div className="hidden lg:flex w-16 h-1 bg-primary/20 rounded-full" />
          </div>
          
          {/* Editorial List Right Column */}
          <div className="lg:w-2/3 flex flex-col w-full">
            {/* Item 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className="group border-b border-border/40 pb-12 mb-12 flex flex-col sm:flex-row gap-6 sm:gap-10 items-start"
            >
              <div className="text-5xl md:text-6xl text-primary/20 font-serif italic group-hover:text-primary/50 transition-colors">01</div>
              <div>
                <h3 className="text-2xl md:text-3xl font-heading font-semibold mb-4 text-foreground group-hover:translate-x-2 transition-transform duration-300">Hari Jadi</h3>
                <p className="text-muted-foreground text-lg leading-relaxed max-w-lg">
                  Rayakan perjalanan kalian dengan menyatukan deretan foto memori dan lagu favorit yang menyimpan banyak cerita di baliknya.
                </p>
              </div>
            </motion.div>
            
            {/* Item 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="group border-b border-border/40 pb-12 mb-12 flex flex-col sm:flex-row gap-6 sm:gap-10 items-start"
            >
              <div className="text-5xl md:text-6xl text-primary/20 font-serif italic group-hover:text-primary/50 transition-colors">02</div>
              <div>
                <h3 className="text-2xl md:text-3xl font-heading font-semibold mb-4 text-foreground group-hover:translate-x-2 transition-transform duration-300">Sekadar Rindu</h3>
                <p className="text-muted-foreground text-lg leading-relaxed max-w-lg">
                  Jarak fisik bukan halangan. Ubah kerinduan menjadi sesuatu yang bisa langsung dilihat, didengar, dan dirasakan hari ini juga.
                </p>
              </div>
            </motion.div>

            {/* Item 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="group border-b border-border/40 pb-12 mb-12 flex flex-col sm:flex-row gap-6 sm:gap-10 items-start"
            >
              <div className="text-5xl md:text-6xl text-primary/20 font-serif italic group-hover:text-primary/50 transition-colors">03</div>
              <div>
                <h3 className="text-2xl md:text-3xl font-heading font-semibold mb-4 text-foreground group-hover:translate-x-2 transition-transform duration-300">Permintaan Maaf</h3>
                <p className="text-muted-foreground text-lg leading-relaxed max-w-lg">
                  Terkadang kata &quot;maaf&quot; lebih tulus jika diungkapkan pelan-pelan melalui surat yang ditulis jujur dari hati.
                </p>
              </div>
            </motion.div>

            {/* Item 4 */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="group flex flex-col sm:flex-row gap-6 sm:gap-10 items-start"
            >
              <div className="text-5xl md:text-6xl text-primary/20 font-serif italic group-hover:text-primary/50 transition-colors">04</div>
              <div>
                <h3 className="text-2xl md:text-3xl font-heading font-semibold mb-4 text-foreground group-hover:translate-x-2 transition-transform duration-300">Ulang Tahun</h3>
                <p className="text-muted-foreground text-lg leading-relaxed max-w-lg">
                  Gantikan kartu ucapan fisik dengan surat interaktif yang tak akan pudar dan bisa dibuka berulang kali.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. The Experience - Anatomi Surat */}
      <section className="py-24 px-6 bg-[#FAFAF9]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-150px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center"
        >
          <div className="order-2 lg:order-1 relative">
            <div className="aspect-[4/5] bg-white rounded-3xl shadow-xl border border-border/60 overflow-hidden relative p-8">
              {/* Fake Letter UI Inside */}
              <div className="w-full h-full border border-dashed border-primary/20 rounded-2xl p-6 flex flex-col">
                <h4 className="font-serif text-2xl italic text-foreground mb-4">Untuk Kamu,</h4>
                <div className="space-y-3 mb-8">
                  <div className="w-full h-2 bg-muted/40 rounded-full" />
                  <div className="w-[90%] h-2 bg-muted/40 rounded-full" />
                  <div className="w-[95%] h-2 bg-muted/40 rounded-full" />
                  <div className="w-[80%] h-2 bg-muted/40 rounded-full" />
                </div>
                
                <div className="mt-auto grid grid-cols-2 gap-4">
                  <div className="bg-muted/20 h-32 rounded-xl border border-border/50 flex flex-col items-center justify-center -rotate-2 hover:rotate-0 transition-transform">
                    <Sparkles className="text-primary/40 mb-2" />
                    <span className="text-[10px] text-muted-foreground">Polaroid 1</span>
                  </div>
                  <div className="bg-muted/20 h-32 rounded-xl border border-border/50 flex flex-col items-center justify-center rotate-3 hover:rotate-0 transition-transform mt-4">
                    <Heart className="text-rose-400/40 mb-2" />
                    <span className="text-[10px] text-muted-foreground">Polaroid 2</span>
                  </div>
                </div>
              </div>
              
              {/* Music Player Overlay Mockup */}
              <div className="absolute top-12 right-12 bg-white/80 backdrop-blur shadow-lg rounded-full p-2 pr-4 flex items-center gap-3 border border-border/50 animate-pulse">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Music size={14} className="text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-foreground">Perfect</span>
                  <span className="text-[9px] text-muted-foreground">Ed Sheeran</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-10">
              Dirancang untuk membangkitkan senyuman.
            </h2>
            
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="mt-1">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Music size={18} className="text-primary" />
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-heading font-semibold mb-1">Musik yang Membangkitkan Kenangan</h4>
                  <p className="text-muted-foreground leading-relaxed text-sm">Tambahkan tautan lagu favorit yang akan diputar perlahan saat surat dibuka, mengatur suasana hati yang tepat.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="mt-1">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles size={18} className="text-primary" />
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-heading font-semibold mb-1">Galeri Polaroid 3D</h4>
                  <p className="text-muted-foreground leading-relaxed text-sm">Sisipkan foto-foto kebersamaan kalian yang bisa diputar balik untuk membaca pesan rahasia di baliknya.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="mt-1">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Heart size={18} className="text-primary" />
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-heading font-semibold mb-1">Pertanyaan Pembuka</h4>
                  <p className="text-muted-foreground leading-relaxed text-sm">Goda mereka dengan pertanyaan kecil seperti &quot;Kamu kangen aku nggak?&quot; sebelum isi surat sesungguhnya diperlihatkan.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 4. Final CTA */}
      <section className="py-32 px-6 bg-white text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-primary/5 rounded-full blur-3xl -z-10" />
        <div className="max-w-2xl mx-auto">
          <Heart className="mx-auto text-primary mb-6 animate-pulse" size={40} />
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
            Satu tautan untuk membuat harinya lebih baik.
          </h2>
          <p className="text-muted-foreground text-lg mb-10">
            Gratis. Tanpa instal aplikasi. Langsung bisa dibagikan via WhatsApp.
          </p>
          <Link 
            href="/dashboard" 
            className={cn(buttonVariants({ size: "lg" }), "rounded-full h-14 px-10 text-lg shadow-xl shadow-primary/20 hover:scale-105 transition-transform duration-300")}
          >
            Mulai Tulis Suratmu Sekarang
          </Link>
        </div>
      </section>
    </div>
  );
}
