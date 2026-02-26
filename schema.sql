-- ============================================================
-- LEO Platform - Vision 2026 — Production Schema v2
-- Architecture: Event-Driven, Supabase (PostgreSQL + RLS + Realtime)
-- ============================================================

-- ============================================================
-- EXTENSIONS
-- ============================================================
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm"; -- For fuzzy address search

-- ============================================================
-- 1. USERS (Extended Auth Profile)
-- Maps to auth.users. One row per system user (courier, customer, dispatcher).
-- ============================================================
create table if not exists profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  role text not null check (role in ('courier', 'customer', 'dispatcher', 'admin', 'cx')),
  full_name text,
  phone text unique,
  avatar_url text,
  company_id uuid, -- FK added after companies table
  fcm_token text,  -- Firebase Cloud Messaging token for push notifications
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- 2. COMPANIES (Logistics Providers / Partners)
-- ============================================================
create table if not exists companies (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  logo_url text,
  contract_type text check (contract_type in ('b2b_partner', 'direct', 'franchise')),
  created_at timestamptz default now()
);

alter table profiles add constraint fk_profiles_company
  foreign key (company_id) references companies(id) on delete set null;

-- ============================================================
-- 3. SECTORS (Delivery Zones)
-- ============================================================
create table if not exists sectors (
  id text primary key, -- e.g. 'WWA-WOLA-01'
  city text not null,
  district text not null,
  geo_bounds jsonb, -- { "type": "Polygon", "coordinates": [...] }
  assigned_courier_id uuid references profiles(id),
  max_capacity integer default 80,
  created_at timestamptz default now()
);

-- ============================================================
-- 4. ROUTES (Daily Delivery Plans)
-- One route per courier per day. Contains ordered list of stops.
-- ============================================================
create table if not exists routes (
  id uuid default gen_random_uuid() primary key,
  courier_id uuid references profiles(id) not null,
  sector_id text references sectors(id),
  date date not null default current_date,
  status text check (status in ('planned', 'active', 'completed', 'cancelled')) default 'planned',

  -- LEO Engine output
  ordered_package_ids uuid[], -- Optimized stop sequence
  total_distance_km float,
  estimated_duration_minutes integer,
  actual_start_time timestamptz,
  actual_end_time timestamptz,

  -- Realtime sync
  engine_version text default 'v1-matrix',
  last_recalculated_at timestamptz,

  created_at timestamptz default now(),
  unique(courier_id, date)
);

-- ============================================================
-- 5. IPO — Intelligent Recipient Profile (Inteligentny Profil Odbiorcy)
-- Linked to auth.users for customers. Survives across all packages.
-- ============================================================
create table if not exists ipo_profiles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade unique,
  phone text,
  email text,

  -- Smart Delivery Instructions (shared with courier)
  intercom_code text,
  gate_code text,
  entrance_instructions text,
  floor_number text,
  has_elevator boolean default true,
  parking_tip text,
  dog_warning boolean default false,
  custom_note text,

  -- Plan B Preferences (priority order)
  plan_b_primary text check (plan_b_primary in ('door', 'neighbor', 'locker', 'pudo', 'delay', 'return')),
  plan_b_secondary text,
  plan_b_metadata jsonb,
  -- e.g. { "neighbor_name": "Jan K.", "neighbor_flat": "12", "locker_id": "WWA-PACZKOMAT-01" }

  -- Preferred delivery window
  preferred_window_from time, -- e.g. "08:00"
  preferred_window_to time,   -- e.g. "12:00"

  -- Privacy
  share_location_with_courier boolean default true,
  notify_15min_before boolean default true,
  notify_on_delivered boolean default true,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- 6. PACKAGES (Core Entity)
