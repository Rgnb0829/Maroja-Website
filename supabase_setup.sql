
-- 0. Fungsi Cek Admin (Supaya tidak terjadi Infinite Recursion saat cek RLS)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.is_admin();
$$;

-- ==========================================
-- SKEMA DATABASE MASJID RAUDHATUL JANNAH
-- Copy dan Paste script ini di menu "SQL Editor" pada dashboard Supabase Anda.
-- ==========================================

-- 1. Buat Tabel "users" untuk menampung profil jamaah dan admin
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    phone_number TEXT UNIQUE,
    address_block TEXT,
    role TEXT DEFAULT 'jamaah'::text,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Aktifkan Row Level Security (Keamanan tingkat baris)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 3. Policy (Aturan): Jamaah cuma bisa melihat datanya sendiri
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users can view own profile" 
ON public.users FOR SELECT 
USING (auth.uid() = id);

-- 4. Policy: Admin/Superadmin bisa melihat semua data profil
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.users;
CREATE POLICY "Admins can view all profiles" 
ON public.users FOR SELECT 
USING (
  public.is_admin()
);

-- 5. Policy: Admin bisa mengupdate (verifikasi) profil jamaah
DROP POLICY IF EXISTS "Admins can update profiles" ON public.users;
CREATE POLICY "Admins can update profiles" 
ON public.users FOR UPDATE 
USING (
  public.is_admin()
);

-- 6. Fungsi Trigger: Otomatis buat profil di public.users tiap kali ada mendaftar di auth.users (Supabase Auth)
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, phone_number, role, is_verified)
  -- Jika mendaftar admin manual, role di set ke 'jamaah' dulu, nanti admin ubah manual ke 'admin'
  VALUES (new.id, new.phone, 'jamaah', false);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Trigger Auth: Memasang fungsi di atas pada event INSERT
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==========================================
-- INSTRUKSI MEMBUAT AKUN ADMIN PERTAMA KALI
-- ==========================================
/*
Setelah Anda daftar akun Admin Anda di menu Authentication (Sign Up), jalankan query ini untuk memberi hak akses admin pada diri Anda sendiri:

UPDATE public.users 
SET role = 'superadmin', is_verified = true 
WHERE id = '45abf536-50da-4e34-8f2a-0c10bbfc1c3b';
*/

-- ==========================================
-- APP DATA TABLES (Warta, Keuangan, Profil, dll)
-- ==========================================

