# Supabase Schema Setup Steps

## Step 1: Open Supabase SQL Editor

1. Go to your Supabase project: https://rzrawloihpdozkvumpye.supabase.co
2. Click on **"SQL Editor"** in the left sidebar
3. Click on **"New query"** button

## Step 2: Run the Schema SQL

1. Open the file: `setup-supabase-schema.sql` (located in the `server` folder)
2. Copy **ALL** the contents (219 lines)
3. Paste into the Supabase SQL Editor
4. Click **"Run"** button (or press Ctrl+Enter)

## Step 3: Verify Tables Created

1. Go to **"Table Editor"** in the left sidebar
2. You should see 11 tables created:
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

## Step 4: Run Data Migration

After confirming all tables are created, come back here and run:

```powershell
cd "c:\Users\devan\Desktop\sih projects\FarmIQ-functional-main - Copy\server"
node migrate-to-supabase.js
```

This will:
- Extract all data from SQLite (farmiQ.db)
- Insert into Supabase tables
- Verify migration success
- Show a summary of migrated records

## Expected Output

You should see:
```
🚀 Starting SQLite to Supabase Migration
============================================================

📊 Migrating users table...
   Found 7 users in SQLite
   ✅ Migrated 7 users

📊 Migrating profiles table...
   Found 7 profiles in SQLite
   ✅ Migrated 7 profiles

... (continues for all tables) ...

============================================================
✅ Migration completed successfully!

📋 Verification Summary:
   Users in Supabase: 7

   ✅ All 7 farmer accounts confirmed:
      - devanshusingh854@gmail.com (farmer)
      - visheshsavani@gmail.com (farmer)
      - testfarmer@example.com (farmer)
      - omkarpatil@gmail.com (vendor)
      - sumeetpandey@gmail.com (admin)
      - sushantsatelkar@gmail.com (farmer)
      - samruddhinaralkar@gmail.com (vendor)

🎉 Migration complete! You can now update database.js to use Supabase.
```

## Troubleshooting

If you get any errors during SQL execution:
- Make sure you copied the entire SQL file
- Check that you're in the correct Supabase project
- Try running the SQL in smaller chunks if needed

If data migration fails:
- Ensure all tables were created successfully
- Check the error message for which table failed
- Contact me with the specific error

## Next Steps

After successful migration, I will:
1. Refactor `database.js` to use Supabase instead of SQLite
2. Test all database operations
3. Verify backend still works properly
4. Test with frontend application
