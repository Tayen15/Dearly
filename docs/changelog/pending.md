# Pending Changelog

Semua perubahan yang akan dilakukan harus dicatat di sini terlebih dahulu sebelum di-commit.
Format log:
`[HH:MM] - [FILE] - [CHANGE] - [WHY]`

---

## Log Entries

[00:04] - app/auth/actions.ts - [NEW] Buat Server Actions login dan signup menggunakan supabase auth dengan Email & Password - Implementasi auth mandiri (Email & Password)
[00:04] - app/auth/login/page.tsx - [MODIFY] Tambah form login/signup dengan state, nonaktifkan Google login - Update UI menyesuaikan keputusan fitur auth
[16:15] - app/actions.ts - [NEW] Tambah fungsi `getUserLetters` - Mengambil daftar surat milik user yang sedang login dari database
[16:15] - app/dashboard/page.tsx - [MODIFY] Hubungkan UI Dashboard ke data Supabase - Mengganti mock data dengan data surat riil (Phase 3 SaaS Integration)
[16:22] - supabase/schema.sql - [MODIFY] Tambah kolom `status` dan `views` - Mendukung fitur Live Preview dan pelacakan penayangan surat
[16:22] - app/actions.ts - [NEW] Tambah aksi `incrementLetterViews`, `publishLetter`, dan `deleteLetter` - Server actions pendukung fitur di Dashboard dan Public Page
[16:22] - app/dashboard/letters/[slug]/preview/page.tsx - [NEW] Halaman Live Preview - Memungkinkan kreator meninjau surat dan menekan tombol Publish
[16:22] - app/to/[slug]/page.tsx - [MODIFY] Block surat berstatus draft dan jalankan `incrementLetterViews` - Mencegah akses publik sebelum Publish dan mulai merekam jumlah penayangan
[16:29] - supabase/schema.sql - [MODIFY] Tambah kolom `interactive_type`, `interactive_data`, dan `whatsapp_number` - Mendukung fitur Interactive Games (Phase 4)
[16:29] - app/dashboard/letters/new/page.tsx - [MODIFY] Tambah formulir kuis interaktif dan WhatsApp - Memungkinkan kustomer mengatur fitur kuis jahil
[16:29] - components/dearly/InteractiveGames.tsx - [NEW] Komponen kuis jahil dan tombol WhatsApp - Menampilkan permainan interaktif pada surat (Runaway button, Date options)
[16:29] - app/to/[slug]/page.tsx - [MODIFY] Render komponen `InteractiveGames` - Menyelesaikan integrasi UI surat utuh
[12:44] - app/dashboard/settings/actions.ts - [MODIFY] Tambah tipe `ActionState` pada `updateProfile` - Memperbaiki error type 'any' dan ketidakcocokan return type
[12:44] - app/dashboard/settings/page.tsx - [MODIFY] Tambah tipe `ActionState` pada `initialState` - Memperbaiki error overload pada hook `useActionState`
[13:34] - components/dearly/DearlyWatermark.tsx - [NEW] Komponen Floating Pill Watermark - Implementasi branding Dearly pada surat publik
[13:34] - app/to/[slug]/page.tsx - [MODIFY] Render komponen `DearlyWatermark` - Menampilkan branding untuk viral loop marketing
[14:07] - components/dearly/LetterWatermark.tsx - [NEW] Komponen Watermark Anti-Tamper - Watermark tipis di dalam kertas surat yang dilindungi MutationObserver agar tidak bisa dihapus via Inspect Element
[14:13] - app/to/[slug]/page.tsx - [MODIFY] Mengembalikan `DearlyWatermark` - Menggunakan dua lapis watermark (footer statis dan anti-tamper di dalam kertas)
[14:53] - components/dearly/EnvelopeUnboxing.tsx - [MODIFY] Refactor Animasi Amplop - Menambahkan State pembukaan amplop bertahap (idle -> opening -> opened), animasi *flap* amplop atas terlipat, dan kertas simulasi surat yang meluncur ke atas sebelum keseluruhan amplop menghilang.
