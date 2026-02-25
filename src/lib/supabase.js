import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://sxhlsfivxasepvszugtz.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4aGxzZml2eGFzZXB2c3p1Z3R6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwMzA0ODksImV4cCI6MjA4NzYwNjQ4OX0.IYhA6GkA4fFFxlrO6M4AONdE5bIAy5GDE-6RqlngjDU';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export function getProductImageUrl(path) {
  if (!path) return null;
  // Eğer zaten tam URL ise direkt döndür
  if (path.startsWith('http')) return path;
  const { data } = supabase.storage.from('product-images').getPublicUrl(path);
  return data.publicUrl;
}
