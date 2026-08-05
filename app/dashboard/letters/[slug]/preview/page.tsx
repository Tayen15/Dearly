import { notFound } from "next/navigation";
import { getLetterBySlug } from "@/app/actions";
import EnvelopeUnboxing from "@/components/dearly/EnvelopeUnboxing";
import TypewriterLetter from "@/components/dearly/TypewriterLetter";
import PolaroidGallery from "@/components/dearly/PolaroidGallery";
import InteractiveGames from "@/components/dearly/InteractiveGames";
import YoutubeAudioPlayer from "@/components/dearly/YoutubeAudioPlayer";
import PublishBar from "./PublishBar";

export default async function PreviewLetterPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  
  const letter = await getLetterBySlug(resolvedParams.slug);

  if (!letter) {
    notFound();
  }

  const formattedPhotos = letter.photos.map((p: { id: string, image_url: string, caption?: string }) => ({
    id: p.id,
    imageUrl: p.image_url,
    caption: p.caption || "A beautiful memory"
  }));

  return (
    <>
      <div className="relative min-h-screen bg-[#fdfbf7] overflow-hidden selection:bg-primary/20 pb-24">
        {letter.bgm_url && (
          <YoutubeAudioPlayer url={letter.bgm_url} playing={true} />
        )}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(240,170,170,0.1)_0%,_transparent_50%)]" />
        </div>
        <main className="relative z-10 w-full max-w-4xl mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-screen">
          <EnvelopeUnboxing 
            recipientName={letter.recipient_name}
            senderName={letter.sender_name}
          >
            <div className="w-full flex flex-col items-center gap-16 py-10">
              <div className="w-full max-w-2xl bg-white shadow-xl rounded-sm p-8 md:p-12 transform rotate-[-1deg] border border-[#f0f0f0] bg-[url('https://www.transparenttextures.com/patterns/rice-paper-2.png')]">
                <TypewriterLetter 
                  title={letter.title}
                  content={letter.content}
                />
              </div>
              {formattedPhotos.length > 0 && (
                <div className="w-full mt-10">
                  <PolaroidGallery photos={formattedPhotos} />
                </div>
              )}
              
              {/* Interactive Games & Action */}
              <InteractiveGames letter={letter} />
            </div>
          </EnvelopeUnboxing>
        </main>
      </div>
      <PublishBar slug={letter.slug} />
    </>
  );
}
