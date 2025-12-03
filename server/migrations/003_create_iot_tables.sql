-- Migration: Create IoT Sensor Booking Tables
-- Created: 2025-12-02
-- Description: Add iot_reading and iot_status tables for IoT sensor installation booking system

-- Enable foreign keys (ensure referential integrity)
PRAGMA foreign_keys = ON;

-- 1) iot_reading: Stores sensor installation booking requests
CREATE TABLE IF NOT EXISTS iot_reading (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,                     -- foreign key reference to users.id
  name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  location TEXT,                                -- free text location (GPS coords or address)
  state TEXT,
  district TEXT,
  preferred_visit_date TEXT,                    -- ISO date string (YYYY-MM-DD)
  status TEXT DEFAULT 'pending',                -- status: pending / acknowledged / completed / cancelled
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_iot_reading_user_id ON iot_reading(user_id);

-- 2) iot_status: Stores current sensor status for each user
CREATE TABLE IF NOT EXISTS iot_status (
  user_id INTEGER PRIMARY KEY,                  -- user id (same as users.id)
  status TEXT NOT NULL DEFAULT 'inactive',      -- allowed values: 'inactive', 'active', 'booked'
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Verification queries (commented out - for manual testing)
-- SELECT name FROM sqlite_master WHERE type='table' AND name IN ('iot_reading', 'iot_status');
-- PRAGMA table_info(iot_reading);
-- PRAGMA table_info(iot_status);
