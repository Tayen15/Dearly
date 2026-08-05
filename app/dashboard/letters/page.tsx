import { getUserLetters } from "@/app/actions";
import { Mail } from "lucide-react";
import LettersView from "@/components/dearly/LettersView";

export default async function LettersPage() {
  const letters = await getUserLetters();

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Mail className="text-primary" size={24} />
        </div>
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground font-heading">My Letters</h2>
          <p className="text-muted-foreground mt-1">Kelola dan lihat semua surat yang telah Anda buat.</p>
        </div>
      </div>

      <LettersView letters={letters} />
    </div>
  );
}
