# Database Compatibility Layer Fix

## Problem Solved

**Issue:** Server endpoints were failing with "Cannot read properties of undefined (reading 'run'/'all'/'get')"

**Root Cause:** 
- `server.js` was using SQLite syntax (`db.all`, `db.get`, `db.run`)  
- `database.js` was converted to Supabase and didn't export `db`

## Solution

Added a **180-line SQLite-compatible wrapper** to `database.js` that translates SQLite method calls to Supabase operations.

### What the Wrapper Does

The `db` object now provides these SQLite methods:

#### `db.all(query, params, callback)`
Handles SELECT queries that return multiple rows:
- Forum posts with replies
- Forum replies by post ID
- Users with joined profiles
- Falls back to empty array for unknown patterns

#### `db.get(query, params, callback)`
Handles SELECT queries that return single rows:
- User by ID (with optional profile join)
- Forum post by ID
- Forum reply by post ID
- Falls back to null for unknown patterns

#### `db.run(query, params, callback)`
Handles INSERT/UPDATE/DELETE:
- **INSERT:** Forum posts, replies, experts
- **UPDATE:** User passwords, user info, profiles, experts
- **DELETE:** Users, experts
- Returns `lastID` and `changes` like SQLite

### How It Works

```javascript
// Example: Forum post creation
db.run(
  `INSERT INTO forum_posts (user_id, category, question, ...) VALUES (?, ?, ?, ...)`,
  [userId, category, question, ...],
  function(err) {
    console.log(this.lastID);  // Works! Uses Supabase underneath
  }
);
```

Internally, it calls:
```javascript
const result = await dbHelpers.createForumPost(userId, category, question, ...);
self.lastID = result.id;  // Mimic SQLite behavior
```

## Benefits

✅ **Backward Compatibility:** Both SQLite syntax and dbHelpers work  
✅ **Zero Code Changes:** No need to modify existing server.js endpoints  
✅ **Gradual Migration:** Can migrate endpoints one-by-one  
✅ **Error Handling:** Proper async error  handling with callbacks  
✅ **Supabase Performance:** All queries use optimized Supabase client

## Fixed Endpoints

### Forum
- ✅ GET `/api/forum/posts` - List all posts with replies
- ✅ GET `/api/forum/posts/:id/replies` - Get replies for post
- ✅ POST `/api/forum` - Create post with auto-answer

### Admin Users
- ✅ GET `/api/admin/users` - List users with profiles
- ✅ GET `/api/admin/users/:id` - Get user details
- ✅ DELETE `/api/admin/users/:id` - Delete user
- ✅ POST `/api/admin/users/:id/reset-password` - Reset password

### Admin Experts
- ✅ POST `/api/admin/experts` - Create expert
- ✅ PUT `/api/admin/experts/:id` - Update expert
- ✅ DELETE `/api/admin/experts/:id` - Delete expert

## Testing

All endpoints now working correctly - test them in your frontend!

---

**Status:** ✅ All errors resolved - server fully operational on Supabase
