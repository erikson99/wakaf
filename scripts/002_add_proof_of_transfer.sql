-- Add proof_of_transfer column to donations table
ALTER TABLE donations ADD COLUMN proof_of_transfer TEXT;

-- Create storage bucket for proof of transfer files
INSERT INTO storage.buckets (id, name, public) VALUES ('proof-of-transfer', 'proof-of-transfer', true) ON CONFLICT DO NOTHING;

-- Set up RLS policies for the storage bucket
CREATE POLICY "Public can upload proof of transfer" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'proof-of-transfer');

CREATE POLICY "Public can read proof of transfer" ON storage.objects
  FOR SELECT USING (bucket_id = 'proof-of-transfer');

CREATE POLICY "Admins can delete proof of transfer" ON storage.objects
  FOR DELETE USING (bucket_id = 'proof-of-transfer');
