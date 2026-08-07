create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  document_type text not null,
  status text not null default 'UPLOADED',
  version text default '1.0',
  language text default 'English',
  page_count integer,
  upload_date timestamptz default now(),
  summary text
);
