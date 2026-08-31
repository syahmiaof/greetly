# Pertandingan Inovasi Antarabangsa: Greetly Pitch Deck

## 1. Abstrak Inovasi
Kadar ponteng sekolah yang tinggi (3.59% atau 182,000+ pelajar di Malaysia) serta pembaziran masa sesi P&P (15 minit/kelas) untuk mengambil kehadiran manual merupakan satu kerugian produktiviti nasional. **Greetly** membawa revolusi Pengurusan Kehadiran Pintar dengan menggabungkan **Edge Artificial Intelligence (Raspberry Pi)** dan **Real-time Cloud Computing**. Ia menyelesaikan isu kekangan internet di sekolah dengan hanya memproses visual secara lokal, menjadikannya sistem paling pantas, kos-rendah, dan patuh PDPA di pasaran.

## 2. Penyelesaian Kepada Masalah Masyarakat Semasa
Adakah inovasi ini sekadar 'Syok Sendiri'? Tidak.
- **Masalah Sebenar:** Guru terbeban dengan kerja perkeranian. Kes ponteng sukar dikesan lebih awal oleh ibu bapa/kaunselor.
- **Penyelesaian Greetly:** Papan Pemuka Greetly memberikan paparan *Live* secara terus ke pihak pengurusan. Proses imbasan tanpa sentuh menyaring 30 pelajar dalam masa kurang seminit.
- **Masalah Infrastruktur:** Pesaing komersial (contoh: TimeTec) memerlukan langganan jalur lebar tinggi dan terminal bernilai ribuan ringgit. Greetly berfungsi dengan lancar pada kelajuan internet minima (3G/4G/1BestariNet legacy) kerana saiz *payload* (penghantaran data) hanyalah dalam bentuk UUID.

## 3. Keunikan Sistem (Novelty)
1. **Edge-Caching Anti-Spam (Sudah Hadir):** Inovasi logik algoritma tempatan di mana Kiosk menyimpan memori sementara bagi mengelakkan pertindihan data sekiranya pelajar berdiri lama di hadapan kamera. Mengurangkan beban kos pangkalan data awan.
2. **Tri-Feedback Hardware Loop:** Gabungan Kotak Pengecaman (Visual UI), Paparan Nama OLED (Teks), dan Buzzer Active-Low (Audio) memberi kepastian psikologi kepada pengguna bahawa kehadiran mereka telah direkodkan.
3. **Over-the-Air (OTA) Configuration:** Semua kawalan perkakasan IoT (Kiosk) seperti *Cooldown Timer* boleh dikawal terus dari laman web tanpa perlu *cucuk USB* atau berhubung secara SSH.

## 4. Kelebihan Kompetitif (Competitor Analysis)
| Kriteria | Greetly | Sistem Terminal Konvensional |
| :--- | :--- | :--- |
| **Kos Perkakasan** | ~RM 400 (Raspberry Pi & Komponen) | RM 1,500 - RM 3,000 |
| **Kebergantungan Internet** | Amat Rendah (Hanya hantar ID) | Tinggi (Hantar data biometrik/imej) |
| **Pematuhan PDPA/Privasi** | Tinggi (Tiada imej dihantar ke Cloud) | Rendah (Data wajah diproses di Cloud) |
| **UI/UX Papan Pemuka** | Premium & Tema Boleh Diubah (Theme Switcher) | Rekaan *Corporate/Legacy* |

## 5. Tahap Kesediaan Teknologi (TRL)
**TRL 7 (Prototaip Sistem Ditunjukcara dalam Persekitaran Operasi):**
Greetly bukan lagi satu konsep. Ia merupakan produk perisian *Full-Stack* (Next.js 15, Supabase, Tailwind v4) yang berfungsi sepenuhnya bersama komunikasi bi-directional perkakasan IoT berasaskan Python. Prototaip ini sedia untuk ujian rintis (Pilot Test) di sekolah-sekolah berhampiran.
