"use client";

import { useActionState, useEffect } from "react";
import { createLetterAction } from "@/app/actions";
import { useRouter } from "next/navigation";
import LetterForm from "@/components/dearly/LetterForm";

export default function NewLetterPage() {
  const [state, formAction, isPending] = useActionState(createLetterAction, null);
  const router = useRouter();

  useEffect(() => {
    if (state && state.success) {
      router.push(`/dashboard/letters/${state.data}/preview`);
    }
  }, [state, router]);

  return (
    <div className="max-w-3xl mx-auto pb-20">
      <div className="mb-8">
        <h2 className="text-3xl font-bold font-heading text-foreground">Buat Surat Baru</h2>
        <p className="text-muted-foreground mt-2">Isi detail di bawah ini untuk menciptakan kejutan manis bagi si dia.</p>
      </div>

      <LetterForm 
        formAction={formAction} 
        state={state} 
        isPending={isPending} 
      />
    </div>
  );
}