-- 1. Tabel Posts (Warta)
CREATE TABLE IF NOT EXISTS public.posts (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT,
    excerpt TEXT,
    content TEXT,
    date DATE DEFAULT CURRENT_DATE,
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view posts" ON public.posts;
CREATE POLICY "Public can view posts" ON public.posts FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can insert posts" ON public.posts;
CREATE POLICY "Admins can insert posts" ON public.posts FOR INSERT WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "Admins can update posts" ON public.posts;
CREATE POLICY "Admins can update posts" ON public.posts FOR UPDATE USING (public.is_admin());
DROP POLICY IF EXISTS "Admins can delete posts" ON public.posts;
CREATE POLICY "Admins can delete posts" ON public.posts FOR DELETE USING (public.is_admin());

-- 2. Tabel Finance (Keuangan)
CREATE TABLE IF NOT EXISTS public.finance (
    id SERIAL PRIMARY KEY,
    date DATE DEFAULT CURRENT_DATE,
    description TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('in', 'out')),
    amount NUMERIC NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.finance ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view finance" ON public.finance;
CREATE POLICY "Public can view finance" ON public.finance FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can insert finance" ON public.finance;
CREATE POLICY "Admins can insert finance" ON public.finance FOR INSERT WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "Admins can update finance" ON public.finance;
CREATE POLICY "Admins can update finance" ON public.finance FOR UPDATE USING (public.is_admin());
DROP POLICY IF EXISTS "Admins can delete finance" ON public.finance;
CREATE POLICY "Admins can delete finance" ON public.finance FOR DELETE USING (public.is_admin());

-- 3. Tabel Profil Masjid (Pengaturan Global)
CREATE TABLE IF NOT EXISTS public.profiles_masjid (
    id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1), -- Hanya boleh ada 1 baris
    name TEXT NOT NULL,
    description TEXT,
    address TEXT,
    phone TEXT,
    email TEXT,
    logo TEXT,
    logo_bg_color TEXT,
    facebook TEXT,
    instagram TEXT,
    youtube TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.profiles_masjid ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view profiles_masjid" ON public.profiles_masjid;
CREATE POLICY "Public can view profiles_masjid" ON public.profiles_masjid FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can update profiles_masjid" ON public.profiles_masjid;
CREATE POLICY "Admins can update profiles_masjid" ON public.profiles_masjid FOR UPDATE USING (public.is_admin());
DROP POLICY IF EXISTS "Admins can insert profiles_masjid" ON public.profiles_masjid;
CREATE POLICY "Admins can insert profiles_masjid" ON public.profiles_masjid FOR INSERT WITH CHECK (public.is_admin());

-- Bikin data default jika belum ada
INSERT INTO public.profiles_masjid (id, name, address) VALUES (1, 'Masjid Raudhatul Jannah', 'Griya Tamansari 2') ON CONFLICT (id) DO NOTHING;


-- 4. Tabel Pengurus
CREATE TABLE IF NOT EXISTS public.pengurus (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    contact TEXT,
    photo TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.pengurus ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view pengurus" ON public.pengurus;
CREATE POLICY "Public can view pengurus" ON public.pengurus FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can insert pengurus" ON public.pengurus;
CREATE POLICY "Admins can insert pengurus" ON public.pengurus FOR INSERT WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "Admins can update pengurus" ON public.pengurus;
CREATE POLICY "Admins can update pengurus" ON public.pengurus FOR UPDATE USING (public.is_admin());
DROP POLICY IF EXISTS "Admins can delete pengurus" ON public.pengurus;
CREATE POLICY "Admins can delete pengurus" ON public.pengurus FOR DELETE USING (public.is_admin());

-- 5. Tabel Inventaris
CREATE TABLE IF NOT EXISTS public.inventaris (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    condition TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.inventaris ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can view inventaris" ON public.inventaris;
CREATE POLICY "Admins can view inventaris" ON public.inventaris FOR SELECT USING (public.is_admin());
DROP POLICY IF EXISTS "Admins can insert inventaris" ON public.inventaris;
CREATE POLICY "Admins can insert inventaris" ON public.inventaris FOR INSERT WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "Admins can update inventaris" ON public.inventaris;
CREATE POLICY "Admins can update inventaris" ON public.inventaris FOR UPDATE USING (public.is_admin());
DROP POLICY IF EXISTS "Admins can delete inventaris" ON public.inventaris;
CREATE POLICY "Admins can delete inventaris" ON public.inventaris FOR DELETE USING (public.is_admin());

-- 6. Tabel Jadwal Jumat (jumat_schedules)
CREATE TABLE IF NOT EXISTS public.jumat_schedules (
    id SERIAL PRIMARY KEY,
    tanggal DATE NOT NULL,
    khatib TEXT NOT NULL,
    imam TEXT NOT NULL,
    muadzin TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.jumat_schedules ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view jumat_schedules" ON public.jumat_schedules;
CREATE POLICY "Public can view jumat_schedules" ON public.jumat_schedules FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can insert jumat_schedules" ON public.jumat_schedules;
CREATE POLICY "Admins can insert jumat_schedules" ON public.jumat_schedules FOR INSERT WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "Admins can update jumat_schedules" ON public.jumat_schedules;
CREATE POLICY "Admins can update jumat_schedules" ON public.jumat_schedules FOR UPDATE USING (public.is_admin());
DROP POLICY IF EXISTS "Admins can delete jumat_schedules" ON public.jumat_schedules;
CREATE POLICY "Admins can delete jumat_schedules" ON public.jumat_schedules FOR DELETE USING (public.is_admin());

-- 7. Tabel Distribusi Zakat dan Qurban (zakat_qurban_distribution)
CREATE TABLE IF NOT EXISTS public.zakat_qurban_distribution (
    id SERIAL PRIMARY KEY,
    tipe_program TEXT NOT NULL,
    tanggal DATE NOT NULL,
    penerima TEXT NOT NULL,
    jumlah_distribusi TEXT NOT NULL,
    keterangan TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.zakat_qurban_distribution ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view zakat_qurban_distribution" ON public.zakat_qurban_distribution;
CREATE POLICY "Public can view zakat_qurban_distribution" ON public.zakat_qurban_distribution FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can insert zakat_qurban_distribution" ON public.zakat_qurban_distribution;
CREATE POLICY "Admins can insert zakat_qurban_distribution" ON public.zakat_qurban_distribution FOR INSERT WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "Admins can update zakat_qurban_distribution" ON public.zakat_qurban_distribution;
CREATE POLICY "Admins can update zakat_qurban_distribution" ON public.zakat_qurban_distribution FOR UPDATE USING (public.is_admin());
DROP POLICY IF EXISTS "Admins can delete zakat_qurban_distribution" ON public.zakat_qurban_distribution;
CREATE POLICY "Admins can delete zakat_qurban_distribution" ON public.zakat_qurban_distribution FOR DELETE USING (public.is_admin());
