-- FarmIQ Database Schema for Supabase
-- This script creates all tables matching the SQLite schema

-- Drop existing tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS forum_replies CASCADE;
DROP TABLE IF EXISTS forum_posts CASCADE;
DROP TABLE IF EXISTS farmer_forum CASCADE;
DROP TABLE IF EXISTS experts_info CASCADE;
DROP TABLE IF EXISTS iot_status CASCADE;
DROP TABLE IF EXISTS iot_reading CASCADE;
DROP TABLE IF EXISTS crop_history CASCADE;
DROP TABLE IF EXISTS soil_lab CASCADE;
DROP TABLE IF EXISTS ngo_schemes CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. Users table (parent table)
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'farmer',
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX idx_users_email ON users (email);

-- 2. Profiles table (references users)
CREATE TABLE profiles (
  id BIGINT PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  phone_number TEXT,
  language_pref TEXT DEFAULT 'en',
  location TEXT,
  crops_grown TEXT,
  available_quantity TEXT,
  expected_price TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. NGO Schemes table
CREATE TABLE ngo_schemes (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  ministry TEXT,
  deadline TEXT,
  location TEXT,
  contact_number TEXT,
  no_of_docs_required INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  benefit_text TEXT,
  eligibility_text TEXT,
  scheme_type TEXT DEFAULT 'government',
  required_state TEXT,
  min_land REAL,
  max_land REAL,
  required_category TEXT,
  age_min INTEGER,
  age_max INTEGER,
  official_link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for ngo_schemes
CREATE INDEX idx_ngo_name ON ngo_schemes(name);
CREATE INDEX idx_ngo_status ON ngo_schemes(status);
CREATE INDEX idx_ngo_scheme_type ON ngo_schemes(scheme_type);
CREATE INDEX idx_ngo_required_state ON ngo_schemes(required_state);

-- 4. Soil Lab table
CREATE TABLE soil_lab (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT,
  contact_number TEXT,
  price REAL,
  rating REAL,
  tag TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for soil_lab
CREATE INDEX idx_soil_name ON soil_lab(name);
CREATE INDEX idx_soil_location ON soil_lab(location);

-- 5. Crop History table (references users)
CREATE TABLE crop_history (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,
  crop_name TEXT NOT NULL,
  crop_price REAL,
  selling_price REAL,
  crop_produced_kg REAL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create index for crop_history
CREATE INDEX idx_crop_history_user ON crop_history(user_id);

-- 6. IoT Reading table (references users)
CREATE TABLE iot_reading (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,
  name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  location TEXT,
  state TEXT,
  district TEXT,
  preferred_visit_date TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create index for iot_reading
CREATE INDEX idx_iot_reading_user_id ON iot_reading(user_id);

-- 7. IoT Status table (references users)
CREATE TABLE iot_status (
  user_id BIGINT PRIMARY KEY,
  status TEXT NOT NULL DEFAULT 'inactive',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 8. Experts Info table
CREATE TABLE experts_info (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  experience_years INTEGER NOT NULL DEFAULT 0,
  specializations TEXT,
  rating REAL DEFAULT 0.0,
  consultation_count INTEGER DEFAULT 0,
  phone_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Farmer Forum table
CREATE TABLE farmer_forum (
  id BIGSERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  highlighted_keywords TEXT,
  community TEXT NOT NULL,
  answer TEXT NOT NULL,
  expert_name TEXT NOT NULL,
  expert_role TEXT NOT NULL,
  upvotes INTEGER DEFAULT 0,
  replies INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Forum Posts table (references users)
CREATE TABLE forum_posts (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,
  category TEXT NOT NULL,
  question TEXT NOT NULL,
  community TEXT,
  status TEXT DEFAULT 'Answered',
  extracted_keywords TEXT,
  upvotes INTEGER DEFAULT 0,
  reply_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 11. Forum Replies table (references forum_posts)
CREATE TABLE forum_replies (
  id BIGSERIAL PRIMARY KEY,
  post_id BIGINT NOT NULL,
  reply_text TEXT NOT NULL,
  replied_by TEXT NOT NULL,
  upvotes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (post_id) REFERENCES forum_posts(id)
);

-- Enable Row Level Security (RLS) on all tables but we'll use service role key to bypass
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ngo_schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE soil_lab ENABLE ROW LEVEL SECURITY;
ALTER TABLE crop_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE iot_reading ENABLE ROW LEVEL SECURITY;
ALTER TABLE iot_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE experts_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE farmer_forum ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_replies ENABLE ROW LEVEL SECURITY;

-- Create permissive policies that allow all operations (service role bypasses these anyway)
-- This is just to satisfy RLS being enabled

CREATE POLICY "Allow all operations on users" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on profiles" ON profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on ngo_schemes" ON ngo_schemes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on soil_lab" ON soil_lab FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on crop_history" ON crop_history FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on iot_reading" ON iot_reading FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on iot_status" ON iot_status FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on experts_info" ON experts_info FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on farmer_forum" ON farmer_forum FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on forum_posts" ON forum_posts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on forum_replies" ON forum_replies FOR ALL USING (true) WITH CHECK (true);

-- Schema creation complete
