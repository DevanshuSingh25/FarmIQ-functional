# Vendor Dashboard Implementation - Updates and Changes

## Summary

This document details all changes made to implement the comprehensive vendor dashboard features including:
- Database schema updates (profiles table)
- Backend API routes for farmer search and QR scanning
- Frontend vendor pages (Dashboard, QR Scan, Farmer Search, Market Prices)
- Navigation and routing for vendor role

## Database Changes

### 1. Profiles Table Schema Update

**SQL Statements Executed:**
```sql
ALTER TABLE profiles ADD COLUMN crops_grown TEXT;
ALTER TABLE profiles ADD COLUMN available_quantity INTEGER;
ALTER TABLE profiles ADD COLUMN location TEXT;
ALTER TABLE profiles ADD COLUMN expected_price TEXT;
```

**Verification:**
```bash
sqlite3 server/farmiQ.db "PRAGMA table_info(profiles);"
```

**Expected Output:**
```
0|id|INTEGER|0||1
1|full_name|TEXT|0||0
2|email|TEXT|0||0
3|phone_number|TEXT|0||0
4|language_pref|TEXT|0|'en'|0
5|created_at|TEXT|0|datetime('now')|0
6|updated_at|TEXT|0|datetime('now')|0
7|crops_grown|TEXT|0||0
8|available_quantity|INTEGER|0||0
9|location|TEXT|0||0
10|expected_price|TEXT|0||0
```

### 2. Existing Tables Verified
- `crop_history` - ✓ Exists with proper schema
- `ngo_schemes` - ✓ Exists and functional
- `soil_lab` - ✓ Exists and functional

---

## Backend Changes

### 1. Database Helper Functions (`server/database.js`)

**Added `getProfiles` function:**
```javascript
// Get profiles with optional search filter (for vendor farmer search)
getProfiles: (filter = {}) => {
  return new Promise((resolve, reject) => {
    let query = `SELECT id, full_name, crops_grown, available_quantity, location, expected_price 
                 FROM profiles WHERE 1=1`;
    const params = [];
    
    // Search filter (case-insensitive substring match on name and location)
    if (filter.q) {
      query += ` AND (LOWER(full_name) LIKE ? OR LOWER(location) LIKE ?)`;
      const searchTerm = `%${filter.q.toLowerCase()}%`;
      params.push(searchTerm, searchTerm);
    }
    
    query += ` ORDER BY id DESC`;
    
    db.all(query, params, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows || []);
    });
  });
}
```

### 2. REST API Routes (`server/server.js`)

**Added Endpoints:**

#### GET /api/profiles
- **Purpose:** Farmer search for vendors
- **Authentication:** Required (any authenticated user)
- **Query Parameters:**
  - `q` (optional) - Search term for filtering by name or location
- **Response:** JSON array of profile objects

**Example Request:**
```bash
curl -b cookies.txt http://localhost:3001/api/profiles?q=John
```

#### POST /api/qr/parse
- **Purpose:** Parse QR code text for product verification
- **Authentication:** Required (any authenticated user)
- **Request Body:**
  ```json
  {
    "qr_text": "Product XYZ-123"
  }
  ```
- **Response:**
  ```json
  {
    "qr_text": "Product XYZ-123"
  }
  ```

**Example Request:**
```bash
curl -b cookies.txt -X POST http://localhost:3001/api/qr/parse \
  -H "Content-Type: application/json" \
  -d '{"qr_text":"Sample Product Data"}'
```

### 3. Existing Endpoints Verified
- `GET /api/ngo-schemes` - ✓ Working
- `GET /api/soil-labs` - ✓ Working
- `GET /api/crops` - ✓ Working (requires farmer role)
- `POST /api/crops` - ✓ Working (requires farmer role)
- `GET /api/market-prices` - ✓ Working (data.gov.in proxy)

---

## Frontend Changes

### 1. New Vendor Pages Created

#### `src/pages/vendor/qr-scan.tsx`
- **Features:**
  - QR code scanning interface (camera + image upload placeholders)
  - Product information display panel
  - API integration with `/api/qr/parse`
  - Manual input option for testing
  - JSON pretty-printing for QR results
- **Navigation:** Burger menu + top nav bar
- **Auth:** Vendor role required

#### `src/pages/vendor/farmer-search.tsx`
- **Features:**
  - Database-backed farmer search
  - Live search with query parameter (`?q=`)
  - Profile cards displaying: name, crops_grown, available_quantity, location, expected_price
  - "Connect with Farmer" button on each card
  - Client-side filtering as backup
- **API:** `GET /api/profiles`
- **Auth:** Vendor role required

#### `src/pages/vendor/market-prices.tsx`
- **Features:**
  - Crop, State, District filters (NO date filter)
  - Data from `GET /api/market-prices` (data.gov.in proxy)
  - Table columns: Market, Variety, Min Price, Max Price, Modal Price
  - CSV export functionality
  - Filter logic: omits "All" selections from API params
- **Auth:** Vendor role required

#### `src/pages/VendorDashboard.tsx` (Updated)
- **Features:**
  - Stats cards: Total Purchases, Active Orders, Crops Available, Growth Rate
  - Recent QR Scans section
  - Quick Actions grid: Scan QR, Market Prices, Search Crops, Chat Support
  - Burger menu navigation
  - Theme and language toggles
- **Auth:** Vendor role required

### 2. Routing Updated (`src/App.tsx`)

