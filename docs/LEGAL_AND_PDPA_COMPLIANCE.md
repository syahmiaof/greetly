# Panduan Pematuhan Undang-Undang dan PDPA 2010 untuk Greetly

## 1. Pengenalan PDPA 2010 (Akta 709)
Akta Perlindungan Data Peribadi 2010 (PDPA) adalah undang-undang Malaysia yang mengawal selia pemprosesan data peribadi dalam transaksi komersial. Bagi sistem pengecaman wajah (facial recognition) seperti Greetly, ia melibatkan pengumpulan, penyimpanan, dan penggunaan ciri-ciri biometrik individu. Menurut PDPA, sebarang data yang boleh mengenal pasti seseorang individu secara langsung atau tidak langsung adalah tertakluk kepada akta ini. Greetly wajib mematuhi 7 Prinsip Perlindungan Data Peribadi di bawah PDPA bagi mengelakkan penalti perundangan, termasuk denda ratusan ribu ringgit dan penjara.

## 2. Data Peribadi Sensitif (Sensitive Personal Data)
Di bawah PDPA, data biometrik (termasuk imbasan wajah) sering dikategorikan sebagai **Data Peribadi Sensitif** kerana ia melibatkan ciri fizikal unik seseorang.
- **Kebenaran Eksplisit (Explicit Consent):** Anda tidak boleh memproses data peribadi sensitif tanpa kebenaran bertulis yang jelas daripada subjek data.
- **Kanak-kanak & Pelajar Sekolah:** Jika Greetly digunakan di sekolah, kanak-kanak di bawah umur 18 tahun tidak boleh memberikan kebenaran yang sah di sisi undang-undang. Oleh itu, **kebenaran bertulis daripada ibu bapa atau penjaga sah adalah diwajibkan** sebelum sebarang data wajah pelajar boleh diimbas, direkodkan, dan diproses.

## 3. Apa Yang BOLEH (Dos)
- **Dapatkan Persetujuan Jelas:** Sediakan borang persetujuan (consent form) yang mudah difahami sebelum mendaftarkan wajah pengguna.
- **Paparkan Notis Privasi:** Sediakan Notis Privasi (dalam Bahasa Melayu dan Bahasa Inggeris) yang menjelaskan tujuan pengumpulan data, dengan siapa data dikongsi, dan hak pengguna, seiring dengan Prinsip Notis dan Pilihan.
- **Enkripsi Data (Data Encryption):** Pastikan semua data yang dihantar dan disimpan disulitkan (encrypted). Contohnya, menggunakan ciri keselamatan pangkalan data seperti Supabase (Row Level Security - RLS) dan enkripsi pangkalan data (encryption-at-rest) untuk melindungi log kedatangan.
- **Beri Hak Akses & Pembetulan:** Pengguna harus diberi cara dan hak untuk memohon akses kepada data peribadi mereka dan membetulkannya sekiranya tidak tepat.

## 4. Apa Yang TIDAK BOLEH (Don'ts)
- **Jangan Jual Data:** Dilarang keras menjual, menyewa, atau berkongsi data peribadi dan biometrik pengguna kepada pihak ketiga (seperti syarikat pengiklanan) tanpa kebenaran.
- **Jangan Simpan Data Selama-lamanya (Prinsip Penyimpanan):** Data tidak boleh disimpan lebih lama daripada yang diperlukan. Jika pelajar tamat sekolah (habis Tingkatan 5) atau pekerja berhenti kerja, data biometrik mereka mesti dipadamkan secara kekal dari pangkalan data.
- **Jangan Abaikan Keselamatan (Prinsip Keselamatan):** Jangan amalkan langkah keselamatan yang longgar (sloppy security) seperti membiarkan fail gambar mentah terdedah di internet tanpa kata laluan. Kehilangan data akibat kecuaian adalah satu kesalahan jenayah di bawah PDPA.

## 5. Kelebihan Edge AI Greetly dalam Pematuhan PDPA
Seni bina Greetly yang memproses pengecaman wajah secara lokal (Edge AI) menggunakan Raspberry Pi merupakan satu **kelebihan besar dalam pematuhan privasi** berbanding pesaing:
- **Tiada Penghantaran Video Mentah:** Video atau gambar wajah mentah tidak dihantar ke pelayan awan (cloud server) pusat untuk diproses. Semua pemprosesan imej berlaku pada pagar sekolah / peranti itu sendiri (on-device processing).
- **Pengurangan Risiko Kebocoran Data (Mass Data Breach):** Memandangkan pelayan awan tidak menyimpan lambakan gambar mentah pengguna, risiko kecurian identiti biometrik akibat penggodaman pangkalan data dapat dikurangkan secara drastik. Ini menjadikan Greetly sebuah sistem yang mengamalkan konsep *Privacy-by-Design*.

## 6. Langkah Seterusnya untuk Syahmi
- **Rangka Borang Persetujuan (Consent Form):** Sediakan borang persetujuan rasmi PDF untuk diedarkan oleh pihak sekolah kepada ibu bapa semasa sesi pendaftaran Greetly kelak.
- **Daftar dengan JPDP:** Sekiranya Greetly dipasarkan secara komersial (contohnya, menjual sistem ini sebagai B2B/B2G dan anda bertindak sebagai pemproses data), Syarikat anda diwajibkan mendaftar sebagai Pengguna Data dengan **Jabatan Perlindungan Data Peribadi (JPDP)** di Malaysia.
- **Laksanakan Polisi Pemadaman Data Automatik (Cron Job):** Bina satu sistem pemadaman di Supabase untuk memadam data biometrik pelajar yang sudah "Lulus / Berhenti" secara automatik.
