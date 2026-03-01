# Panduan Setup Supabase - Masjid Raudhatul Jannah

Untuk menghubungkan website ini ke Supabase secara utuh, ikuti langkah-langkah di bawah ini.

## Langkah 1: Buat Project di Supabase
1. Buka [https://supabase.com/](https://supabase.com/) dan buat akun/login.
2. Klik tombol **New Project**.
3. Beri nama project Anda (misal: `Maroja-App`) dan tentukan *Database Password*. Simpan password ini baik-baik.
4. Pilih *Region* yang terdekat (contoh: Singapore).

## Langkah 2: Dapatkan Credentials (URL & Anon Key)
Setelah project berhasil dibuat (mungkin memakan waktu beberapa menit):
1. Masuk ke manu **Project Settings** (ikon gerigi⚙️ di kiri bawah).
2. Pilih tab **API**.
3. Di situ terdapat **Project URL** dan **Project API Keys (anon public)**.
4. Buka file `.env.local` di *source code* website ini, lalu paste kedua nilai tersebut:
   ```env
   VITE_SUPABASE_URL=paste_url_anda_disini
   VITE_SUPABASE_ANON_KEY=paste_anon_key_anda_disini
   ```

## Langkah 3: Eksekusi Skema Database
Sistem kita membutuhkan tabel `users` untuk menyimpan profil dan Role (Jamaah/Admin). 
1. Di sidebar Supabase, klik menu **SQL Editor** (ikon terminal `>_`).
2. Klik **New Query**.
3. Buka file `supabase_setup.sql` yang baru saja saya buatkan di *root folder* project ini.
4. Salin (**Copy**) HANYA KODE SQL dari awal sampai akhir, lalu **Paste** ke SQL Editor.
5. Tekan tombol hijau **Run** memanjang di kanan bawah. Anda harus melihat pesan "Success".

## Langkah 4: Aktifkan Metode Login
### 1. Mengaktifkan Login Admin (Email & Password)
Opsi ini secara bawaan (default) sudah **Aktif** di Supabase.
1. Untuk membuat akun Admin perdana Anda, masuk ke menu **Authentication** > **Users**.
2. Klik tombol **Add user** > **Create new user**.
3. Masukkan Email dan Password untuk login admin kelak (misal: `admin@maroja.com`). Lalu klik Create.
4. Setelah dibuat, Anda perlu **mempromosikannya menjadi Admin** agar bisa masuk ke `/admin`.
5. Kembali ke **SQL Editor**, buka *Query* baru dan jalankan baris ini (Kopas *User UID* yang ada di tab Authentication User tadi):
   ```sql
   UPDATE public.users SET role = 'superadmin', is_verified = true WHERE id = '45abf536-50da-4e34-8f2a-0c10bbfc1c3b';
   ```

### 2. Mengaktifkan OTP WhatsApp untuk Jamaah
OTP Supabase secara native mengandalkan pihak ketiga pengirim pesan otomatis (*Twilio, MessageBird*, dsb). 
1. Masuk ke **Authentication** > **Providers** di sidebar Supabase.
2. Temukan opsi **Phone** dan nyalakan tombol *Enable Phone Provider*.
3. Lengkapi form yang diminta dari provider SMS/WhatsApp yang Anda gunakan.
4. *(Opsional - Jalur Edukasi)*: Jika Anda kesulitan menyewa API WhatsApp resmi saat ini, Supabase menyediakan **Email OTP** sebagai alternatif yang 100% gratis (*Magic Link*). Jika Anda menginginkan peralihan dari WA ke Email untuk tahap awal ini, beri tahu saya agar saya sesuaikan komponen `<LoginJamaah />`.

## Langkah 5: Testing
1. *Restart/Run* kembali local server *Vite* Anda (`npm run dev`).
2. Login Admin Anda di `localhost:5173/admin/login` menggunakan kredensial email yang dibuat di Langkah 4.1.
3. Done! Website Anda sudah terhubung ke database.
