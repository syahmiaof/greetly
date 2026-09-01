
# Panduan Penskalaan Perkakasan (Hardware Scaling Guide)
*Dari Prototaip "Kotak Wayar" ke Peranti Kelas Industri (High-End)*

Untuk membawa Greetly daripada sebuah prototaip universiti (Raspberry Pi 3 + wayar *jumper*) kepada produk komersial bertaraf global (seperti ZKTeco atau peranti Apple-level), ini adalah peta jalan (*roadmap*) kejuruteraan pembuatan yang perlu anda lalui.

---

## Fasa 1: Prototaip (Sekarang)
- **Casing:** Kotak biasa / kotak plastik DIY.
- **Otak (MCU):** Raspberry Pi 3 Model B.
- **Sambungan:** Wayar Jumper (*Spaghetti Wires*), *Breadboard*.
- **Paparan:** OLED 0.96 inci yang sangat kecil.
- **Kos / Unit:** ~RM 350.
- **Tujuan:** Bukti Konsep (*Proof of Concept* - POC) untuk lulus FYP dan yakinkan pelabur pertama.

---

## Fasa 2: Minimum Viable Product (MVP) - Pre-Production (Untuk 10-50 Unit Pertama)
Sebelum kilang besar sudi buat produk anda, anda perlukan versi kemas untuk pelanggan pertama (Pilot Project sekolah).
- **Casing (3D Printing / Resin):** Anda reka bentuk *casing* menggunakan *software* CAD (AutoCAD/SolidWorks) yang kelihatan futuristik seperti gambar AI anda. Hantar ke kedai 3D Print (SLA/Resin) untuk hasil yang licin (*smooth finish*).
- **Sambungan (Custom PCB):** Tiada lagi wayar *jumper*! Anda reka *Printed Circuit Board* (PCB) khas. Raspberry Pi, Buzzer, dan skrin akan dicucuk terus (plug-in) atas satu papan litar hijau yang kemas. Kos tempah PCB dari kilang China (contoh: JLCPCB) sangat murah, serendah RM 20 untuk 5 keping.
- **Paparan:** Naik taraf kepada skrin LCD IPS 3.5 inci atau 5 inci.
- **Kos / Unit:** ~RM 450.

---

## Fasa 3: Pengeluaran Massa Kelas Industri (High-Class / Scalable)
Apabila anda mendapat tender 1,000 unit sekolah kerajaan, prototaip Pi 3 sudah tidak relevan. Anda perlu beralih ke tahap "*Enterprise*".

### 1. Perubahan Otak (Processing Power)
Raspberry Pi 3 mudah panas dan cipnya tidak direka khusus untuk A.I berterusan 24/7. Anda akan beralih kepada cip *Edge A.I* yang sebenar:
* **Raspberry Pi Compute Module (CM4 / CM5):** Ia adalah versi Pi tanpa *port* USB/HDMI (hanya cip mentah). Ia dipateri terus ke atas *Custom PCB* syarikat anda.
* **Rockchip RK3588 (Pilihan Industri):** Ini adalah cip yang digunakan oleh 90% peranti *Face Recognition* China. Sangat laju, menyokong kamera 4K, dan tidak panas.
* **Nvidia Jetson Nano / Google Coral TPU:** Jika anda gunakan A.I tahap dewa (Deep Learning canggih), cip ini mempunyai *Hardware Accelerator* khas untuk baca muka berpuluh-puluh orang serentak dalam 1 saat.

### 2. Casing (Plastic Injection Molding)
Untuk buat badan peranti nampak licin, premium, dan berkilat macam peranti sebenar, anda mesti guna kilang (Injection Molding).
* **Kos Acuan Besi (Mold):** Ini bahagian paling **MAHAL**. Kos menebuk blok besi untuk acuan *casing* anda selalunya berharga **RM 15,000 - RM 40,000** (bayar sekali sahaja / *One-off*).
* **Kos Casing Seunit:** Setelah acuan siap, kos untuk leburkan plastik dan hasilkan *casing* hanyalah **RM 5 ke RM 10 seunit!** Di sinilah keuntungan besar (*Scalability*) berlaku jika jualan ribuan unit.

### 3. Modul Kamera (ISP)
Kamera *webcam* biasa akan ditukar kepada **Kamera Dwi-Lensa (Dual-Lens RGB + IR)**. Satu lensa warna, satu lensa inframerah. Ini memastikan muka pelajar tetap boleh dikesan dalam keadaan gelap gelita (pagi buta di sekolah) dan menghalang 100% penipuan gambar 2D/3D (Spoofing).

### 4. Pensijilan (Certification)
Untuk jual ke gergasi / kerajaan, peranti anda perlu dihantar ke makmal ujian untuk mendapatkan tanda **SIRIM** (Malaysia), **CE** (Eropah), dan **FCC** (US) bagi mengesahkan ia tidak meletup atau terbakar apabila dipasang 24 jam sehari.

---

## Kesimpulan: Susah ke nak cari kilang?
**Tidak susah!** Anda tidak perlu bina kilang sendiri. Syarikat besar macam Apple pun tidak bina kilang, mereka guna **OEM / ODM** (seperti Foxconn) di Shenzhen, China atau di Pulau Pinang, Malaysia. Anda hanya hantar lukisan 3D dan skema litar kepada kilang di Pulau Pinang/China, bayar, dan kilang akan hantar beribu-ribu unit "Greetly" dalam kotak siap berbalut plastik kepada anda.

