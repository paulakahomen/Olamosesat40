-- =============================================================================
-- OLAMOSES — Wishes wall schema
-- Run this once in the Supabase dashboard: SQL Editor -> New query -> Run.
-- Safe to re-run: every object is created with IF NOT EXISTS / dropped first.
-- =============================================================================

create table if not exists public.wishes (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 60),
  wish text not null check (char_length(wish) between 1 and 400),
  created_at timestamptz not null default now()
);

-- Newest wishes first is the only ordering the UI asks for.
create index if not exists wishes_created_at_idx
  on public.wishes (created_at desc);

-- -----------------------------------------------------------------------------
-- Row Level Security: public read, public insert, no update/delete.
-- -----------------------------------------------------------------------------

alter table public.wishes enable row level security;

drop policy if exists "wishes are public" on public.wishes;
create policy "wishes are public"
  on public.wishes for select
  to anon, authenticated
  using (true);

drop policy if exists "anyone can leave a wish" on public.wishes;
create policy "anyone can leave a wish"
  on public.wishes for insert
  to anon, authenticated
  with check (true);

-- No update or delete policies are defined on purpose: once a wish is on the
-- wall, only the service role (dashboard / server) can remove it.

-- -----------------------------------------------------------------------------
-- Realtime: stream new wishes to every open page.
-- -----------------------------------------------------------------------------

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'wishes'
  ) then
    alter publication supabase_realtime add table public.wishes;
  end if;
end $$;
