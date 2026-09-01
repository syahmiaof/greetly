# Greetly: Business Model Canvas & Roadmap to RM 1 Million

Dokumen ini merangkumi pelan strategik komersial untuk **Greetly** – Sistem Kehadiran Pengecaman Wajah IoT (Raspberry Pi Edge AI + Next.js Dashboard + Supabase). Matlamat utama dokumen ini adalah untuk menyediakan strategi penembusan pasaran, terutamanya dalam sektor kerajaan (B2G), dan merangka peta jalan (roadmap) ke arah penjanaan hasil RM 1 Juta yang pertama.

---

## 1. Business Model Canvas (BMC)

| Pillar | Butiran |
| :--- | :--- |
| **Customer Segments** | <ul><li>**Sektor Kerajaan (B2G):** Sekolah-sekolah di bawah Kementerian Pendidikan Malaysia (KPM), Pejabat Pendidikan Daerah (PPD), Jabatan Pendidikan Negeri (JPN).</li><li>**Sektor Swasta (B2B):** PKS (SME), kilang, pejabat korporat, tapak pembinaan yang memerlukan pemantauan kehadiran pekerja yang ketat dan efisien.</li></ul> |
| **Value Propositions** | <ul><li>**Edge AI Processing:** Pengecaman pantas di peringkat peranti tanpa memerlukan internet berkelajuan tinggi berterusan.</li><li>**Cloud SaaS Dashboard:** Pemantauan dan pelaporan masa nyata (real-time) melalui Supabase dan Next.js, boleh diakses dari mana-mana peranti.</li><li>**Kos Efektif:** Jauh lebih murah berbanding sistem biometrik gred perusahaan tradisional, tanpa mengorbankan ketepatan.</li><li>**Pencegahan Penipuan (Anti-Spoofing):** Mengelakkan masalah 'buddy punching' yang biasa berlaku pada sistem kad perakam waktu (punch card) atau RFID.</li></ul> |
| **Channels** | <ul><li>Penjualan B2B secara terus (Direct Sales).</li><li>Sistem ePerolehan Kerajaan (untuk tender/sebut harga KPM/PPD).</li><li>Rangkaian pengedar (Distributors) teknologi pendidikan & korporat.</li><li>Digital Marketing (LinkedIn B2B, Facebook Ads) untuk mensasarkan pengurus HR dan pengetua sekolah.</li></ul> |
| **Customer Relationships** | <ul><li>Sokongan teknikal dan penyelenggaraan berkala (SLA - Service Level Agreement).</li><li>*Onboarding* dan latihan penggunaan perisian/perkakasan untuk staf admin/HR.</li><li>Langganan SaaS yang menyediakan kemas kini perisian secara automatik.</li></ul> |
| **Revenue Streams** | <ul><li>**Jualan Perkakasan (Hardware):** Keuntungan one-off daripada jualan unit peranti IoT.</li><li>**SaaS Subscription (Recurring Revenue):** Yuran bulanan/tahunan untuk akses sistem dashboard, penyimpanan cloud, dan analitik.</li><li>**Yuran Pemasangan & Latihan:** Caj perkhidmatan (one-off) untuk setup di premis.</li></ul> |
| **Key Resources** | <ul><li>**Teknologi:** Kod sumber Greetly (Raspberry Pi, Next.js, Supabase), rekaan perumah (3D printed case).</li><li>**Bakat:** Pembangun perisian (Software Engineer), pakar AI/IoT, dan pasukan jualan B2B.</li><li>**Infrastruktur:** Servis cloud (Supabase) dan bekalan komponen Raspberry Pi.</li></ul> |
| **Key Activities** | <ul><li>Pembangunan dan Penyelenggaraan Perisian (R&D).</li><li>Pemasangan peranti dan jaminan kualiti (Quality Assurance).</li><li>Aktiviti Jualan & Pemasaran B2G/B2B (Pitching, POC).</li><li>Sokongan Pelanggan (Customer Support/Helpdesk).</li></ul> |
| **Key Partnerships** | <ul><li>**Pembekal Komponen Elektronik:** Raspberry Pi, modul kamera, skrin OLED, pengilang 3D printing.</li><li>**Kementerian & Agensi Kerajaan:** KPM, MAMPU (untuk pensijilan/piawaian keselamatan data).</li><li>**Syarikat Telekomunikasi:** Untuk penyediaan sambungan 4G/5G dongle jika tiada WiFi di premis.</li></ul> |
| **Cost Structure** | <ul><li>Kos Pembuatan Perkakasan (BOM - Bill of Materials).</li><li>Infrastruktur Cloud & Server (Supabase/Vercel dll).</li><li>Gaji Pekerja (R&D, Sales, Support).</li><li>Kos Pemasaran & Operasi Perniagaan.</li></ul> |

