"use client";

import { useState, useRef } from "react";
import { compressImage } from "@/lib/image";
import { Loader2, Plus, Image as ImageIcon, Trash2, Music, GripVertical, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import YoutubeSearch from "@/components/dearly/YoutubeSearch";
import { cn } from "@/lib/utils";

export type PhotoItem = {
  id?: string;
  file?: File;
  preview: string;
  caption: string;
};

export type LetterData = {
  id?: string;
  recipient_name?: string;
  sender_name?: string;
  title?: string;
  content?: string;
  interactive_type?: string;
  bgm_url?: string;
  interactive_data?: Record<string, string>;
  whatsapp_number?: string;
  photos?: { id: string; image_url: string; caption?: string }[];
};

export type ActionState = {
  success?: boolean;
  error?: string;
  data?: string;
} | null;

type LetterFormProps = {
  initialData?: LetterData;
  formAction: (payload: FormData) => void;
  state: ActionState;
  isPending: boolean;
};

const STEPS = [
  { id: 1, title: "Identitas", subtitle: "Untuk siapa surat ini?" },
  { id: 2, title: "Estetika", subtitle: "Tema visual & Musik" },
  { id: 3, title: "Pesan", subtitle: "Surat hati ke hati" },
  { id: 4, title: "Memori", subtitle: "Galeri polaroid" },
  { id: 5, title: "Kejutan", subtitle: "Gembok & Interaksi" }
];

export default function LetterForm({ initialData, formAction, state, isPending }: LetterFormProps) {
  // Stepper State
  const [currentStep, setCurrentStep] = useState(1);

  // Setup initial photos
  const initialPhotos: PhotoItem[] = initialData?.photos?.map((p: { id: string; image_url: string; caption?: string }) => ({
    id: p.id,
    preview: p.image_url,
    caption: p.caption || "",
  })) || [];

  const [photos, setPhotos] = useState<PhotoItem[]>(initialPhotos);
  const [interactiveType, setInteractiveType] = useState(initialData?.interactive_type || 'none');
  const [bgmUrl, setBgmUrl] = useState(initialData?.bgm_url || "");
  const [theme, setTheme] = useState(initialData?.interactive_data?.theme || "default");
  
  // Basic Fields State (to keep controlled so they don't wipe out on re-renders across steps)
  const [recipientName, setRecipientName] = useState(initialData?.recipient_name || "");
  const [senderName, setSenderName] = useState(initialData?.sender_name || "");
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Drag and Drop State
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);

    const newPhotos = [...photos];
    for (const file of files) {
      if (newPhotos.length >= 5) {
        alert("Maksimal 5 foto polaroid!");
        break;
      }
      try {
        const compressed = await compressImage(file, 1080);
        newPhotos.push({
          file: compressed,
          preview: URL.createObjectURL(compressed),
          caption: "",
        });
      } catch (err) {
        console.error("Compression failed:", err);
      }
    }
    setPhotos(newPhotos);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const updateCaption = (index: number, text: string) => {
    const updated = [...photos];
    updated[index].caption = text;
    setPhotos(updated);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = "move";
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.classList.add("opacity-50");
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedIdx(null);
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.classList.remove("opacity-50");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); 
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === dropIndex) return;

    const newPhotos = [...photos];
    const draggedItem = newPhotos[draggedIdx];
    
    newPhotos.splice(draggedIdx, 1);
    newPhotos.splice(dropIndex, 0, draggedItem);
    
    setPhotos(newPhotos);
    setDraggedIdx(null);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // We must manually append controlled state because they might not be rendered in DOM at Step 5
    formData.set("recipientName", recipientName);
    formData.set("senderName", senderName);
    formData.set("title", title);
    formData.set("content", content);
    formData.set("bgmUrl", bgmUrl);
    formData.set("interactiveData.theme", theme);

    photos.forEach((photo) => {
      if (photo.file) {
        formData.append("newPhotos", photo.file);
      }
      if (photo.id) {
        formData.append("existingPhotoIds", photo.id); 
      }
      formData.append("photoCaptions", photo.caption); 
      formData.append("photoSource", photo.file ? "new" : "existing");
    });

    formAction(formData);
  };

  const handleNext = () => {
    // Basic validation per step
    if (currentStep === 1) {
      if (!recipientName.trim() || !senderName.trim()) {
        alert("Mohon isi Nama Penerima dan Nama Anda.");
        return;
      }
    }
    if (currentStep === 3) {
      if (!title.trim() || !content.trim()) {
        alert("Mohon isi Judul dan Isi Pesan.");
        return;
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Dynamic Theme Styles for Step 3 (Textarea)
  const getTextareaThemeClasses = () => {
    switch(theme) {
      case 'dark_romance': 
        return "bg-zinc-900 text-rose-50 border-zinc-700 shadow-rose-900/20 placeholder:text-zinc-500/50";
      case 'vintage': 
        return "bg-[#f4ebd8] text-[#5c4033] border-[#d4c5b3] placeholder:text-[#5c4033]/40 bg-[url('https://www.transparenttextures.com/patterns/rice-paper-2.png')]";
      case 'pastel': 
        return "bg-gradient-to-br from-pink-50 to-blue-50 text-slate-700 border-pink-200 placeholder:text-slate-400";
      default: 
        return "bg-white text-foreground border-border/60 placeholder:text-muted-foreground/50";
    }
  };

  const THEME_OPTIONS = [
    {
      id: 'default',
      name: 'Aesthetic (Default)',
      desc: 'Bersih, putih, minimalis',
      visual: (
        <div className="w-full h-24 rounded-xl mb-3 bg-[#fdfbf7] p-2 flex items-center justify-center border border-border/50 overflow-hidden relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(240,170,170,0.1)_0%,_transparent_50%)]" />
          <div className="relative w-3/4 h-3/4 bg-white shadow-sm border border-[#f0f0f0] rounded-sm transform rotate-[-2deg] flex flex-col gap-1.5 p-2.5">
            <div className="w-1/2 h-1.5 bg-muted/80 rounded-full" />
            <div className="w-full h-1 bg-muted/40 rounded-full" />
            <div className="w-3/4 h-1 bg-muted/40 rounded-full" />
          </div>
        </div>
      )
    },
    {
      id: 'dark_romance',
      name: 'Dark Romance',
      desc: 'Kelam, elegan, mawar merah',
      visual: (
        <div className="w-full h-24 rounded-xl mb-3 bg-zinc-950 p-2 flex items-center justify-center border border-zinc-800 overflow-hidden relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(225,29,72,0.1)_0%,_transparent_50%)]" />
          <div className="relative w-3/4 h-3/4 bg-zinc-900 shadow-md border border-zinc-800 rounded-sm transform rotate-[-2deg] flex flex-col gap-1.5 p-2.5">
            <div className="w-1/2 h-1.5 bg-rose-900/80 rounded-full" />
            <div className="w-full h-1 bg-zinc-700 rounded-full" />
            <div className="w-3/4 h-1 bg-zinc-700 rounded-full" />
          </div>
        </div>
      )
    },
    {
      id: 'vintage',
      name: 'Vintage Letter',
      desc: 'Kertas usang, klasik, sepia',
      visual: (
        <div className="w-full h-24 rounded-xl mb-3 bg-[#e6d5c3] p-2 flex items-center justify-center border border-[#d4c5b3] overflow-hidden relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(92,64,51,0.05)_0%,_transparent_50%)]" />
          <div className="relative w-3/4 h-3/4 bg-[#f4ebd8] shadow-md border border-[#d4c5b3] rounded-sm transform rotate-[-2deg] flex flex-col gap-1.5 p-2.5 bg-[url('https://www.transparenttextures.com/patterns/rice-paper-2.png')]">
            <div className="w-1/2 h-1.5 bg-[#5c4033]/60 rounded-full" />
            <div className="w-full h-1 bg-[#5c4033]/30 rounded-full" />
            <div className="w-3/4 h-1 bg-[#5c4033]/30 rounded-full" />
          </div>
        </div>
      )
    },
    {
      id: 'pastel',
      name: 'Soft Pastel',
      desc: 'Warna-warni lembut nan ceria',
      visual: (
        <div className="w-full h-24 rounded-xl mb-3 bg-gradient-to-br from-pink-100 to-blue-100 p-2 flex items-center justify-center border border-white/50 overflow-hidden relative">
          <div className="relative w-3/4 h-3/4 bg-white/60 backdrop-blur-sm shadow-sm border border-white/40 rounded-sm transform rotate-[-2deg] flex flex-col gap-1.5 p-2.5">
            <div className="w-1/2 h-1.5 bg-slate-400/80 rounded-full" />
            <div className="w-full h-1 bg-slate-300/60 rounded-full" />
            <div className="w-3/4 h-1 bg-slate-300/60 rounded-full" />
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="w-full">
      {/* Stepper Header Premium Design */}
      <div className="mb-10 w-full">
        {/* Segmented Progress Bar */}
        <div className="flex gap-2 mb-6">
          {STEPS.map((step) => {
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            return (
              <div key={step.id} className="flex-1 h-2.5 rounded-full bg-muted/50 overflow-hidden relative">
                <div 
                  className={cn(
                    "absolute top-0 left-0 h-full transition-all duration-700 ease-out rounded-full",
                    isCompleted ? "bg-primary w-full" : 
                    isActive ? "bg-primary w-1/2" : "bg-transparent w-0"
                  )} 
                />
              </div>
            );
          })}
        </div>

        {/* Step Info */}
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider">
              Langkah {currentStep} dari {STEPS.length}
            </p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
              {STEPS[currentStep - 1].title}
            </h2>
            <p className="text-muted-foreground">
              {STEPS[currentStep - 1].subtitle}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {state?.success === false && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-sm font-medium">
            {state.error}
          </div>
        )}

        {/* STEP 1: IDENTITAS */}
        {currentStep === 1 && (
          <div className="bg-white p-8 rounded-3xl border border-border/60 shadow-sm space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
            <div>
              <h3 className="font-heading text-2xl font-bold text-foreground">Identitas</h3>
              <p className="text-muted-foreground text-sm mt-1">Untuk siapa kejutan manis ini dibuat?</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Nama Penerima</label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={e => setRecipientName(e.target.value)}
                  placeholder="misal: Amanda"
                  className="w-full h-14 px-4 rounded-xl border border-border/60 bg-muted/10 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-lg"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Nama Anda (Pengirim)</label>
                <input
                  type="text"
                  value={senderName}
                  onChange={e => setSenderName(e.target.value)}
                  placeholder="misal: Budi"
                  className="w-full h-14 px-4 rounded-xl border border-border/60 bg-muted/10 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-lg"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: ESTETIKA (Tema & Musik) */}
        {currentStep === 2 && (
          <div className="bg-white p-8 rounded-3xl border border-border/60 shadow-sm space-y-8 animate-in slide-in-from-right-4 fade-in duration-300">
            <div>
              <h3 className="font-heading text-2xl font-bold text-foreground">Estetika Visual & Audio</h3>
              <p className="text-muted-foreground text-sm mt-1">Pilih nuansa yang paling cocok dengan perasaanmu.</p>
            </div>
            
            <div className="space-y-4 pt-4">
              <label className="text-sm font-medium text-foreground block">Tema Visual Surat</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {THEME_OPTIONS.map(t => (
                  <div 
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`p-4 border-2 rounded-2xl cursor-pointer transition-all ${theme === t.id ? 'border-primary bg-primary/5 shadow-md scale-[1.02]' : 'border-border/60 hover:border-primary/40 hover:bg-muted/10'}`}
                  >
                    {t.visual}
                    <div className="font-semibold text-foreground mb-1 text-center">{t.name}</div>
                    <div className="text-xs text-muted-foreground text-center">{t.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-border/40">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Music size={18} className="text-primary" />
                Lagu Latar Belakang (Youtube)
              </label>
              <YoutubeSearch onSelect={(url) => setBgmUrl(url)} initialUrl={bgmUrl} />
            </div>
          </div>
        )}

        {/* STEP 3: PESAN (WYSIWYG-lite) */}
        {currentStep === 3 && (
          <div className="bg-white p-8 rounded-3xl border border-border/60 shadow-sm space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
            <div>
              <h3 className="font-heading text-2xl font-bold text-foreground">Surat Hati ke Hati</h3>
              <p className="text-muted-foreground text-sm mt-1">Tuliskan pesanmu. Tampilan kertas di bawah ini akan menyesuaikan dengan tema pilihanmu ({theme}).</p>
            </div>
            
            <div className={cn("p-6 md:p-8 rounded-2xl border transition-all duration-500 shadow-inner flex flex-col gap-4", getTextareaThemeClasses())}>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Judul: Happy Anniversary ke-3 sayangku!"
                className="w-full bg-transparent border-b border-current/20 pb-4 text-2xl md:text-3xl font-heading font-bold focus:outline-none focus:border-current/50 transition-colors placeholder:font-normal"
              />
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Tuliskan pesan yang panjang dan bermakna di sini..."
                rows={12}
                className="w-full bg-transparent focus:outline-none resize-y text-lg leading-relaxed placeholder:font-normal"
              />
            </div>
          </div>
        )}

        {/* STEP 4: GALERI MEMORI */}
        {currentStep === 4 && (
          <div className="bg-white p-8 rounded-3xl border border-border/60 shadow-sm space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h3 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2">
                  <ImageIcon size={24} className="text-primary" />
                  Galeri Polaroid
                </h3>
                <p className="text-muted-foreground text-sm mt-1">Unggah foto-foto kenangan kalian (Maks. 5)</p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-full h-10 border-primary/30 hover:bg-primary/10 text-primary"
                disabled={photos.length >= 5}
              >
                <Plus size={18} className="mr-2" /> Tambah Foto
              </Button>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                ref={fileInputRef}
                className="hidden"
                onChange={handlePhotoSelect}
              />
            </div>

            {photos.length === 0 ? (
              <div className="h-48 border-2 border-dashed border-border/60 rounded-2xl flex flex-col items-center justify-center bg-muted/5 text-muted-foreground cursor-pointer hover:bg-muted/20 transition-all" onClick={() => fileInputRef.current?.click()}>
                <ImageIcon size={32} className="mb-3 opacity-50" />
                <p className="text-sm font-medium">Belum ada foto yang diunggah.</p>
                <p className="text-xs mt-1">Klik untuk memilih file.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3 pt-4">
                {photos.map((photo, idx) => (
                  <div 
                    key={photo.id || photo.preview} 
                    draggable
                    onDragStart={(e) => handleDragStart(e, idx)}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, idx)}
                    className="relative group bg-white border border-border/60 p-3 sm:p-4 rounded-2xl shadow-sm flex gap-4 items-center transition-all hover:shadow-md cursor-grab active:cursor-grabbing hover:border-primary/30"
                  >
                    <div className="text-muted-foreground/30 group-hover:text-primary/50 transition-colors cursor-grab">
                      <GripVertical size={24} />
                    </div>
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden flex-shrink-0 relative bg-muted/20 shadow-sm border border-border/50">
                      <Image src={photo.preview} alt={`Preview ${idx}`} fill className="object-cover" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <input
                        type="text"
                        placeholder="Tulis pesan rahasia di balik foto..."
                        value={photo.caption}
                        onChange={(e) => updateCaption(idx, e.target.value)}
                        className="w-full text-sm sm:text-base border-b border-border/60 bg-transparent focus:outline-none focus:border-primary pb-1"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(idx)}
                        className="text-xs text-destructive flex items-center hover:bg-destructive/10 px-2 py-1 rounded-md transition-colors"
                      >
                        <Trash2 size={12} className="mr-1" /> Hapus Foto
                      </button>
                    </div>
                  </div>
                ))}
                <p className="text-xs text-muted-foreground mt-4 text-center bg-muted/30 py-2 rounded-lg">Tahan dan geser (drag & drop) ikon titik-titik untuk mengubah urutan foto polaroid.</p>
              </div>
            )}
          </div>
        )}

        {/* STEP 5: INTERAKSI */}
        {currentStep === 5 && (
          <div className="bg-white p-8 rounded-3xl border border-border/60 shadow-sm space-y-8 animate-in slide-in-from-right-4 fade-in duration-300">
            <div>
              <h3 className="font-heading text-2xl font-bold text-foreground">Kejutan & Interaksi</h3>
              <p className="text-muted-foreground text-sm mt-1">Tambahkan elemen interaktif sebelum ia bisa membaca isi surat seutuhnya.</p>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Tipe Gembok / Interaksi (Opsional)</label>
                <select
                  name="interactiveType"
                  value={interactiveType}
                  onChange={(e) => setInteractiveType(e.target.value)}
                  className="w-full h-14 px-4 rounded-xl border border-border/60 bg-muted/10 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none text-base"
                >
                  <option value="none">Tidak Ada (Langsung Terbuka)</option>
                  <option value="password_lock">Gembok Password Rahasia</option>
                  <option value="runaway_button">&quot;Maafkan Aku&quot; / &quot;Mau Balikan?&quot; (Tombol menghindar)</option>
                  <option value="date_options">Pilihan Kencan (Pilih lokasi)</option>
                </select>
              </div>

              {interactiveType === 'password_lock' && (
                <div className="space-y-4 p-6 bg-amber-50/50 rounded-2xl border border-amber-200/50 animate-in zoom-in-95 duration-200">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-amber-900">Pertanyaan Kunci</label>
                    <input
                      type="text"
                      name="interactiveData.question"
                      defaultValue={initialData?.interactive_data?.question}
                      placeholder="Kapan tanggal jadian kita? (DDMMYYYY)"
                      className="w-full h-12 px-4 rounded-xl border border-amber-200/60 focus:border-amber-400 transition-all text-sm bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-amber-900">Password Rahasia</label>
                    <input
                      type="text"
                      name="interactiveData.password"
                      defaultValue={initialData?.interactive_data?.password}
                      placeholder="14022023"
                      className="w-full h-12 px-4 rounded-xl border border-amber-200/60 focus:border-amber-400 transition-all text-sm bg-white"
                    />
                    <p className="text-xs text-amber-700/60">Tidak membedakan huruf besar/kecil (case insensitive).</p>
                  </div>
                </div>
              )}

              {interactiveType === 'runaway_button' && (
                <div className="space-y-4 p-6 bg-rose-50/50 rounded-2xl border border-rose-200/50 animate-in zoom-in-95 duration-200">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-rose-900">Pertanyaan Kuis</label>
                    <input
                      type="text"
                      name="interactiveData.question"
                      defaultValue={initialData?.interactive_data?.question}
                      placeholder="Maukah kamu maafin aku?"
                      className="w-full h-12 px-4 rounded-xl border border-rose-200/60 focus:border-rose-400 transition-all text-sm bg-white"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="space-y-2 flex-1">
                      <label className="text-sm font-semibold text-rose-900">Tombol &apos;Ya&apos; (Diterima)</label>
                      <input
                        type="text"
                        name="interactiveData.yesLabel"
                        defaultValue={initialData?.interactive_data?.yesLabel || "Tentu Saja!"}
                        className="w-full h-12 px-4 rounded-xl border border-rose-200/60 focus:border-rose-400 transition-all text-sm bg-white"
                      />
                    </div>
                    <div className="space-y-2 flex-1">
                      <label className="text-sm font-semibold text-rose-900">Tombol &apos;Tidak&apos; (Menghindar)</label>
                      <input
                        type="text"
                        name="interactiveData.noLabel"
                        defaultValue={initialData?.interactive_data?.noLabel || "Nggak Mau"}
                        className="w-full h-12 px-4 rounded-xl border border-rose-200/60 focus:border-rose-400 transition-all text-sm bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {interactiveType === 'date_options' && (
                <div className="space-y-4 p-6 bg-blue-50/50 rounded-2xl border border-blue-200/50 animate-in zoom-in-95 duration-200">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-blue-900">Pertanyaan Ajakan</label>
                    <input
                      type="text"
                      name="interactiveData.question"
                      defaultValue={initialData?.interactive_data?.question}
                      placeholder="Minggu ini kita date kemana?"
                      className="w-full h-12 px-4 rounded-xl border border-blue-200/60 focus:border-blue-400 transition-all text-sm bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-blue-900">Opsi Kencan (Pisahkan dengan koma)</label>
                    <input
                      type="text"
                      name="interactiveData.options"
                      defaultValue={initialData?.interactive_data?.options}
                      placeholder="Nonton Bioskop, Cafe Hopping, Piknik di Taman"
                      className="w-full h-12 px-4 rounded-xl border border-blue-200/60 focus:border-blue-400 transition-all text-sm bg-white"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2 pt-6 border-t border-border/30">
                <label className="text-sm font-medium text-foreground">Integrasi WhatsApp (Opsional)</label>
                <input
                  type="tel"
                  name="whatsappNumber"
                  defaultValue={initialData?.whatsapp_number}
                  placeholder="6281234567890 (Kode negara tanpa +)"
                  className="w-full h-12 px-4 rounded-xl border border-border/60 bg-muted/10 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
                <p className="text-xs text-muted-foreground mt-1">Jika diisi, jawaban dari interaksi (contoh: jawaban kencan) akan langsung diarahkan ke nomor WA ini.</p>
              </div>
            </div>
          </div>
        )}

        {/* Stepper Navigation */}
        <div className="flex justify-between items-center pt-8">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="h-12 px-6 rounded-full text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft size={20} className="mr-1" /> Kembali
          </Button>

          {currentStep < STEPS.length ? (
            <Button 
              type="button" 
              onClick={handleNext}
              className="h-12 px-8 rounded-full shadow-md hover:shadow-lg transition-all"
            >
              Lanjut <ChevronRight size={20} className="ml-1" />
            </Button>
          ) : (
            <Button 
              type="submit" 
              disabled={isPending} 
              className="h-14 px-10 rounded-full text-lg shadow-xl shadow-primary/20 hover:scale-105 hover:shadow-primary/30 font-bold transition-all bg-primary"
            >
              {isPending ? (
                <>
                  <Loader2 size={20} className="mr-2 animate-spin" /> Menyimpan...
                </>
              ) : (
                initialData ? "Simpan Perubahan" : "Selesai & Buat Surat 🎉"
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
