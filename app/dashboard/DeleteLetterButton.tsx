"use client";

import { useState } from "react";
import { deleteLetter } from "@/app/actions";
import { Trash2, Loader2 } from "lucide-react";

export default function DeleteLetterButton({ slug }: { slug: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirm("Apakah Anda yakin ingin menghapus surat ini?")) {
      setIsDeleting(true);
      const res = await deleteLetter(slug);
      if (!res.success) {
        alert("Gagal menghapus surat: " + res.error);
        setIsDeleting(false);
      }
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-muted-foreground hover:text-destructive transition-colors p-1 disabled:opacity-50"
      title="Delete Letter"
    >
      {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
    </button>
  );
}
