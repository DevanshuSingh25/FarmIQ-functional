-- Add new columns to profiles table for enhanced registration
ALTER TABLE profiles ADD COLUMN location TEXT;
ALTER TABLE profiles ADD COLUMN crops_grown TEXT;
ALTER TABLE profiles ADD COLUMN available_quantity TEXT;
ALTER TABLE profiles ADD COLUMN expected_price TEXT;
