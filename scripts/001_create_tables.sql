-- Create admin users table
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create donations table
CREATE TABLE IF NOT EXISTS public.donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  cellphone TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  grand_total DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'New' CHECK (status IN ('New', 'Confirmed')),
  unique_id TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

-- Admin users policies
CREATE POLICY "Allow admins to view all admin users" ON public.admin_users
  FOR SELECT USING (auth.uid() IN (SELECT id FROM public.admin_users));

CREATE POLICY "Allow admins to insert admin users" ON public.admin_users
  FOR INSERT WITH CHECK (auth.uid() IN (SELECT id FROM public.admin_users));

CREATE POLICY "Allow admins to delete admin users" ON public.admin_users
  FOR DELETE USING (auth.uid() IN (SELECT id FROM public.admin_users));

-- Donations policies - anyone can insert, only admins can view/update/delete
CREATE POLICY "Allow anyone to insert donations" ON public.donations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow admins to view all donations" ON public.donations
  FOR SELECT USING (auth.uid() IN (SELECT id FROM public.admin_users));

CREATE POLICY "Allow admins to update donations" ON public.donations
  FOR UPDATE USING (auth.uid() IN (SELECT id FROM public.admin_users));

CREATE POLICY "Allow admins to delete donations" ON public.donations
  FOR DELETE USING (auth.uid() IN (SELECT id FROM public.admin_users));
