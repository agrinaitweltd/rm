-- Promo codes (created in /admin, validated server-side at payment time)
-- and post-payment site ratings.

create table if not exists public.promo_codes (
  id          uuid primary key default gen_random_uuid(),
  code        text not null unique,
  type        text not null check (type in ('percent', 'fixed')),
  value       integer not null check (value > 0),        -- percent (1-100) or pence
  starts_at   timestamptz,
  expires_at  timestamptz,
  max_uses    integer check (max_uses > 0),
  uses        integer not null default 0,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

-- Percent values stay sane.
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'promo_codes_percent_range') then
    alter table public.promo_codes
      add constraint promo_codes_percent_range
      check (type <> 'percent' or value <= 100);
  end if;
end $$;

-- Atomic use counter: only bumps while under max_uses.
create or replace function public.increment_promo_use(promo_code text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  updated integer;
begin
  update public.promo_codes
     set uses = uses + 1
   where upper(code) = upper(promo_code)
     and (max_uses is null or uses < max_uses);
  get diagnostics updated = row_count;
  return updated > 0;
end;
$$;

revoke execute on function public.increment_promo_use(text) from public, anon, authenticated;

create table if not exists public.ratings (
  id                    uuid primary key default gen_random_uuid(),
  stars                 integer not null check (stars between 1 and 10),
  comment               text,
  stripe_payment_intent text,
  created_at            timestamptz not null default now()
);

-- Service-role only for both tables (no anon policies).
alter table public.promo_codes enable row level security;
alter table public.ratings enable row level security;
