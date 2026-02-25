-- 1. Create a table for Packages
create table if not exists packages (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  tracking_number text unique not null,
  courier_id uuid references auth.users(id),
  recipient_name text not null,
  recipient_address text not null,
  status text check (status in ('pending', 'in_transit', 'delivered', 'failed')) default 'pending',
  estimated_delivery_time timestamp with time zone,
  geo_lat double precision,
  geo_lng double precision,
  notes text,
  plan_b_choice text -- e.g., 'door', 'neighbor', 'access_point'
);

-- 2. Enable Row Level Security (RLS)
alter table packages enable row level security;

-- 3. Create Policies
-- Couriers can see packages assigned to them
create policy "Couriers can view assigned packages"
  on packages for select
  using (auth.uid() = courier_id);

-- Couriers can update status of assigned packages
create policy "Couriers can update assigned packages"
  on packages for update
  using (auth.uid() = courier_id);

-- (For demo purposes) Allow public read access to packages via tracking number (simplification for "Customer App")
-- In real app, we would use a separate "recipient_token" or specific auth logic.
create policy "Public can view package by tracking number"
  on packages for select
  using (true); 

-- 4. Seed some data (Mock Data for Demo)
insert into packages (tracking_number, recipient_name, recipient_address, status, estimated_delivery_time, geo_lat, geo_lng, notes)
values
  ('LEO-849201', 'Jan Kowalski', 'Marszałkowska 1, Warszawa', 'in_transit', now() + interval '2 hours', 52.2297, 21.0122, 'Kod: 1234'),
  ('LEO-991234', 'Anna Nowak', 'Złota 44, Warszawa', 'pending', now() + interval '4 hours', 52.2319, 21.0067, 'Winda towarowa');
