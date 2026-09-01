
# Analisis Pesaing & Kelebihan Greetly (Competitor Analysis)

Berdasarkan kajian pasaran terkini di peringkat global dan Malaysia, teknologi pengecaman wajah (*Facial Recognition*) untuk tujuan kedatangan (*attendance*) sedang berkembang pesat. Namun, pasaran ini didominasi oleh pemain-pemain tradisional. 

Berikut adalah analisis pesaing dan bagaimana **Greetly** mampu menumpaskan mereka.

---

## 1. Pesaing Global & Tempatan

### Pesaing Global (Gergasi Perkakasan / Hardware Giants)
* **Contoh Jenama:** ZKTeco, Hikvision, Dahua.
* **Model Bisnes:** Menjual peranti biometrik fizikal (mesin cap jari/muka) yang dipasang di dinding.
* **Kelemahan Mereka:** 
  - Harga yang amat mahal (RM 2,000 - RM 5,000 setiap unit).
  - Sistem perisian (*software*) yang sangat lapuk dan "*clunky*". Mereka kebanyakannya menggunakan perisian lama berasaskan Windows, lambat, dan tidak mempunyai paparan papan pemuka (*Dashboard*) web moden dan pantas seperti Next.js.
  - Peranti mereka tertutup (*proprietary*), susah untuk diintegrasikan (API) ke sistem sedia ada sekolah/syarikat.

### Pesaing Tempatan (Syarikat HR Cloud Malaysia)
* **Contoh Jenama:** FingerTec, Info-Tech, TimeTec, Kakitangan.com.
* **Model Bisnes:** Menjual perisian HR (SaaS) dan bergabung dengan peranti ZKTeco atau menggunakan Aplikasi Telefon Pintar.
* **Kelemahan Mereka:**
  - Untuk kedatangan berasaskan muka, kebanyakan mereka menggunakan Aplikasi Telefon Pintar (pekerja *selfie* di phone masing-masing). **Ini sangat tidak sesuai untuk pelajar sekolah** kerana pelajar dilarang membawa telefon bimbit!
  - Pakej langganan yang mahal untuk sekolah.
  - Masih bergantung pada mesin pihak ketiga (ZKTeco) yang mahal.

---

## 2. Kelebihan Daya Saing Greetly (The Greetly Advantage)

Kenapa Greetly lebih bagus dan boleh menang tender?

1. **Kos Sangat Rendah (Ultra Low-Cost Edge AI):**
   - Pesaing menjual mesin RM 2,500+. 
   - Greetly dibina di atas **Raspberry Pi 3** (~RM 350 kos perkakasan). Ini bermaksud sekolah boleh pasang Greetly di *setiap kelas*, bukannya berebut satu mesin di pagar sekolah!
2. **Kelajuan Paparan Masa Nyata (Realtime WebSockets):**
   - Menggunakan teknologi **Supabase Realtime**, apabila pelajar imbas muka di peranti, nama mereka akan "pop-up" di skrin *Web Dashboard* guru besar dalam masa 0.1 saat. Pesaing selalunya perlukan sistem *refresh* secara manual atau menunggu "*batch sync*".
3. **Kalis Internet Putus (Offline-First Architecture):**
   - Algoritma AI (LBPH) memproses imbasan wajah **di dalam peranti itu sendiri (Edge AI)**, bukan menghantar gambar ke pelayan (Cloud) untuk diproses. 
   - Jika internet sekolah terputus, Greetly masih beroperasi dan menyimpan rekod secara lokal (Offline Queue), sebelum dipam ke *Cloud* secara automatik.

---

## 3. Sudut Pandang Pelanggan (Jika Saya Adalah Guru Besar / CEO)

Jika saya seorang bakal pelanggan, **SAYA AMAT MAHU MENGGUNAKAN GREETLY** berbanding pesaing atas 3 sebab utama:

* **Membasmi Penipuan (No Buddy-Punching):** Pelajar dan pekerja tidak boleh "tolong *punch card*" untuk kawan mereka. Ciri **Anti-Spoofing** (Liveness Detection) Greetly juga menghalang mereka menipu menggunakan gambar telefon.
* **Kebersihan (Hygiene & Keselamatan Kesihatan):** Semasa musim wabak (COVID-19 atau HFMD), sistem cap jari konvensional menjadi lubuk penyebaran virus kerana beribu jari menyentuh alat yang sama. Greetly adalah 100% *Contactless*.
* **Bebas Masalah "Kad Hilang":** Teknologi RFID konvensional menelan kos yang tinggi apabila pelajar selalu menghilangkan kad atau tertinggal di rumah. Wajah pelajar tidak akan pernah hilang.

### Kesimpulan untuk Pitching FYP:
> *"Greetly bukan sekadar mencipta semula roda (reinvent the wheel). Greetly mendemokrasikan teknologi pengecaman wajah. Kami mengambil teknologi korporat bernilai ribuan ringgit dan memampatkannya ke dalam peranti kos rendah (Raspberry Pi) dengan perisian awan (Next.js) yang jauh lebih moden, menjadikannya mampu milik untuk setiap sekolah awam dan PKS di Malaysia."*

