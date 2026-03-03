const fs = require('fs');
let content = fs.readFileSync('supabase_setup.sql', 'utf8');

const fn = `
-- 0. Fungsi Cek Admin (Supaya tidak terjadi Infinite Recursion saat cek RLS)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role IN ('admin', 'superadmin')
  );
$$;

`;

content = fn + content;

const regex = /EXISTS\s*\(\s*SELECT\s+1\s+FROM\s+public\.users\s+WHERE\s+id\s*=\s*auth\.uid\(\)\s*AND\s+role\s+IN\s*\('admin',\s*'superadmin'\)\s*\)/g;
content = content.replace(regex, 'public.is_admin()');

fs.writeFileSync('supabase_setup.sql', content);
console.log('SQL updated with is_admin() function.');
