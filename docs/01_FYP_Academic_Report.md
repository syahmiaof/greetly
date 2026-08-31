# Laporan Projek Tahun Akhir (FYP): Greetly - Real-Time Facial Recognition Attendance System

## BAB 1: Pengenalan
**1.1 Penyataan Masalah**
Sistem pengambilan kehadiran tradisional memakan masa (10-15 minit per sesi) dan terdedah kepada penipuan (buddy punching). Berdasarkan data Kementerian Pendidikan Malaysia (KPM) 2023/2024, kadar ponteng sekolah adalah 3.59% (lebih 182,000 pelajar). Selain itu, sistem berasaskan 'Cloud-AI' sedia ada memerlukan kos infrastruktur yang tinggi dan membebankan liputan internet sekolah (bottleneck) kerana menghantar data video mentah ke pelayan.

**1.2 Objektif Projek**
1. Membangunkan sistem kehadiran pengecaman wajah berasaskan Edge Computing (Raspberry Pi).
2. Membangunkan papan pemuka (dashboard) masa nyata menggunakan Next.js dan Supabase.
3. Menilai ketepatan dan prestasi sistem dalam mengurangkan penggunaan lebar jalur (bandwidth) internet.

**1.3 Skop Projek**
- **Perkakasan:** Raspberry Pi 3/4, Modul Kamera (NoIR), SSD1306 OLED, Active-Low Buzzer.
- **Perisian/Platform:** Next.js 15, Tailwind CSS v4, Supabase (Auth, Realtime, PostgreSQL), Python (OpenCV, face_recognition).
- **Pengguna Sasaran:** Pentadbir sekolah, pensyarah, dan pengawal keselamatan.

## BAB 2: Kajian Literatur
**2.1 Perbandingan Teknologi Kehadiran**
- **RFID/Kad Pintar:** Mudah dipalsukan atau dipinjamkan kepada rakan.
- **Pengimbas Cap Jari:** Isu kebersihan (sentuhan fizikal) dan perlahan jika jari basah/kotor.
- **Cloud Facial Recognition (Sedia ada):** Kos operasi pelayan (GPU) yang mahal dan isu lengah masa (latency) jika internet sekolah perlahan.
- **Greetly (Edge AI):** Memproses pengecaman secara lokal pada Raspberry Pi, hanya menghantar data teks bersaiz kecil (Byte) ke Cloud. Ini menyelesaikan masalah kelajuan internet.

## BAB 3: Metodologi Pembangunan
**3.1 Kitaran Hayat Pembangunan Sistem (SDLC) - Agile**
Pembangunan Greetly menggunakan pendekatan Agile, membenarkan iterasi berterusan antara pembangunan perisian (Dashboard) dan prototaip perkakasan (Kiosk).

**3.2 Seni Bina Sistem (System Architecture)**
Sistem Greetly terdiri daripada dua nod utama:
1. **Edge Node (Raspberry Pi):** Menerima suapan video, mengesan wajah, menapis log pendua melalui logik *Anti-Spam Cooldown*, dan memaparkan status pada skrin OLED.
2. **Cloud Node (Supabase & Vercel):** Menguruskan pangkalan data PostgreSQL secara berpusat, menguruskan log masuk, dan menyalurkan data menerusi WebSockets ke papan pemuka Next.js secara *Real-time*.

## BAB 4: Reka Bentuk Sistem & Model Pangkalan Data
**4.1 Skema Pangkalan Data (ERD)**
- students: Menyimpan rekod pelajar, student_id (Matrik), dan pautan vatar_url.
- ttendance_logs: Menyimpan ID pelajar, masa, dan status kehadiran.
- hardware_telemetry: Mengjejak suhu CPU, ping, dan status peranti Raspberry Pi.

**4.2 Logik Anti-Spam (Sudah Hadir Cooldown)**
Bagi mengelakkan kebanjiran data (database spamming) apabila pelajar berdiri lama di hadapan kamera, sistem memori lokal Raspberry Pi akan menyimpan *cache* ID sementara. Jika wajah dikesan berulang kali dalam tempoh *cooldown* yang ditetapkan, peranti hanya memberi respon visual pada OLED tanpa melakukan panggilan API ke Cloud.

## BAB 5: Pengujian & Analisis Prestasi
**5.1 Pengujian Ketepatan Wajah**
- Merekodkan peratusan ketepatan (*Confidence Score*) pada pelbagai tahap pencahayaan.
**5.2 Pengujian Beban Rangkaian (Network Payload Analysis)**
- Membandingkan saiz penghantaran imej mentah (~2MB/saat) berbanding penghantaran rentetan UUID melalui REST API (~0.002MB/saat). Greetly terbukti mengurangkan penggunaan jalur lebar sehingga 99.9%.

## BAB 6: Kesimpulan
Sistem Greetly berjaya membuktikan bahawa integrasi Edge Computing dan seni bina awan (Cloud Architecture) moden mampu menghasilkan sistem gred komersial yang menjimatkan kos dan sangat efisien untuk operasi sekolah luar bandar mahupun institusi moden.
