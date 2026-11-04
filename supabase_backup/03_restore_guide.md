# Panduan Pulihkan Semula (Restore Guide) Database Greetly 🚀

Dokumen ini adalah panduan lengkap langkah demi langkah untuk bina balik database **Greetly** ke mana-mana projek Supabase baharu dalam masa kurang 2 minit!

---

## Langkah 1: Cipta Projek Baru di Supabase
1. Masuk ke dashboard [Supabase](https://supabase.com/dashboard).
2. Tekan butang **New project**.
3. Masukkan nama projek (contoh: `greetly-v2`).
4. Pilih Region (disyorkan: **Singapore / ap-southeast-1** untuk latency terpantas di Malaysia).
5. Tetapkan database password (jangan lupa simpan).

---

## Langkah 2: Jalankan Skrip SQL Backup
1. Di menu sebelah kiri dashboard Supabase baru anda, klik ikon **SQL Editor**.
2. Klik **New query**.
3. Buka fail [`01_schema.sql`](./01_schema.sql), salin (copy) semua isinya, dan tampal (paste) ke dalam SQL Editor.
4. Klik butang hijau **Run**. (Semua jadual, index, RLS policies & Realtime publication akan siap terbina!).
5. Buka tab baru di SQL Editor, salin isi fail [`02_seed_data.sql`](./02_seed_data.sql), tampal dan klik **Run** untuk masukkan data permulaan (profil Syahmi Aof & rekod asas).

---

## Langkah 3: Kemas Kini Kunci API di `.env.local`
1. Di dashboard Supabase, pergi ke **Project Settings** (ikon gear di bawah kiri) ➡️ **API**.
2. Salin:
   - **Project URL**
   - **anon / public key**
3. Buka fail `.env.local` di root projek Greetly laptop anda:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://<project-ref-baru>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...<anon-key-baru>
   OPENROUTER_API_KEY=sk-or-v1-...<kunci-anda>
   ```
4. Jika Raspberry Pi digunakan, kemas kini juga fail `.env.local` di Raspberry Pi (`/home/syahmiaof123/project01/.env.local`).

---

## Langkah 4: Cipta Pengguna Admin (Authentication)
1. Pergi ke menu **Authentication** di Supabase ➡️ **Users**.
2. Klik **Add User** ➡️ **Create User**.
3. Masukkan:
   - **Email:** `admin@tvetmara.edu.my` (atau email pilihan anda)
   - **Password:** `<kata-laluan-anda>`
   - Tandakan **Auto Confirm User?** sebagai **Yes**.
4. Selesai! Anda kini boleh login terus ke dashboard admin Greetly.
