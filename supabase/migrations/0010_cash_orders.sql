-- Cash-on-delivery support: track how the order will be paid and, for cash,
-- how much the driver should expect and how much change to bring.
alter table public.orders
  add column if not exists payment_method text not null default 'card',
  add column if not exists cash_tendered integer,   -- pence the customer says they'll hand over
  add column if not exists change_due integer;      -- pence the driver should bring back

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'orders_payment_method_check') then
    alter table public.orders
      add constraint orders_payment_method_check check (payment_method in ('card', 'cash'));
  end if;
end $$;
