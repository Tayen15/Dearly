# Product Requirements Document (PRD): Dearly

## 1. Project Overview
- **Product Name:** Dearly
- **Product Vision:** Platform pembuat surat & hadiah digital interaktif otomatis (Web Generator / Micro-SaaS) yang reusable, scalable, estetik, dan siap diperjualbelikan (monetizable).
- **Core Positioning:** Alternatif modern & interaktif untuk kartu ucapan/undangan digital fisik yang dikhususkan untuk momen romantis, ulang tahun, perayaan hubungan (anniversary/girlfriend day), hingga surat permintaan maaf (apology letter).

## 2. Target Audience
- Gen Z & Milenial Muda (Usia 15–27 tahun).
- Menyukai estetika minimalis, kepraktisan, dan pengalaman visual interaktif tanpa harus koding dari nol.

## 3. User Journey Flow

### A. Creator / Buyer Flow
1. **Landing Page:** Pengunjung masuk ke `dearly.id`, melihat showcase demo, fitur, dan pilihan harga.
2. **Template Selection:** Memilih tema (default V1: Soft Aesthetic).
3. **Form Editor (Data Input):** Mengisi konten surat, mengunggah media, memilih musik, dan menyetel fitur interaktif.
4. **Live Preview:** Melihat tampilan *real-time* surat dalam bentuk mockup sebelum membayar.
5. **Checkout & Payment:** Transaksi otomatis via QRIS / E-Wallet.
6. **Link Generation:** Sistem membuat URL unik/slug aktif (contoh: `dearly.id/to/sarah-2026`).

### B. Recipient Flow
1. **Open Link:** Akses URL unik dari pengirim.
2. **Interactive Unboxing:** Tampilan awal berupa amplop bersegel/pita yang harus diklik (memicu efek BGM play & confetti/bunga).
3. **Typewriter Letter:** Surat utama muncul perlahan ketik demi ketik disertai musik latar.
4. **Memories Gallery:** Galeri foto Polaroid interaktif dengan catatan dibaliknya.
5. **Interactive Games/Modals:** Pertanyaan/kuis jahil (misal: tombol "Diterima/Ditolak" atau pilihan lokasi kencan).
6. **Closing & Action:** Pesan penutup + tombol opsi balasan ("Kirim Balasan / Peluk").

## 4. Business Model & Pricing Strategy
1. **Freemium / Tiered Model:**
   - **Basic Tier:** Teks terbatas, maksimal 3 foto, watermark Dearly, batas aktif 7 hari.
   - **Premium Tier (Core Product):** Foto & teks tanpa batas, custom slug, custom BGM, tanpa watermark, aktif selamanya/1 tahun, opsi PIN & fitur interaktif.
2. **Add-ons:** Fitur mini-games khusus atau pembuatan desain custom eksklusif.

## 5. Technical Roadmap Outline
- **Phase 1 (MVP Engine):** Pembuatan komponen UI dasar Soft Aesthetic (Envelope Unboxing, Typewriter Letter, Polaroid Gallery) berbasis data JSON statis.
- **Phase 2 (Form & Routing):** Pengembangan Sistem Dynamic Routing (`/to/[slug]`) dan Form Builder untuk input data kustomer.
- **Phase 3 (SaaS Integration):** Integrasi Database, Cloud Storage (Media Upload), Dashboard Admin/Preview, dan Payment Gateway (QRIS).
