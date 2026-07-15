-- RM Mangoes — orders schema
-- customers 1 ─< orders 1 ─< order_items
-- Written to be safe to re-run (idempotent where practical).

create extension if not exists "pgcrypto";

-- ── customers ───────────────────────────────────────────────────────────────
create table if not exists public.customers (
  id          uuid primary key default gen_random_uuid(),
  full_name   text,
  email       text not null,
  phone       text,
  created_at  timestamptz not null default now()
);

-- One customer record per email (webhook upserts against this).
create unique index if not exists customers_email_key on public.customers (lower(email));

-- ── orders ──────────────────────────────────────────────────────────────────
create table if not exists public.orders (
  id                    uuid primary key default gen_random_uuid(),
  customer_id           uuid references public.customers (id) on delete set null,
  stripe_session_id     text unique,
  stripe_payment_intent text,
  total                 integer not null default 0,   -- pence
  currency              text not null default 'gbp',
  payment_status        text,                          -- from Stripe (e.g. 'paid')
  order_status          text not null default 'Pending',
  delivery_name         text,
  delivery_phone        text,
  delivery_address      text,
  delivery_city         text,
  delivery_county       text,
  delivery_postcode     text,
  delivery_country      text,
  created_at            timestamptz not null default now()
);

create index if not exists orders_customer_id_idx on public.orders (customer_id);
create index if not exists orders_created_at_idx on public.orders (created_at desc);

-- Constrain order_status to the fulfilment states used by the admin page.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'orders_order_status_check'
  ) then
    alter table public.orders
      add constraint orders_order_status_check
      check (order_status in ('Pending','Confirmed','Packing','Dispatched','Delivered','Cancelled'));
  end if;
end $$;

-- ── order_items ─────────────────────────────────────────────────────────────
create table if not exists public.order_items (
  id           uuid primary key default gen_random_uuid(),
  order_id     uuid not null references public.orders (id) on delete cascade,
  product_name text not null,
  quantity     integer not null,
  unit_price   integer not null,   -- pence
  total_price  integer not null    -- pence
);

create index if not exists order_items_order_id_idx on public.order_items (order_id);

-- ── Row Level Security ──────────────────────────────────────────────────────
-- Lock everything down. Reads/writes happen only via the service-role key
-- (webhook + admin), which bypasses RLS. The public/anon key gets nothing,
-- so customer PII is never exposed to the browser.
alter table public.customers   enable row level security;
alter table public.orders      enable row level security;
alter table public.order_items enable row level security;

-- No policies are created on purpose: with RLS enabled and no policy, the anon
-- and authenticated roles are denied all access by default.
