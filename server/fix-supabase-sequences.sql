-- Fix Supabase Sequences After Migration
-- Run this in Supabase SQL Editor

-- This fixes the "duplicate key value violates unique constraint" errors
-- that occur after migrating data from SQLite

-- Reset forum_posts sequence
SELECT setval('forum_posts_id_seq', (SELECT MAX(id) FROM forum_posts));

-- Reset forum_replies sequence  
SELECT setval('forum_replies_id_seq', (SELECT MAX(id) FROM forum_replies));

-- Reset all other sequences to be safe
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('ngo_schemes_id_seq', (SELECT MAX(id) FROM ngo_schemes));
SELECT setval('soil_lab_id_seq', (SELECT MAX(id) FROM soil_lab));
SELECT setval('crop_history_id_seq', (SELECT MAX(id) FROM crop_history));
SELECT setval('iot_reading_id_seq', (SELECT MAX(id) FROM iot_reading));
-- Note: iot_status uses user_id as primary key, not id, so no sequence to reset
SELECT setval('experts_info_id_seq', (SELECT MAX(id) FROM experts_info));
SELECT setval('farmer_forum_id_seq', (SELECT MAX(id) FROM farmer_forum));

-- Verify sequences are set correctly
SELECT 'forum_posts', last_value FROM forum_posts_id_seq
UNION ALL SELECT 'forum_replies', last_value FROM forum_replies_id_seq
UNION ALL SELECT 'users', last_value FROM users_id_seq
UNION ALL SELECT 'ngo_schemes', last_value FROM ngo_schemes_id_seq
UNION ALL SELECT 'soil_lab', last_value FROM soil_lab_id_seq
UNION ALL SELECT 'crop_history', last_value FROM crop_history_id_seq
UNION ALL SELECT 'iot_reading', last_value FROM iot_reading_id_seq
UNION ALL SELECT 'experts_info', last_value FROM experts_info_id_seq
UNION ALL SELECT 'farmer_forum', last_value FROM farmer_forum_id_seq;
