create type public.idea_status as enum (
  'idea', 'recorded', 'research', 'experiment', 'prototype',
  'implemented', 'published', 'missed', 'abandoned'
);

create type public.idea_visibility as enum ('private', 'partial', 'public');

create table public.ideas (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 160),
  summary text,
  description text,
  status public.idea_status not null default 'idea',
  visibility public.idea_visibility not null default 'private',
  categories text[] not null default '{}',
  originality smallint check (originality between 1 and 5),
  impact smallint check (impact between 1 and 5),
  difficulty smallint check (difficulty between 1 and 5),
  timing smallint check (timing between 1 and 5),
  regret smallint check (regret between 1 and 5),
  conceived_at date,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index ideas_owner_id_idx on public.ideas(owner_id);
create index ideas_public_idx on public.ideas(published_at desc)
  where visibility = 'public';

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger ideas_set_updated_at
before update on public.ideas
for each row execute function public.set_updated_at();

alter table public.ideas enable row level security;

create policy "Published ideas are publicly readable"
on public.ideas for select
using (visibility = 'public' and published_at is not null);

create policy "Owners can read their ideas"
on public.ideas for select to authenticated
using ((select auth.uid()) = owner_id);

create policy "Owners can create ideas"
on public.ideas for insert to authenticated
with check ((select auth.uid()) = owner_id);

create policy "Owners can update their ideas"
on public.ideas for update to authenticated
using ((select auth.uid()) = owner_id)
with check ((select auth.uid()) = owner_id);

create policy "Owners can delete their ideas"
on public.ideas for delete to authenticated
using ((select auth.uid()) = owner_id);
