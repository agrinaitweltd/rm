-- Tracks failed admin login attempts so the password gate can be rate
-- limited — previously any number of guesses could be made with no cooldown.
create table if not exists public.admin_login_attempts (
  id         uuid primary key default gen_random_uuid(),
  ip         text,
  created_at timestamptz not null default now()
);

create index if not exists admin_login_attempts_time_idx on public.admin_login_attempts (created_at desc);

alter table public.admin_login_attempts enable row level security;
-- No policies: service-role only, same convention as the rest of the schema.
