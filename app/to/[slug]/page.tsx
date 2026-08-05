import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { getLetterBySlug, incrementLetterViews } from "@/app/actions";
import EnvelopeUnboxing from "@/components/dearly/EnvelopeUnboxing";
import TypewriterLetter from "@/components/dearly/TypewriterLetter";
import PolaroidGallery from "@/components/dearly/PolaroidGallery";
import InteractiveGames from "@/components/dearly/InteractiveGames";
import DearlyWatermark from "@/components/dearly/DearlyWatermark";
import LetterWatermark from "@/components/dearly/LetterWatermark";
// Server Component (React 19 / Next.js 15)
export default async function DynamicLetterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;

  // Intercept 'demo' slug
  let letter;
  if (resolvedParams.slug === "demo") {
    letter = {
      id: "demo",
      slug: "demo",
      user_id: "system",
      recipient_name: "Kamu",
      sender_name: "Dearly Team",
      title: "Kejutan Kecil Untukmu",
      content:
        "Halo!\n\nIni adalah contoh surat interaktif dari Dearly. Bayangkan kamu bisa mengirim pesan seperti ini untuk orang tersayang di momen spesial mereka.\n\nDengan musik yang mengalun, foto-foto memori, dan kejutan kecil di dalamnya, ini jauh lebih bermakna daripada sekadar pesan teks biasa.\n\nBuat surat pertamamu sekarang juga. Gratis!",
      bgm_url: "https://www.youtube.com/watch?v=zYlP2W_dhr0",
      status: "published",
      interactive_type: "runaway_button",
      interactive_data: {
        theme: "pastel",
        question: "Kamu suka kejutannya?",
        yesLabel: "Suka banget!",
        noLabel: "Biasa aja",
      },
      photos: [
        {
          id: "1",
          image_url:
            "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500&q=80",
          caption: "Kejutan manis",
        },
        {
          id: "2",
          image_url:
            "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=500&q=80",
          caption: "Untuk momen berharga",
        },
      ],
    };
  } else {
    letter = await getLetterBySlug(resolvedParams.slug);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Hide if not found, or if it's a draft AND the current user is NOT the owner
  if (!letter || (letter.status === "draft" && letter.user_id !== user?.id)) {
    notFound();
  }

  // Increment views only for real letters (not demo)
  if (resolvedParams.slug !== "demo") {
    incrementLetterViews(resolvedParams.slug);
  }

  // Format photos for the gallery component
  const formattedPhotos = (letter.photos || []).map(
    (p: { id: string; image_url: string; caption?: string }) => ({
      id: p.id,
      imageUrl: p.image_url,
      caption: p.caption || "A beautiful memory",
    }),
  );

  const theme = letter.interactive_data?.theme || "default";
  
  // Define theme styles
  const themes: Record<string, { outer: string; inner: string; decoration: string }> = {
    default: {
      outer: "bg-[#fdfbf7] selection:bg-primary/20",
      inner: "bg-white text-foreground border-[#f0f0f0] shadow-xl",
      decoration: "bg-[radial-gradient(circle_at_50%_50%,_rgba(240,170,170,0.1)_0%,_transparent_50%)]",
    },
    dark_romance: {
      outer: "bg-zinc-950 selection:bg-rose-500/30",
      inner: "bg-zinc-900 text-rose-50 border-zinc-800 shadow-2xl shadow-rose-900/20",
      decoration: "bg-[radial-gradient(circle_at_50%_50%,_rgba(225,29,72,0.05)_0%,_transparent_50%)]",
    },
    vintage: {
      outer: "bg-[#e6d5c3] selection:bg-[#5c4033]/20",
      inner: "bg-[#f4ebd8] text-[#5c4033] border-[#d4c5b3] shadow-2xl shadow-[#5c4033]/10",
      decoration: "bg-[radial-gradient(circle_at_50%_50%,_rgba(92,64,51,0.05)_0%,_transparent_50%)]",
    },
    pastel: {
      outer: "bg-gradient-to-br from-pink-100 to-blue-100 selection:bg-white/50",
      inner: "bg-white/70 backdrop-blur-md text-slate-700 border-white/40 shadow-xl",
      decoration: "",
    }
  };

  const currentTheme = themes[theme] || themes.default;

  return (
    <div className={`relative min-h-screen overflow-hidden ${currentTheme.outer}`}>
      {/* Decorative Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <div className={`absolute top-0 left-0 w-full h-full ${currentTheme.decoration}`} />
      </div>

      <main className="relative z-10 w-full max-w-4xl mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-screen">
        <EnvelopeUnboxing
          recipientName={letter.recipient_name}
          senderName={letter.sender_name}
          bgmUrl={letter.bgm_url}
        >
          <div className="w-full flex flex-col items-center gap-16 py-10">
            {/* 1. The Letter Content */}
            <div className={`relative w-full max-w-2xl rounded-sm p-8 md:p-12 transform rotate-[-1deg] border bg-[url('https://www.transparenttextures.com/patterns/rice-paper-2.png')] ${currentTheme.inner}`}>
              <TypewriterLetter title={letter.title} content={letter.content} />
              <LetterWatermark />
            </div>

            {/* 2. The Photo Gallery */}
            {formattedPhotos.length > 0 && (
              <div className="w-full mt-10">
                <PolaroidGallery photos={formattedPhotos} />
              </div>
            )}

            {/* 3. Interactive Games & Action */}
            <InteractiveGames letter={letter} />
          </div>

          {/* 4. Footer Watermark (Branding) */}
          <DearlyWatermark />
        </EnvelopeUnboxing>
      </main>
    </div>
  );
}
