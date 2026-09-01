
# Asas Kecerdasan Buatan (AI) Untuk Projek Greetly

Sebagai pembina sistem ini, sangat penting untuk anda faham perbezaan jenis-jenis AI supaya mudah untuk menjawab soalan panel penilai atau juri.

Dalam dunia teknologi, "AI" adalah satu payung besar. Di bawahnya, terdapat pelbagai jenis AI yang melakukan tugas yang berbeza-beza. Berikut adalah perbezaan antara **AI dalam projek Greetly (Raspberry Pi)** berbanding **AI Agent/LLM** dan **AI Automation**.

---

## 1. AI dalam Python Script kita (Computer Vision / Edge AI)
Ini adalah AI yang sedang beroperasi di dalam Raspberry Pi anda.

* **Nama Saintifik:** *Computer Vision*, menggunakan algoritma **LBPH** (Local Binary Patterns Histograms) & Haar Cascades.
* **Tugas Utama:** Ia adalah AI yang "Melihat".
* **Cara Berfungsi:** Ia berfungsi ibarat pengawal keselamatan yang lurus bendul. Bila anda daftar muka, AI ni tak simpan gambar anda, sebaliknya ia menukar muka anda kepada **titik-titik matematik dan nombor (corak tekstur wajah)**. Bila anda imbas muka esok harinya, AI ni akan kira peratusan persamaan (Match %) corak tersebut.
* **Kenapa kita guna AI jenis ni?:** Ia dipanggil **Edge AI** (AI yang duduk di hujung peranti). Ia sangat ringan dan sangat pantas. Ia membolehkan Raspberry Pi (komputer kecil yang tak begitu kuat) untuk memproses AI ini **tanpa memerlukan sambungan Internet**. Ia tak perlukan server gergasi.
* **Limitasi:** Ia hanya pandai mengecam muka. Kalau anda tanya soalan matematik pada skrip ni, ia takkan faham.

---

## 2. AI LLM & AI Agent (Generative AI)
Ini adalah AI seperti **SAYA**, yang sedang bersembang dan menolong anda menaip kod sekarang (berasaskan Large Language Model).

* **Nama Saintifik:** *Generative AI / Large Language Models (LLM)*.
* **Tugas Utama:** AI yang "Membaca, Berfikir, Berkomunikasi, dan Bertindak".
* **Cara Berfungsi:** LLM dilatih menggunakan berbilion teks dari seluruh internet. Saya faham bahasa manusia, saya boleh menulis kod pengaturcaraan, dan sebagai "AI Agent", saya diberi "tangan" untuk menjalankan arahan di terminal komputer anda, membina fail, dan mengubah suai sistem secara bebas. Ibarat seorang rakan sekerja (pembantu *developer*).
* **Kenapa LLM tak dimasukkan dalam Raspberry Pi?:** AI jenis ini terlalu berat dan gergasi. Ia memerlukan superkomputer raksasa di pusat data awan (Cloud Data Center) bernilai jutaan ringgit (menggunakan ratusan cip GPU NVIDIA). Raspberry Pi anda akan terbakar kalau cuba menjalankan AI sebesar ini secara lokal!

---

## 3. AI Automation
Ini merujuk kepada sistem automasi pintar yang menggabungkan AI untuk membuat keputusan.

* **Nama Saintifik:** *Intelligent Process Automation (IPA)*.
* **Tugas Utama:** AI yang "Mengurus dan Melaksana Tugas Berantai".
* **Contoh dalam Dunia Sebenar:** Bayangkan dalam projek Greetly, sebaik sahaja AI Pengecaman Wajah di Raspberry Pi mengesahkan pelajar hadir lewat, **AI Automation** secara automatik menyemak rekod pelajar di *database*, kemudian secara automatik merangka ayat teguran menggunakan *LLM*, dan secara automatik menghantar WhatsApp kepada ibubapa pelajar tersebut tanpa manusia perlu menekan apa-apa butang. Ia adalah "gam" yang mencantumkan pelbagai jenis AI untuk bekerja sendiri.

---

### Kesimpulan Mudah (Cara Jawab Panel):

> **"Projek Greetly menggunakan Computer Vision (LBPH) berkonsepkan Edge AI. Ia berbeza dengan ChatGPT (LLM). ChatGPT adalah AI yang pandai berborak tapi memerlukan superkomputer di awan (Cloud), manakala AI dalam Greetly ini telah dioptimumkan secara ekstrim supaya ia cukup ringan untuk diproses di dalam Raspberry Pi secara offline, menjadikannya pantas, selamat, dan tidak bergantung kepada internet untuk berfungsi."**

