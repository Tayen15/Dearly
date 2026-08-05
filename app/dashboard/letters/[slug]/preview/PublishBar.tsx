"use client";

import { useState } from "react";
import { publishLetter } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Loader2, Rocket } from "lucide-react";

export default function PublishBar({ slug }: { slug: string }) {
  const [isPublishing, setIsPublishing] = useState(false);
  const router = useRouter();

  const handlePublish = async () => {
    setIsPublishing(true);
    const res = await publishLetter(slug);
    if (res.success) {
      router.push("/dashboard");
    } else {
      alert("Gagal mempublikasikan surat: " + res.error);
      setIsPublishing(false);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border/60 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] p-4 z-50">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-heading font-semibold text-lg">Pratinjau Surat</h4>
          <p className="text-sm text-muted-foreground">Ini adalah tampilan surat Anda. Klik Publish agar surat dapat diakses publik.</p>
        </div>
        <Button onClick={handlePublish} disabled={isPublishing} className="rounded-full h-12 px-8 w-full sm:w-auto shadow-md">
          {isPublishing ? (
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            <Rocket className="w-5 h-5 mr-2" />
          )}
          {isPublishing ? "Publishing..." : "Publish Surat"}
        </Button>
      </div>
    </div>
  );
}
