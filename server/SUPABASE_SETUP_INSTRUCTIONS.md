# Supabase Schema Setup Instructions

Since Supabase doesn't allow direct SQL execution via the JavaScript client for DDL statements, you need to run the schema setup manually through the Supabase dashboard.

## Steps to Set Up Schema

1. **Open Supabase Dashboard**
   - Go to: https://rzrawloihpdozkvumpye.supabase.co
   - Sign in with your Supabase account

2. **Navigate to SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - This opens a SQL query interface

3. **Run the Schema Script**
   - Open the file: `setup-supabase-schema.sql` (located in the server folder)
   - Copy the entire contents of this file
   - Paste it into the SQL Editor in Supabase
   - Click "Run" button

4. **Verify Tables Created**
   - Go to "Table Editor" in the left sidebar
   - You should see all 12 tables:
     - users
     - profiles
     - ngo_schemes
     - soil_lab
     - crop_history
     - iot_reading
     - iot_status
     - experts_info
     - farmer_forum
     - forum_posts
     - forum_replies

5. **Run Data Migration**
   - After schema is created, return to your terminal
   - Run: `node migrate-to-supabase.js`
   - This will migrate all data from SQLite to Supabase

## Verification

After running the migration script, you should see:
- ✅ 7 users migrated
- ✅ 7 profiles migrated
- ✅ 22 ngo_schemes migrated
- ✅ All other tables migrated successfully
