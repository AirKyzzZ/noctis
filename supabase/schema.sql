-- Profiles table linked to auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text unique,
  first_name text,
  last_name text,
  full_name text generated always as (first_name || ' ' || last_name) stored,
  email text,
  avatar_url text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

alter table public.profiles enable row level security;

-- RLS policies: users can manage their own profile
drop policy if exists "Profiles are viewable by the owner" on public.profiles;
create policy "Profiles are viewable by the owner"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Trigger to create an empty profile row on new auth user
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- Dreams table
create table if not exists public.dreams (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  occurred_at timestamptz not null default now(),
  type text check (type in ('cauchemar','lucide','ordinaire','autre')),
  pre_emotion text,
  post_emotion text,
  characters text[],
  location text,
  intensity int check (intensity between 1 and 10),
  clarity int check (clarity between 1 and 10),
  tags text[],
  sleep_quality int check (sleep_quality between 1 and 10),
  personal_meaning text,
  tone text check (tone in ('positive','negative','neutre')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.dreams enable row level security;

drop policy if exists "Dreams are viewable by owner" on public.dreams;
create policy "Dreams are viewable by owner"
  on public.dreams for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own dreams" on public.dreams;
create policy "Users can insert their own dreams"
  on public.dreams for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own dreams" on public.dreams;
create policy "Users can update their own dreams"
  on public.dreams for update
  using (auth.uid() = user_id);

drop policy if exists "Users can delete their own dreams" on public.dreams;
create policy "Users can delete their own dreams"
  on public.dreams for delete
  using (auth.uid() = user_id);

create index if not exists dreams_user_id_idx on public.dreams (user_id);
create index if not exists dreams_occurred_at_idx on public.dreams (occurred_at desc);
create index if not exists dreams_tags_gin on public.dreams using gin (tags);

-- Search materialized view (simple concatenation for LIKE queries)
create or replace view public.dreams_searchable as
  select
    d.id,
    d.user_id,
    d.occurred_at,
    (
      coalesce(d.type,'') || ' ' ||
      coalesce(d.pre_emotion,'') || ' ' ||
      coalesce(d.post_emotion,'') || ' ' ||
      coalesce(array_to_string(d.characters, ' '), '') || ' ' ||
      coalesce(d.location,'') || ' ' ||
      coalesce(array_to_string(d.tags, ' '), '') || ' ' ||
      coalesce(d.personal_meaning,'') || ' ' ||
      coalesce(d.tone,'') || ' ' ||
      coalesce(d.notes,'')
    ) as searchable_text
  from public.dreams d;

alter view public.dreams_searchable set (security_invoker = on);

-- Daily streak helper view
create or replace view public.dreams_by_day as
  select
    user_id,
    date_trunc('day', occurred_at) as day,
    count(*) as dream_count
  from public.dreams
  group by user_id, date_trunc('day', occurred_at);

alter view public.dreams_by_day set (security_invoker = on);

-- User settings table
create table if not exists public.user_settings (
  user_id uuid primary key references auth.users (id) on delete cascade,
  language text default 'fr' check (language in ('fr','en')),
  notifications_enabled boolean default true,
  reminder_time time,
  theme text default 'light' check (theme in ('light','dark', 'system')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.user_settings enable row level security;

drop policy if exists "Settings are viewable by owner" on public.user_settings;
create policy "Settings are viewable by owner"
  on public.user_settings for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own settings" on public.user_settings;
create policy "Users can insert their own settings"
  on public.user_settings for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own settings" on public.user_settings;
create policy "Users can update their own settings"
  on public.user_settings for update
  using (auth.uid() = user_id);

-- Updated timestamps triggers
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists set_dreams_updated_at on public.dreams;
create trigger set_dreams_updated_at
  before update on public.dreams
  for each row execute function public.set_updated_at();

drop trigger if exists set_user_settings_updated_at on public.user_settings;
create trigger set_user_settings_updated_at
  before update on public.user_settings
  for each row execute function public.set_updated_at();

