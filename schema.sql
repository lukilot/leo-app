-- LEO Platform - Vision 2026 Database Schema

-- 1. Companies (Logistics Providers)
create table if not exists companies (
  id uuid default gen_random_uuid() primary key,
  name text not null unique, -- DPD, DHL, InPost, LEO B2C
  logo_url text,
  created_at timestamp with time zone default now()
);

-- 2. Recipient Profiles (IPO - Intelligent Patient Order)
create table if not exists recipient_profiles (
  id uuid default gen_random_uuid() primary key,
  phone text unique,
  email text unique,
  full_name text,
  
  -- IPO Intelligent Data
  intercom_code text,
  entrance_instructions text, -- "Entry from the yard", "Gate B"
  floor_number text,
  has_elevator boolean default true,
  
  -- Plan B Preferences
  default_plan_b text check (default_plan_b in ('door', 'neighbor', 'locker', 'pudo', 'delay')),
  plan_b_metadata jsonb, -- { "neighbor_phone": "...", "locker_id": "..." }
  
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 3. Packages (Enhanced)
create table if not exists packages (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  tracking_number text unique not null,
  company_id uuid references companies(id),
  courier_id uuid references auth.users(id),
  recipient_profile_id uuid references recipient_profiles(id),
  
  -- Recipient Info (Fallback if no IPO)
  recipient_name text not null,
  recipient_address text not null,
  recipient_phone text,
  
  -- Status & Tracking
  status text check (status in ('pending', 'sorted', 'in_transit', 'delivered', 'failed', 'returned')) default 'pending',
  sub_status text, -- "At the door", "Delayed by traffic"
  
  -- Delivery Windows (15-min slots)
  window_start timestamp with time zone,
  window_end timestamp with time zone,
  
  -- Location (Destination)
  geo_lat double precision,
  geo_lng double precision,
  
  -- Plan B logic
  current_plan_b text, 
  is_plan_b_active boolean default false,
  
  metadata jsonb, -- For any extra firm-specific data
  current_delay_minutes integer default 0,
  sector_id text
);

-- 4. Package Events (System of Events)
create table if not exists package_events (
  id uuid default gen_random_uuid() primary key,
  package_id uuid references packages(id),
  event_type text not null, -- 'scanned', 'route_start', 'near_delivery', 'plan_b_triggered', 'delivered'
  payload jsonb,
  created_at timestamp with time zone default now()
);

-- 5. Courier Real-time Status
create table if not exists courier_status (
  courier_id uuid references auth.users(id) primary key,
  current_lat double precision,
  current_lng double precision,
  speed double precision,
  battery_level int,
  last_updated timestamp with time zone default now()
);

-- 6. Address Intelligence (IPO+)
create table if not exists address_intelligence (
  id uuid default gen_random_uuid() primary key,
  address_hash text unique not null,
  formatted_address text,
  nuances jsonb, -- { "gate_code": "123", "best_entrance": "side", "parking_tips": "easy" }
  historical_at_door_avg interval,
  updated_at timestamp with time zone default now()
);

-- 7. Sector Scores (Mój Rejon)
create table if not exists sector_scores (
  id uuid default gen_random_uuid() primary key,
  courier_id uuid references auth.users(id),
  sector_id text not null, -- 'Warszawa-Wola', 'Kraków-Centrum'
  quality_score float check (quality_score >= 0 and quality_score <= 100),
  parcels_delivered_total integer default 0,
  unique(courier_id, sector_id)
);

-- RLS & Policies (Selective Visibility)

alter table companies enable row level security;
alter table recipient_profiles enable row level security;
alter table packages enable row level security;
alter table package_events enable row level security;
alter table courier_status enable row level security;

-- Global Read for Demo (Simplification)
create policy "Allow public read for demo" on packages for select using (true);
create policy "Allow public read for IPO" on recipient_profiles for select using (true);

-- INITIAL SEED DATA
insert into companies (name) values ('DPD'), ('DHL'), ('InPost'), ('LEO Direct') on conflict do nothing;
