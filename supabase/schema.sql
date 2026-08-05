-- Dearly Database Schema

-- ==========================================
-- DANGER ZONE: DEVELOPMENT RESET
-- Uncomment and run these lines if you need to force-update the schema 
-- (this will wipe all existing data!)
-- ==========================================
-- DROP TABLE IF EXISTS public.photos CASCADE;
-- DROP TABLE IF EXISTS public.letters CASCADE;
-- DROP TABLE IF EXISTS public.profiles CASCADE;
-- ==========================================
-- 1. Create `profiles` table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create `letters` table
CREATE TABLE IF NOT EXISTS public.letters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  slug TEXT NOT NULL UNIQUE,
  recipient_name TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  bgm_url TEXT,
  is_public BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'draft',
  views INTEGER DEFAULT 0,
  interactive_type TEXT DEFAULT 'none',
  interactive_data JSONB,
  whatsapp_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create `photos` table
CREATE TABLE IF NOT EXISTS public.photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  letter_id UUID NOT NULL REFERENCES public.letters(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Set up Row Level Security (RLS)

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;

-- Profiles Policies:
-- 1. Users can view their own profile
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

-- 1b. Users can update their own profile
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

-- 2. Admins can view all profiles
-- To prevent infinite recursion, we use a SECURITY DEFINER function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
DECLARE
  status boolean;
BEGIN
  SELECT role = 'admin' INTO status
  FROM public.profiles
  WHERE id = auth.uid();
  RETURN COALESCE(status, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
USING (public.is_admin());

-- Letters Policies:
-- 1. Anyone can read public letters
DROP POLICY IF EXISTS "Public letters are viewable by everyone" ON public.letters;
CREATE POLICY "Public letters are viewable by everyone"
ON public.letters FOR SELECT
USING (is_public = true);

-- 2. Users can read their own private letters
DROP POLICY IF EXISTS "Users can view their own letters" ON public.letters;
CREATE POLICY "Users can view their own letters"
ON public.letters FOR SELECT
USING (auth.uid() = user_id);

-- 3. Users can insert their own letters
DROP POLICY IF EXISTS "Users can create letters" ON public.letters;
CREATE POLICY "Users can create letters"
ON public.letters FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 4. Users can update their own letters
DROP POLICY IF EXISTS "Users can update their own letters" ON public.letters;
CREATE POLICY "Users can update their own letters"
ON public.letters FOR UPDATE
USING (auth.uid() = user_id);

-- 5. Users can delete their own letters
DROP POLICY IF EXISTS "Users can delete their own letters" ON public.letters;
CREATE POLICY "Users can delete their own letters"
ON public.letters FOR DELETE
USING (auth.uid() = user_id);

-- Photos Policies:
-- 1. Anyone can read photos of public letters
DROP POLICY IF EXISTS "Photos of public letters are viewable by everyone" ON public.photos;
CREATE POLICY "Photos of public letters are viewable by everyone"
ON public.photos FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.letters
    WHERE letters.id = photos.letter_id AND letters.is_public = true
  )
);

-- 2. Users can read photos of their own letters
DROP POLICY IF EXISTS "Users can view photos of their own letters" ON public.photos;
CREATE POLICY "Users can view photos of their own letters"
ON public.photos FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.letters
    WHERE letters.id = photos.letter_id AND letters.user_id = auth.uid()
  )
);

-- 3. Users can insert photos to their own letters
DROP POLICY IF EXISTS "Users can insert photos to their own letters" ON public.photos;
CREATE POLICY "Users can insert photos to their own letters"
ON public.photos FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.letters
    WHERE letters.id = photos.letter_id AND letters.user_id = auth.uid()
  )
);

-- 4. Users can update photos of their own letters
DROP POLICY IF EXISTS "Users can update photos of their own letters" ON public.photos;
CREATE POLICY "Users can update photos of their own letters"
ON public.photos FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.letters
    WHERE letters.id = photos.letter_id AND letters.user_id = auth.uid()
  )
);

-- 5. Users can delete photos of their own letters
DROP POLICY IF EXISTS "Users can delete photos of their own letters" ON public.photos;
CREATE POLICY "Users can delete photos of their own letters"
ON public.photos FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.letters
    WHERE letters.id = photos.letter_id AND letters.user_id = auth.uid()
  )
);

-- ==========================================
-- 4. Storage Bucket & Policies (Upload Foto)
-- ==========================================

-- Buat bucket public 'dearly-photos' jika belum ada
INSERT INTO storage.buckets (id, name, public) 
VALUES ('dearly-photos', 'dearly-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Izinkan publik untuk membaca/melihat foto
DROP POLICY IF EXISTS "Public Access to Photos" ON storage.objects;
CREATE POLICY "Public Access to Photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'dearly-photos');

-- Izinkan user terautentikasi untuk mengunggah foto ke folder mereka
-- (Pola folder di kode adalah: user_id/slug/fileName)
DROP POLICY IF EXISTS "Users can upload photos" ON storage.objects;
CREATE POLICY "Users can upload photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'dearly-photos' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Izinkan user memperbarui foto mereka sendiri
DROP POLICY IF EXISTS "Users can update their photos" ON storage.objects;
CREATE POLICY "Users can update their photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'dearly-photos' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Izinkan user menghapus foto mereka sendiri
DROP POLICY IF EXISTS "Users can delete their photos" ON storage.objects;
CREATE POLICY "Users can delete their photos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'dearly-photos' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- ==========================================
-- 5. Trigger for new user registration
-- ==========================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', 'User'),
    'user'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger whenever a user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
