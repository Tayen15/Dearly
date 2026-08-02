# Design Specifications: Dearly

## 1. Branding & Visual Theme
- **Primary Theme (V1):** Soft Aesthetic
- **Vibe:** Warm, romantic, clean, & emotional.

## 2. Color Palette
- **Warm Vanilla:** Base background color, memberikan nuansa hangat.
- **Cream:** Secondary background / Envelope color.
- **Soft Pink:** Accent color untuk elemen romantis (hati, confetti).
- **Sage Green:** Secondary accent untuk elemen natural.
- **Warm Beige:** Border / Text accents.

*(Nilai HEX/HSL spesifik akan didefinisikan pada saat setup Tailwind).*

## 3. Typography
- **Headings & Readability (Navigasi/UI):** Menggunakan font dengan karakteristik membulat (rounded) dan tidak kaku (soft). Rekomendasi utama: **Quicksand** atau **Outfit**. Alternatif: *Nunito* atau *DM Sans*.
- **Poetic/Letter Content:** Font Handwriting / Script untuk memberikan kesan personal dan emosional. Rekomendasi utama: **Caveat** (natural & rapi) atau **Sacramento** (elegan & tipis). Alternatif: *Dancing Script*.

## 4. Micro-Interactions & UI Components
1. **Envelope Unboxing:**
   - Visual amplop dengan wax seal atau pita.
   - Hover efek pada seal.
   - Klik memicu animasi amplop terbuka, diikuti semburan confetti/bunga (menggunakan `canvas-confetti`).
   - Memicu autoplay BGM.
2. **Typewriter Effect:**
   - Teks muncul per karakter dengan kecepatan konstan.
   - Cursor berkedip di akhir kalimat.
3. **Polaroid Gallery:**
   - Foto bergaya polaroid dengan frame putih tebal di bagian bawah.
   - Layout *scattered* (sedikit miring/rotasi acak).
   - Interaksi hover membesar (scale up).
   - Interaksi klik membalikkan foto (3D flip) untuk menampilkan pesan/caption tulisan tangan di belakangnya.
4. **Custom Cursor:**
   - Efek jejak hati (heart trail) atau partikel kecil saat kursor digerakkan (opsional, tergantung performa).
