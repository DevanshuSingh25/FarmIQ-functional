# Quick Start Guide for Supabase Migration

## Current Status

✅ **Completed:**
1. Supabase client configuration created (`supabase-client.js`)
2. Complete SQL schema file ready (`setup-supabase-schema.sql`)
3. Data migration script ready (`migrate-to-supabase.js`)
4. All database helper functions prepared for refactoring

## What You Need to Do Now

### Step 1: Execute SQL Schema in Supabase (2 minutes)

1. Open your Supabase dashboard: https://rzrawloihpdozkvumpye.supabase.co
2. Click **"SQL Editor"** → **"New query"**
3. Open file: `server/setup-supabase-schema.sql`
4. Copy all 219 lines and paste into Supabase SQL Editor
5. Click **"Run"** 

✅ **Expected result:** 11 tables created (users, profiles, ngo_schemes, soil_lab, crop_history, iot_reading, iot_status, experts_info, farmer_forum, forum_posts, forum_replies)

### Step 2: Migrate Data from SQLite to Supabase (1 minute)

After schema is created, run:

```powershell
cd "c:\Users\devan\Desktop\sih projects\FarmIQ-functional-main - Copy\server"
node migrate-to-supabase.js
```

✅ **Expected output:**
```
✅ Migrated 7 users
✅ Migrated 7 profiles  
✅ Migrated 22 ngo_schemes
... (all other tables)
✅ All 7 farmer accounts confirmed
```

### Step 3: Let Me Know When Done

Reply with "schema created and data migrated" and I will:
1. Replace `database.js` with Supabase version
2. Test all database operations
3. Verify backend still works
4. Run full system test with frontend

## Files Ready and Waiting

- ✅ `supabase-client.js` - Supabase connection
- ✅ `setup-supabase-schema.sql` - SQL to run  
- ✅ `migrate-to-supabase.js` - Data migration script
- ⏳ `database.js` - Will be replaced after you confirm migration success

## Troubleshooting

**If SQL execution fails:**
- Ensure you're in the correct Supabase project
- Check you copied the entire SQL file
- Look for specific error messages

**If migration script fails:**
- Ensure all tables were created in Supabase
- Check the error message for which table failed
- Provide me with the exact error message

---

**After this is complete, the entire backend will use Supabase!**
No frontend changes needed - all APIs remain identical.
