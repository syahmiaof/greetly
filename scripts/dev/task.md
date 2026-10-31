# Greetly AI & System Checklist

## 1. Tahap Selesai (Completed) 🟢
- [x] **Reka Bentuk UI/UX Copilot:** Bina panel kaca (*glassmorphism*), *split pane*, dan susun atur responsif.
- [x] **Integrasi Vercel AI SDK & Gemini 3.5:** Pasang sistem perbualan AI asas yang boleh membalas dengan pantas.
- [x] **Infografik Bersepadu (Context-Aware):** Animasi di panel kiri bertukar automatik berdasarkan topik (contoh: paparan *Scanner* untuk ponteng).
- [x] **Chat Persistence & Synthia Mini:** Sembang AI disimpan dalam memori (Local Storage) dan boleh diakses menerusi *widget* global di mana-mana halaman.
- [x] **Konteks Database Langsung (Live Context):** Menyambungkan fail pelayan (`route.ts`) dengan Supabase untuk membaca senarai pelajar Hadir, Lewat, dan Ponteng **secara terus dari pangkalan data**.

## 2. Sedang Berjalan / Akan Datang Secara Langsung (In Progress) 🟡
- [ ] **Padam Dummy Data:** Membuang 1,600 data olok-olok dari Supabase supaya AI dan *Dashboard* hanya membaca pergerakan pelajar yang sebenar. (Ini menjawab soalan kau: **Sistem AI kita MEMANG DAH BERSAMBUNG dengan database Supabase**, cuma sekarang dia tengah baca data palsu yang kita buat semalam. Bila kita padam dummy ni, AI tu akan 100% bergantung pada imbasan kamera sebenar).
- [ ] **Integrasi Perkakasan Raspberry Pi:** Memastikan skrip Python (`recognize_attendance.py`) menembak data masuk ke pangkalan data setiap kali wajah dicam, yang akan terus dipantulkan ke laman web secara *real-time*.

## 3. Perancangan Masa Depan (Future/Backlog) 🔵
- [ ] **Generative UI:** Membolehkan AI menjana graf (seperti carta pai atau graf bar) terus di dalam kotak perbualan AI.
- [ ] **Integrasi API Pihak Ketiga:** (Lihat cadangan di ruang sembang)