**Added Routes:**
```tsx
<Route path="/vendor/dashboard" element={<ProtectedRoute requiredRole="vendor"><VendorDashboard /></ProtectedRoute>} />
<Route path="/vendor/qr-scan" element={<ProtectedRoute requiredRole="vendor"><VendorQRScan /></ProtectedRoute>} />
<Route path="/vendor/farmer-search" element={<ProtectedRoute requiredRole="vendor"><VendorFarmerSearch /></ProtectedRoute>} />
<Route path="/vendor/market-prices" element={<ProtectedRoute requiredRole="vendor"><VendorMarketPrices /></ProtectedRoute>} />
```

### 3. Navigation Components
- All vendor pages include consistent burger menu with:
  - Dashboard
  - Farmer Search (green theme)
  - Market Price (yellow theme)
- Active page highlighting
- FarmIQ branding with Leaf icon

---

## Testing Steps

### Backend API Testing

**1. Start Backend Server:**
```bash
cd server
npm start
```

**2. Login and Save Session:**
```bash
curl -v -c cookies.txt -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"role":"vendor","email":"vendor@test.com","password":"password"}'
```

**3. Test Profiles Endpoint:**
```bash
# Get all profiles
curl -b cookies.txt http://localhost:3001/api/profiles

# Search by name
curl -b cookies.txt "http://localhost:3001/api/profiles?q=John"
```

**4. Test QR Parse Endpoint:**
```bash
curl -b cookies.txt -X POST http://localhost:3001/api/qr/parse \
  -H "Content-Type: application/json" \
  -d '{"qr_text":"Test Product ABC-456"}'
```

**5. Test Market Prices (via existing proxy):**
```bash
curl -b cookies.txt "http://localhost:3001/api/market-prices?state=Punjab&commodity=Rice"
```

### Frontend Testing

**1. Start Frontend:**
```bash
npm run dev
```

**2. Login as Vendor:**
- Navigate to `http://localhost:5173/login`
- Select "Vendor" role
- Login with test credentials

**3. Test Pages:**
- Dashboard: `/vendor/dashboard` - Verify stats, recent scans, quick actions
- QR Scan: `/vendor/qr-scan` - Test manual QR input, verify product info display
- Farmer Search: `/vendor/farmer-search` - Search for farmers, verify cards display
- Market Prices: `/vendor/market-prices` - Apply filters, verify table data, test CSV export

**4. Screenshot Locations:**
Should capture:
- Vendor Dashboard with burger menu open
- QR Scan page with result displayed
- Farmer Search results
- Market Prices table with data

---

## Changed Files

### Backend
1. `server/database.js` - Added `getProfiles` helper function
2. `server/server.js` - Added `GET /api/profiles` and `POST /api/qr/parse` routes
3. `server/farmiQ.db` - Updated schema (4 new columns in profiles table)

### Frontend
1. `src/pages/VendorDashboard.tsx` - Complete rewrite with actual dashboard
2. `src/pages/vendor/qr-scan.tsx` - NEW FILE
3. `src/pages/vendor/farmer-search.tsx` - NEW FILE
4. `src/pages/vendor/market-prices.tsx` - NEW FILE
5. `src/App.tsx` - Added imports and routes for vendor pages

### Documentation
1. `README-updates.md` - This file

---

## Sample Data for Testing

### Add Sample Farmer Profiles:
```sql
UPDATE profiles 
SET crops_grown = 'Rice, Wheat', 
    available_quantity = 5000, 
    location = 'Punjab', 
    expected_price = '₹30/kg'
WHERE id = 1;

UPDATE profiles 
SET crops_grown = 'Cotton, Sugarcane', 
    available_quantity = 3000, 
    location = 'Haryana', 
    expected_price = '₹45/kg'
WHERE id = 2;
```

### Test QR Codes:
- Simple text: `"Product: Rice Premium - Batch 202412 - Farm: ABC-123"`
- JSON format: `"{\"product\":\"Rice\",\"batch\":\"202412\",\"farm\":\"ABC-123\"}"`

---

## Environment Variables

No new environment variables required. Existing `.env` should have:
```
PORT=3001
SESSION_SECRET=<your-secret>
DATA_GOV_API_KEY=<your-key>  # For market prices API
DATA_GOV_API_CACHE_TTL_SEC=300
```

---

## Notes

- All vendor pages enforce authentication and vendor role via `ProtectedRoute`
- QR scanning uses manual input for now (camera integration can be added later with html5-qrcode library)
- Market prices page reuses existing backend proxy (`/api/market-prices`)
- Navigation is consistent across all vendor pages
- Database changes are backward-compatible (new columns allow NULL)
- CSV export in market prices includes only displayed columns

---

## Curl Test Cheat Sheet

```bash
# Login
curl -c cookies.txt -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"role":"vendor","email":"test@vendor.com","password":"password"}'

# Get all farmers
curl -b cookies.txt http://localhost:3001/api/profiles

# Search farmers
curl -b cookies.txt "http://localhost:3001/api/profiles?q=Punjab"

# Parse QR
curl -b cookies.txt -X POST http://localhost:3001/api/qr/parse \
  -H "Content-Type: application/json" \
  -d '{"qr_text":"Sample QR Data"}'

# Get market prices
curl -b cookies.txt "http://localhost:3001/api/market-prices?commodity=Wheat&state=Punjab"

# Get NGO schemes
curl -b cookies.txt http://localhost:3001/api/ngo-schemes

# Get soil labs
curl -b cookies.txt http://localhost:3001/api/soil-labs
```

---

## Success Criteria

✅ Database schema updated with 4 new columns  
✅ Backend API routes implemented and tested  
✅ Frontend vendor pages created with navigation  
✅ Routing configured with role-based protection  
✅ All pages use consistent styling and branding  
✅ API integration working (profiles, QR, market prices)  

---

**Implementation Date:** December 3, 2025  
**Author:** AI Assistant (Antigravity)  
**Status:** ✅ Complete and ready for testing
