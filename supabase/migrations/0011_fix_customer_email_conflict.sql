-- Bug fix: customers had a unique index on lower(email), but the app's
-- upsert used ON CONFLICT (email) — Postgres requires the conflict target to
-- match a real constraint/index on the exact column list given, and an
-- expression index on lower(email) does NOT satisfy ON CONFLICT (email). That
-- upsert has been failing outright on every brand-new email (masked whenever
-- a matching row happened to already exist, since the app falls back to a
-- plain SELECT on failure) — this is what surfaced as "Sorry, we couldn't
-- place your order" on cash checkout, and would affect the card path too.
--
-- Fix: normalize existing emails to lowercase and replace the expression
-- index with a real unique constraint on the plain column, so ON CONFLICT
-- (email) is valid. The application now sends already-lowercased emails.

update public.customers set email = lower(trim(email));

drop index if exists public.customers_email_key;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'customers_email_key'
  ) then
    alter table public.customers add constraint customers_email_key unique (email);
  end if;
end $$;
