import { z } from "zod";

export const letterSchema = z.object({
  recipientName: z.string().min(1, "Nama penerima tidak boleh kosong").max(50, "Nama terlalu panjang"),
  senderName: z.string().min(1, "Nama pengirim tidak boleh kosong").max(50, "Nama terlalu panjang"),
  title: z.string().min(1, "Judul surat tidak boleh kosong").max(100, "Judul terlalu panjang"),
  content: z.string().min(10, "Isi surat terlalu singkat (minimal 10 karakter)"),
  bgmUrl: z.string().url("Format URL tidak valid").optional().or(z.literal("")),
  isPublic: z.boolean().default(true),
  interactiveType: z.enum(['none', 'runaway_button', 'date_options']).default('none'),
  interactiveData: z.any().optional(),
  whatsappNumber: z.string().optional().or(z.literal("")),
});

export type LetterInput = z.infer<typeof letterSchema>;