---

## 2. Analisis Pesaing & Peluang (Competitor & Opportunity Analysis)

### Lanskap Semasa
*   **Punch Cards (Kad Perakam Waktu):** Terlalu lapuk, memerlukan penyelenggaraan mesin, mudah dimanipulasi ('buddy punching'), dan memerlukan pengiraan manual yang memakan masa HR.
*   **Sistem RFID/Kad Akses:** Lebih moden dari punch card, tetapi masih terdedah kepada kecurian identiti atau perkongsian kad ('buddy punching'). Kos penggantian kad yang hilang juga tinggi.
*   **Sistem Biometrik Tradisional (Ultra-Expensive):** Sistem cap jari (fingerprint) berisiko menyebarkan kuman/virus (isu pasca COVID-19) atau sukar dibaca jika jari kotor/berpeluh. Sistem pengecaman wajah gred perusahaan lazimnya bernilai berpuluh ribu ringgit, memerlukan server fizikal (on-premise) yang mahal dan kompleks untuk diselenggara.

### Kelebihan Kompetitif Greetly (Edge AI + Cloud SaaS Advantage)
*   **Teknologi Hibrid Optimum:** Memanfaatkan kuasa **Edge AI** di Raspberry Pi untuk pemprosesan imej dan padanan wajah pada kelajuan tinggi tanpa *latency* internet.
*   **Awan Berpusat (Cloud-First):** Data disegerakkan terus ke **Supabase** dan divisualisasikan melalui **Next.js Dashboard**, membolehkan pihak pengurusan (Pengetua/HR) memantau kehadiran cawangan/sekolah di seluruh negara dari satu skrin.
*   **Sentuhan Sifar (Touchless):** Mengurangkan risiko penyebaran penyakit dan memberikan pengalaman pengguna yang pantas (walk-through attendance).
*   **Sangat Berpatutan (Disruptive Pricing):** Kualiti setanding perusahaan pada titik harga mesra PKS dan sekolah bajet rendah.

---

## 3. Kos Pembuatan & Harga Jualan (Manufacturing Cost & Pricing Strategy)

