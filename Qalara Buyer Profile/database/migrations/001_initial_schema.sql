create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  role text not null default 'AM' check (role in ('AM', 'Admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

create table if not exists public.buyers (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_by uuid references auth.users(id),
  updated_at timestamptz,
  deleted_at timestamptz,
  first_name text,
  last_name text,
  email text not null unique,
  linkedin_url text,
  company_name text,
  website_url text,
  phone text,
  job_title text,
  seniority text,
  employee_size text,
  revenue_estimate text,
  hq_country text,
  founded_year int,
  industry text,
  brand_description text,
  materials_dealt text[] not null default '{}',
  website_categories text[] not null default '{}',
  imports_from_india boolean,
  import_supplier_names text[] not null default '{}',
  import_hs_codes text[] not null default '{}',
  buyer_type text check (buyer_type is null or buyer_type in ('Retailer', 'Importer', 'Wholesaler', 'D2C Brand')),
  category_interest text[] not null default '{}',
  customer_type text,
  enrichment_status text not null default 'pending' check (enrichment_status in ('pending', 'complete', 'partial', 'failed')),
  hubspot_contact_id text,
  last_enriched_at timestamptz,
  notes text
);

create index if not exists buyers_created_by_idx on public.buyers(created_by);
create index if not exists buyers_buyer_type_idx on public.buyers(buyer_type);
create index if not exists buyers_hq_country_idx on public.buyers(hq_country);
create index if not exists buyers_enrichment_status_idx on public.buyers(enrichment_status);

alter table public.profiles enable row level security;
alter table public.buyers enable row level security;

create policy "Users can read their own profile"
on public.profiles for select
using (auth.uid() = id);

create policy "Users can update their own profile"
on public.profiles for update
using (auth.uid() = id);

create policy "Users can insert their own profile"
on public.profiles for insert
with check (auth.uid() = id);

create policy "AMs can read own buyers"
on public.buyers for select
using (auth.uid() = created_by and deleted_at is null);

create policy "AMs can insert own buyers"
on public.buyers for insert
with check (auth.uid() = created_by);

create policy "AMs can update own buyers"
on public.buyers for update
using (auth.uid() = created_by);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
