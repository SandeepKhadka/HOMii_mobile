-- HOMii Database Schema
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor → New Query)

-- 1. Profiles table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  email text not null,
  university text,
  language text default 'en',
  onboarding_completed boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2. Onboarding progress
create table public.onboarding_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  category_id text not null,
  completed_items text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, category_id)
);

alter table public.onboarding_progress enable row level security;

create policy "Users can view own progress"
  on public.onboarding_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert own progress"
  on public.onboarding_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update own progress"
  on public.onboarding_progress for update
  using (auth.uid() = user_id);

-- 3. Ambassador applications
create type public.application_status as enum ('pending', 'approved', 'rejected');

create table public.ambassador_applications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null unique,
  student_email text not null,
  course text not null,
  motivation text,
  status public.application_status default 'pending',
  referral_code text unique not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.ambassador_applications enable row level security;

create policy "Users can view own application"
  on public.ambassador_applications for select
  using (auth.uid() = user_id);

create policy "Users can insert own application"
  on public.ambassador_applications for insert
  with check (auth.uid() = user_id);

-- 4. Referrals
create type public.referral_status as enum ('pending', 'confirmed', 'paid');

create table public.referrals (
  id uuid default gen_random_uuid() primary key,
  ambassador_id uuid references public.ambassador_applications(id) on delete cascade not null,
  referred_user_id uuid references public.profiles(id) on delete cascade not null,
  commission_amount numeric(10,2) default 0,
  status public.referral_status default 'pending',
  created_at timestamptz default now()
);

alter table public.referrals enable row level security;

create policy "Ambassadors can view own referrals"
  on public.referrals for select
  using (
    ambassador_id in (
      select id from public.ambassador_applications where user_id = auth.uid()
    )
  );

-- 5. Withdrawals
create type public.withdrawal_status as enum ('pending', 'completed', 'failed');

create table public.withdrawals (
  id uuid default gen_random_uuid() primary key,
  ambassador_id uuid references public.ambassador_applications(id) on delete cascade not null,
  amount numeric(10,2) not null,
  status public.withdrawal_status default 'pending',
  created_at timestamptz default now()
);

alter table public.withdrawals enable row level security;

create policy "Ambassadors can view own withdrawals"
  on public.withdrawals for select
  using (
    ambassador_id in (
      select id from public.ambassador_applications where user_id = auth.uid()
    )
  );

create policy "Ambassadors can request withdrawal"
  on public.withdrawals for insert
  with check (
    ambassador_id in (
      select id from public.ambassador_applications where user_id = auth.uid() and status = 'approved'
    )
  );

-- 6. Auto-update updated_at timestamps
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at();

create trigger update_onboarding_progress_updated_at
  before update on public.onboarding_progress
  for each row execute function public.update_updated_at();

create trigger update_ambassador_applications_updated_at
  before update on public.ambassador_applications
  for each row execute function public.update_updated_at();
