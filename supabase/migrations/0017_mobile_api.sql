-- Store API Connection: lets the RM Mangoes mobile app authenticate against
-- this website (the single source of truth) with a long-lived Bearer token
-- instead of the admin password. The website never hands out the raw key
-- again after creation — only its SHA-256 hash is stored.

create table if not exists public.store_api_keys (
  id           uuid primary key default gen_random_uuid(),
  label        text not null default 'Mobile App',
  key_hash     text not null unique,   -- sha256(raw key), hex
  key_prefix   text not null,          -- first chars of the raw key, for display only
  created_at   timestamptz not null default now(),
  last_used_at timestamptz,
  revoked_at   timestamptz
);

create index if not exists store_api_keys_active_idx
  on public.store_api_keys (key_hash) where revoked_at is null;

-- One row per app install that has registered itself with a given key.
create table if not exists public.mobile_devices (
  id               uuid primary key default gen_random_uuid(),
  api_key_id       uuid not null references public.store_api_keys (id) on delete cascade,
  device_id        text not null,   -- client-generated stable install id
  device_name      text,
  platform         text,            -- 'ios' | 'android'
  app_version      text,
  last_sync_at     timestamptz,
  created_at       timestamptz not null default now(),
  disconnected_at  timestamptz,
  unique (api_key_id, device_id)
);

create index if not exists mobile_devices_key_idx on public.mobile_devices (api_key_id);

-- Every request the mobile API middleware handles, authorized or not —
-- powers both the audit trail and the rolling-window rate limit.
create table if not exists public.mobile_api_logs (
  id           uuid primary key default gen_random_uuid(),
  api_key_id   uuid references public.store_api_keys (id) on delete set null,
  device_id    text,
  platform     text,
  app_version  text,
  ip           text,
  method       text not null,
  path         text not null,
  status_code  integer,
  created_at   timestamptz not null default now()
);

create index if not exists mobile_api_logs_key_time_idx
  on public.mobile_api_logs (api_key_id, created_at desc);

-- ── Row Level Security ──────────────────────────────────────────────────────
-- Same convention as the rest of the schema: RLS on, no policies, so only the
-- service-role key (used by the admin dashboard and the middleware) can touch
-- these tables. The anon/publishable key gets nothing.
alter table public.store_api_keys enable row level security;
alter table public.mobile_devices  enable row level security;
alter table public.mobile_api_logs enable row level security;
