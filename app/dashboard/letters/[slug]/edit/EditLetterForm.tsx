"use client";

import { useActionState, useEffect } from "react";
import { updateLetterAction } from "@/app/actions";
import { useRouter } from "next/navigation";
import LetterForm, { LetterData } from "@/components/dearly/LetterForm";

export default function EditLetterForm({ letter, slug }: { letter: LetterData; slug: string }) {
  // Bind the slug to the update action
  const updateWithSlug = updateLetterAction.bind(null, slug);
  const [state, formAction, isPending] = useActionState(updateWithSlug, null);
  const router = useRouter();

  useEffect(() => {
    if (state && state.success) {
      router.push(`/dashboard/letters/${state.data}/preview`);
    }
  }, [state, router]);

  return (
    <LetterForm 
      initialData={letter}
      formAction={formAction} 
      state={state} 
      isPending={isPending} 
    />
  );
}
