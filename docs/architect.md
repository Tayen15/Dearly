# Architecture Decisions: Dearly

## 1. Core Stack
- **Framework:** Next.js (App Router MANDATORY).
- **Language:** TypeScript (Strict mode enabled).
- **Styling:** Tailwind CSS.
- **UI Library:** shadcn/ui.

## 2. Rendering Strategy (App Router)
- **Server Components (Default):** Digunakan untuk fetching data dari database (Fase 3), SEO (metadata dinamis per *slug*), dan layouting statis.
- **Client Components (`'use client'`):** Digunakan pada level *leaf/komponen ujung* yang membutuhkan interaktivitas browser, state management, dan hooks (seperti `useState`, `useEffect`). Contoh: `EnvelopeUnboxing`, `TypewriterLetter`, `PolaroidGallery`.

## 3. Database & Authentication (Supabase)
Karena proyek dirancang se-*advance* mungkin dari awal, kita menggunakan **Supabase**:
- **Authentication**: `@supabase/ssr` untuk mengelola login pengguna (Creator). Halaman `/dashboard` dilindungi (*protected route*).
- **Database (PostgreSQL)**: Menyimpan entitas `users`, `letters` (surat), dan `media` (galeri).
  - Row Level Security (RLS) diaktifkan pada semua tabel.
  - Data akses via Supabase Server Client.
- **Storage**: Digunakan untuk menyimpan aset media (BGM, foto galeri polaroid, gambar background).

## 4. State Management & Data Flow
- **Data Fetching**: Dikelola secara native oleh Next.js React Server Components (`await supabase.from(...)`) tanpa pustaka eksternal pihak ketiga tambahan.
- **Client State**: Menggunakan React Hooks standar (`useState`, `useContext`) di *Client Components* (seperti `EnvelopeUnboxing`, `PolaroidGallery`) yang diisolasi se-kecil mungkin di ujung *tree*.
- **Data Mutations**: Semua operasi tulis (CRUD pada *letters*) menggunakan **Server Actions** (`app/actions.ts` atau `app/[feature]/actions.ts`) yang mereturn tipe standar `ActionResponse<T>`.

## 5. Security & Input Validation
- **Zod Schemas**: Semua input dari pengguna (form pembuatan surat, parameter URL) divalidasi menggunakan Zod (`/lib/schemas/`).
- Akses ke data dibatasi ketat dengan RLS di Supabase, di mana pembeli (Creator) hanya dapat mengubah surat milik mereka sendiri.
- URL slug surat bersifat publik (`isPrivate: false`) atau dilindungi PIN (`isPrivate: true`) berdasarkan data di database.