-- ============================================================
create table if not exists packages (
  id uuid default gen_random_uuid() primary key,
  tracking_number text unique not null,
  company_id uuid references companies(id),
  courier_id uuid references profiles(id),
  route_id uuid references routes(id),
  sector_id text references sectors(id),

  -- Recipient (raw data, fallback if no IPO)
  recipient_name text not null,
  recipient_phone text,
  recipient_address text not null,
  recipient_user_id uuid references profiles(id), -- null if no LEO account
  ipo_profile_id uuid references ipo_profiles(id),

  -- Parcel Details
  weight_kg float,
  size text check (size in ('XS','S','M','L','XL','XXL')),
  is_cod boolean default false, -- Cash on delivery
  cod_amount numeric(10,2),     -- Amount in PLN
  cod_status text check (cod_status in ('pending', 'collected', 'failed')) default 'pending',
  requires_signature boolean default false,

  -- Status Machine
  status text check (status in (
    'pending', 'sorted', 'loaded', 'in_transit',
    'near_delivery', 'at_door', 'delivered',
    'failed_attempt', 'plan_b_active', 'returned', 'exception'
  )) default 'pending',
  sub_status text, -- Human-readable e.g. "Kurier 2 minuty od Ciebie"

  -- Dynamic 15-minute windows (recalculated by LEO Engine)
  window_start timestamptz,
  window_end timestamptz,
  sequence_number integer, -- Position in today's route

  -- GPS Destination
  geo_lat double precision,
  geo_lng double precision,

  -- Plan B
  current_plan_b text,
  is_plan_b_active boolean default false,
  plan_b_triggered_at timestamptz,

  -- Delay tracking
  current_delay_minutes integer default 0,

  -- Metadata
  metadata jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Index for fast courier dashboard queries
create index if not exists idx_packages_courier_date
  on packages(courier_id, (window_start::date));

create index if not exists idx_packages_status
  on packages(status);

create index if not exists idx_packages_tracking
  on packages(tracking_number);

-- ============================================================
-- 7. PACKAGE EVENTS (Immutable Audit Log / Event Stream)
-- This IS the event-driven core. Every state change = a new event row.
-- Supabase Realtime listens here and fans out to websocket clients.
-- ============================================================
create table if not exists package_events (
  id uuid default gen_random_uuid() primary key,
  package_id uuid references packages(id) on delete cascade,
  route_id uuid references routes(id),
  courier_id uuid references profiles(id),

  event_type text not null,
  -- Core events:
  -- 'package_scanned'     | courier scanned at hub or vehicle
  -- 'route_started'       | courier started driving
  -- 'approaching_15min'   | LEO Engine: 15 min ETA → triggers push
  -- 'at_door'             | courier marked arrived
  -- 'delivered'           | confirmed delivery
  -- 'failed_attempt'      | nobody home, etc.
  -- 'plan_b_triggered'    | customer or system activated Plan B
  -- 'plan_b_executed'     | Plan B completed
  -- 'window_recalculated' | LEO Engine updated delivery window
  -- 'cod_collected'       | COD payment confirmed via Przelewy24
  -- 'customer_plan_b_set' | customer changed Plan B preference
  -- 'exception_raised'    | courier raised exception (address issue etc.)
  -- 'exception_resolved'  | dispatcher resolved exception

  payload jsonb not null default '{}',
  -- Examples:
  -- { "scan_code": "ABC123", "location": { "lat": 52.23, "lng": 21.01 } }
  -- { "new_window_start": "14:15", "new_window_end": "14:30", "delay_min": 5 }
  -- { "plan_b": "neighbor", "neighbor_flat": "12" }

  created_at timestamptz default now()
);

-- Critical: enables Supabase Realtime to publish inserts
alter table package_events replica identity full;

create index if not exists idx_events_package_id
  on package_events(package_id, created_at desc);

create index if not exists idx_events_type_courier
  on package_events(event_type, courier_id, created_at desc);

-- ============================================================
-- 8. COURIER LIVE STATUS (Realtime GPS Beacon)
-- Upserted every ~5 seconds from the courier PWA via Service Worker.
-- Supabase Realtime publishes this to relevant dispatcher/customer clients.
-- ============================================================
create table if not exists courier_locations (
  courier_id uuid references profiles(id) primary key,
  lat double precision not null,
  lng double precision not null,
  heading float,         -- Direction in degrees
  speed_kmh float,
  accuracy_m float,      -- GPS accuracy in meters
  battery_pct integer,
  is_driving boolean default true,
  current_package_id uuid references packages(id),
  last_updated timestamptz default now()
);

alter table courier_locations replica identity full;

-- ============================================================
-- 9. ADDRESS INTELLIGENCE (Accumulated Smart Data)
-- Populated from IPO profiles and delivery history.
-- ============================================================
create table if not exists address_intelligence (
  id uuid default gen_random_uuid() primary key,
  address_hash text unique not null, -- sha256 of normalized address string
  raw_address text,
  normalized_address text,
  geo_lat double precision,
  geo_lng double precision,

  -- Learned nuances
  nuances jsonb default '{}',
  -- e.g. { "intercom": "34", "gate_code": "#1234", "best_time": "morning",
  --        "dog": true, "elevator": false, "avg_at_door_seconds": 45 }

  delivery_count integer default 0,
  success_count integer default 0,
  avg_at_door_seconds float,

  updated_at timestamptz default now()
);

-- ============================================================
-- 10. EXCEPTIONS (Dispatcher Queue)
-- Created by courier, resolved by dispatcher.
-- ============================================================
create table if not exists exceptions (
  id uuid default gen_random_uuid() primary key,
  package_id uuid references packages(id),
  courier_id uuid references profiles(id),
  assigned_dispatcher_id uuid references profiles(id),

  type text not null check (type in (
    'address_not_found', 'access_denied', 'recipient_absent',
    'cod_refused', 'damaged_parcel', 'wrong_address', 'dog_attack', 'other'
  )),
  status text check (status in ('open', 'in_review', 'resolved', 'escalated')) default 'open',
  priority text check (priority in ('low', 'medium', 'high', 'critical')) default 'medium',

  courier_note text,
  dispatch_resolution text,
  photo_url text, -- S3/Supabase Storage

  created_at timestamptz default now(),
  resolved_at timestamptz
);

-- ============================================================
-- 11. SECTOR SCORES (Gamification / Performance)
-- ============================================================
create table if not exists sector_scores (
  id uuid default gen_random_uuid() primary key,
  courier_id uuid references profiles(id),
  sector_id text references sectors(id),
  date date not null default current_date,

  parcels_delivered integer default 0,
  parcels_failed integer default 0,
  first_attempt_success_rate float,
  avg_at_door_seconds float,
  customer_rating_avg float,
  quality_score float check (quality_score >= 0 and quality_score <= 100),

  unique(courier_id, sector_id, date)
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

alter table profiles enable row level security;
alter table ipo_profiles enable row level security;
alter table packages enable row level security;
alter table package_events enable row level security;
alter table courier_locations enable row level security;
alter table routes enable row level security;
alter table exceptions enable row level security;

-- PROFILES: Users see only their own profile
create policy "profiles_self_read" on profiles
  for select using (auth.uid() = id);

create policy "profiles_self_update" on profiles
  for update using (auth.uid() = id);

-- Admin sees all profiles
create policy "profiles_admin_all" on profiles
  for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- IPO: Customers see only their own IPO
create policy "ipo_self" on ipo_profiles
  for all using (user_id = auth.uid());

-- Couriers can read IPO of packages assigned to them
create policy "ipo_courier_read" on ipo_profiles
  for select using (
    exists (
      select 1 from packages p
      where p.ipo_profile_id = ipo_profiles.id
      and p.courier_id = auth.uid()
    )
  );

-- PACKAGES: Couriers see packages on their route
create policy "packages_courier_select" on packages
  for select using (courier_id = auth.uid());

-- Customers see only their own packages
create policy "packages_customer_select" on packages
  for select using (recipient_user_id = auth.uid());

-- Dispatchers see all packages
create policy "packages_dispatcher_select" on packages
  for select using (
    exists (select 1 from profiles where id = auth.uid() and role in ('dispatcher', 'admin', 'cx'))
  );

-- Couriers can update status on their own packages
create policy "packages_courier_update" on packages
  for update using (courier_id = auth.uid());

-- PACKAGE EVENTS: Couriers can insert events for their packages
create policy "events_courier_insert" on package_events
  for insert with check (courier_id = auth.uid());

-- Everyone can read events for their packages
create policy "events_courier_read" on package_events
  for select using (courier_id = auth.uid());

create policy "events_customer_read" on package_events
  for select using (
    exists (
      select 1 from packages p
      where p.id = package_events.package_id
      and p.recipient_user_id = auth.uid()
    )
  );

-- COURIER LOCATIONS: Couriers update their own location
create policy "location_courier_upsert" on courier_locations
  for all using (courier_id = auth.uid());

-- Dispatchers see all locations
create policy "location_dispatcher_read" on courier_locations
  for select using (
    exists (select 1 from profiles where id = auth.uid() and role in ('dispatcher', 'admin'))
  );

-- Customers see courier location only if package is 'near_delivery' or 'at_door'
create policy "location_customer_read" on courier_locations
  for select using (
    exists (
      select 1 from packages p
      where p.courier_id = courier_locations.courier_id
      and p.recipient_user_id = auth.uid()
      and p.status in ('near_delivery', 'at_door')
    )
  );

-- ROUTES: Couriers see their own routes
create policy "routes_courier" on routes
  for select using (courier_id = auth.uid());

create policy "routes_dispatcher" on routes
  for all using (
    exists (select 1 from profiles where id = auth.uid() and role in ('dispatcher', 'admin'))
  );

-- EXCEPTIONS: Couriers create, dispatchers resolve
create policy "exceptions_courier_insert" on exceptions
  for insert with check (courier_id = auth.uid());

create policy "exceptions_courier_read" on exceptions
  for select using (courier_id = auth.uid());

create policy "exceptions_dispatcher_all" on exceptions
  for all using (
    exists (select 1 from profiles where id = auth.uid() and role in ('dispatcher', 'admin', 'cx'))
  );

-- ============================================================
-- TRIGGERS: Auto-update `updated_at` timestamps
-- ============================================================
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger packages_updated_at
  before update on packages
  for each row execute function update_updated_at();

create trigger ipo_updated_at
  before update on ipo_profiles
  for each row execute function update_updated_at();

create trigger profiles_updated_at
  before update on profiles
  for each row execute function update_updated_at();

-- ============================================================
-- SEED DATA
-- ============================================================
insert into companies (name, contract_type) values
  ('DPD', 'b2b_partner'),
  ('DHL', 'b2b_partner'),
  ('InPost', 'b2b_partner'),
  ('LEO Direct', 'direct')
on conflict do nothing;

insert into sectors (id, city, district, max_capacity) values
  ('WWA-WOLA-01', 'Warszawa', 'Wola', 85),
  ('WWA-CENTRUM-01', 'Warszawa', 'Centrum', 90),
  ('WWA-MOKOTOW-01', 'Warszawa', 'Mokotów', 75),
  ('KRK-SRODMIESCIE-01', 'Kraków', 'Śródmieście', 80)
on conflict do nothing;
