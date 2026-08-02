# Technical Specifications: Dearly (Phase 1)

## 1. Environment & Tools
- **Node.js**: v18+
- **Package Manager**: npm / pnpm / bun (disarankan standar npm atau pnpm).
- **Linter & Formatter**: ESLint + Prettier dengan integrasi Tailwind.

## 2. External Libraries
- `framer-motion`: Digunakan untuk animasi *page transitions*, animasi amplop terbuka, dan interaksi *flip* polaroid.
- `canvas-confetti`: Digunakan secara imperatif saat *event click* pada tombol unboxing.
- `lucide-react`: Ikon standar, minimalis, dan ringan.
- `react-type-animation`: Untuk merender *typewriter effect* secara responsif.

## 3. Folder Structure (Next.js App Router)
```text
/
├── app/
│   ├── layout.tsx         # Global layout & font definitions
│   ├── page.tsx           # Demo page (Phase 1)
│   └── globals.css        # Tailwind directives & CSS variables
├── components/
│   ├── ui/                # shadcn/ui components
│   └── dearly/            # Specific Dearly components
│       ├── EnvelopeUnboxing.tsx
│       ├── TypewriterLetter.tsx
│       └── PolaroidGallery.tsx
├── lib/
│   ├── utils.ts           # Utility functions (cn from shadcn, dll)
│   └── mockData.ts        # Static JSON data for Phase 1
├── docs/                  # Documentation
└── public/                # Static assets (fonts, dummy audio, images)
```

## 4. Component Technical Details

### EnvelopeUnboxing.tsx
- Menerima props: `onUnbox` (callback function).
- Memiliki internal state untuk mengatur animasi penutup amplop.
- Saat diklik, memanggil `confetti()`, memulai audio via Web Audio API (jika dizinkan browser), dan mengeksekusi `onUnbox`.

### TypewriterLetter.tsx
- Menerima props: `text` (string).
- Menggunakan `react-type-animation` dengan durasi dan jeda yang disesuaikan untuk meniru kecepatan mengetik asli.

### PolaroidGallery.tsx
- Menerima props: `images` (array of objects).
- Diimplementasikan dengan *CSS Grid / Flexbox* dengan rotasi (*transform: rotate*) acak kecil (misal: -3deg hingga 3deg) agar terlihat organik.
- Fitur *Flip* menggunakan `framer-motion` (mengubah orientasi 3D sumbu Y).