### Anggaran Kos Perkakasan (Hardware Cost / BOM)
Untuk satu unit peranti Greetly:
*   Raspberry Pi 3/4 (atau alternatif seumpamanya): ~RM 200
*   Modul Kamera (Pi Camera / USB Camera): ~RM 40
*   Skrin Paparan (OLED / LCD 3.5"): ~RM 60
*   Perumah (3D Printed Case & heatsink/fan): ~RM 30
*   Kabel, Power Supply (Adaptor) & MicroSD: ~RM 20
*   **Jumlah Anggaran Kos (COGS): ~RM 350 / unit**

### Strategi Penentuan Harga (Pricing Proposal)
Model perniagaan Greetly akan bergantung kepada HaaS (Hardware-as-a-Service) atau Jualan Terus + SaaS.

1.  **Harga Jualan Perkakasan (Hardware): RM 999 / unit**
    *   *Margin Keuntungan Kasar (Gross Margin) Perkakasan: ~RM 649 (65%)*
2.  **SaaS Subscription (Langganan Perisian): RM 150 / bulan / premis**
    *   Pendapatan Berulang (Recurring Revenue) untuk akses ke Next.js Dashboard, laporan analitik, sokongan teknikal, dan penyimpanan cloud.

*Nota: Pemasangan fizikal (Installation) boleh dicas secara berasingan (contoh: RM 200 - RM 500 bergantung kepada kerumitan lokasi).*

---

## 4. Roadmap RM 1 Juta Pertama (The RM 1 Million Masterplan)

Bagaimana Greetly boleh mencapai pendapatan kasar RM 1,000,000?

### Senario Jualan B2B / B2G

Berdasarkan struktur harga di atas:
*   **Hasil Jualan Perkakasan (Year 1):** RM 999
*   **Hasil Langganan SaaS (Year 1):** RM 150 x 12 bulan = RM 1,800
*   **Total LTV (Customer Lifetime Value untuk Tahun Pertama): RM 2,799 / pelanggan**

### Kiraan Sasaran Jualan (Target Calculation)
Untuk mencapai RM 1,000,000 dalam masa setahun, kita memerlukan:

**RM 1,000,000 / RM 2,799 = ~358 unit / pelanggan**

Jika kita memecahkan sasaran ini:
*   Kita hanya perlu mensasarkan **358 buah sekolah** atau cawangan syarikat di seluruh Malaysia.
*   Sebagai perspektif, terdapat lebih daripada **10,000 buah sekolah** di Malaysia di bawah KPM. 358 buah sekolah mewakili kurang daripada **3.5%** penembusan pasaran KPM sahaja!
*   Jika pasukan jualan mampu menutup deal untuk **30 buah sekolah sebulan**, Greetly akan menjana lebih RM 1 Juta pada bulan ke-12.

*Ini adalah model 'recurring revenue' (langganan bulanan). Pada Tahun ke-2, jika tiada jualan perkakasan baharu pun, langganan daripada 358 pelanggan ini sahaja akan menjana **RM 644,400 setahun** (RM 150 x 12 x 358) yang merupakan margin untung bersih yang sangat tinggi!*

---

## 5. Strategi B2G (Tender Kerajaan / KPM)

Pasaran kerajaan, terutamanya Kementerian Pendidikan Malaysia (KPM) merupakan sasaran lubuk emas. Namun, proses perolehannya memerlukan langkah yang strategik dan pematuhan birokrasi.

### Langkah-langkah Menembusi KPM / Kerajaan (B2G Penetration Strategy)

1.  **Pendaftaran MOF (Kementerian Kewangan Malaysia):**
    *   Syarikat wajib berdaftar di bawah sijil MOF dengan kod bidang (kod taraf Bumiputera jika berkenaan) yang relevan seperti *Perkakasan/Peralatan Komputer*, *Perisian Komputer*, dan *Sistem ICT*.
    *   Sijil MOF adalah tiket utama untuk layak menyertai sebut harga atau tender kerajaan.

2.  **Akaun ePerolehan:**
    *   Pastikan syarikat telah aktif dalam sistem ePerolehan Kerajaan. Semua transaksi B2G, Invois dan Pesanan Kerajaan (Local Order/LO) akan dilakukan melalui sistem ini.

3.  **Pelaksanaan 'Proof of Concept' (POC) atau Pilot Project (Paling Kritikal):**
    *   **Tindakan:** Pilih 1 hingga 3 buah sekolah tempatan atau sekolah elit berdekatan kawasan operasi.
    *   **Tawaran:** Tawarkan penggunaan sistem Greetly secara *PERCUMA* (tajaan) selama 3 ke 6 bulan sebagai **Pilot Project**.
    *   **Objektif:** Kumpulkan data penggunaan (use case), maklum balas guru/pengetua, dan buktikan (verify) kebolehpercayaan sistem dalam keadaan sebenar (contoh: waktu kemuncak 7:00 pagi ketika beratus pelajar masuk serentak).
    *   **Hasil:** Jadikan laporan POC, testimonial Pengetua, dan metrik keberkesanan sekolah tersebut sebagai *'Success Story'* dan bahan rujukan (portfolio) apabila memohon tender rasmi (Pitching Deck) di peringkat PPD, JPN, atau Ibu Pejabat KPM.

4.  **Pensijilan dan Pematuhan Data (PDPA / Keselamatan Siber):**
    *   Kerajaan sangat sensitif terhadap data peribadi, apatah lagi data biometrik (wajah) kanak-kanak/pelajar.
    *   Dokumentasikan dengan jelas seni bina (architecture) keselamatan Greetly. Pastikan pematuhan terhadap Akta Perlindungan Data Peribadi 2010 (PDPA) dan nyatakan bagaimana imbasan wajah diproses di Edge AI dan data disulitkan (encrypted) di cloud (Supabase/PostgreSQL RLS).

5.  **Pitching Berpusat atau Pembelian Terus (Direct Nego / Sebut Harga):**
    *   Sebut harga di bawah RM 20,000 biasanya boleh dilakukan menerusi pembelian terus / sebut harga peringkat sekolah atau PPD.
    *   Gunakan jaringan (networking) dari sekolah perintis (Pilot Project) untuk melobi sekolah-sekolah lain di bawah daerah yang sama (PPD). Apabila lebih banyak sekolah menggunakannya, ia mudah menarik perhatian peringkat negeri (JPN) untuk pelaksanaan secara borong (bulk tender).
