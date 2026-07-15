-- Product stock levels, managed from /admin and decremented by the Stripe
-- webhook when an order is paid. Product ids mirror src/lib/site.ts.

create table if not exists public.product_stock (
  product_id  text primary key,
  stock       integer not null default 0 check (stock >= 0),
  updated_at  timestamptz not null default now()
);

-- Seed one row per catalogue product (idempotent). Default 100 boxes each —
-- adjust real numbers in /admin.
insert into public.product_stock (product_id, stock) values
  ('small-1', 100),
  ('small-2', 100),
  ('small-3', 100),
  ('medium-1', 100),
  ('medium-2', 100),
  ('large-1', 100)
on conflict (product_id) do nothing;

-- Atomic decrement used by the webhook: never lets stock go below zero and
-- reports whether anything was actually decremented.
create or replace function public.decrement_stock(pid text, qty integer)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  updated integer;
begin
  update public.product_stock
     set stock = stock - qty,
         updated_at = now()
   where product_id = pid
     and stock >= qty;
  get diagnostics updated = row_count;
  return updated > 0;
end;
$$;

-- Lock the function down to service-role callers only.
revoke execute on function public.decrement_stock(text, integer) from public, anon, authenticated;

alter table public.product_stock enable row level security;

-- Anyone may READ stock (needed for sold-out labels on the shop); only the
-- service role (webhook + admin API) may write — no insert/update policies.
drop policy if exists "public can read stock" on public.product_stock;
create policy "public can read stock" on public.product_stock
  for select using (true);
