require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const axios = require('axios');
const { initDatabase, dbHelpers } = require('./database');
const authHelpers = require('./auth');

const app = express();
const PORT = process.env.PORT || 3001;

// Update CORS for production
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? ['https://farm-frontend-jb39.onrender.com', 'https://farm-frontend-jb39.onrender.com/']
  : ['http://localhost:8080', 'http://localhost:5173'];

app.use(cors({
  origin: function (origin, callback) {
    // Log the origin for debugging
    console.log('CORS request from origin:', origin);

    // Temporarily allow all origins for debugging
    if (process.env.NODE_ENV === 'production') {
      // In production, allow all origins temporarily
      callback(null, true);
    } else {
      // In development, use strict CORS
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log('CORS blocked origin:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

// Middleware (CORS already configured above)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: 'farmiq-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Authentication middleware
const requireAuth = (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    res.status(401).json({ message: 'Authentication required' });
  }
};

// Role-based middleware
const requireRole = (roles) => {
  return (req, res, next) => {
    if (req.session.userId && req.session.role && roles.includes(req.session.role)) {
      next();
    } else {
      res.status(403).json({ message: 'Insufficient permissions' });
    }
  };
};

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    cors_origin: req.headers.origin || 'no-origin'
  });
});

// Simple test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    message: 'Backend is working!',
    timestamp: new Date().toISOString(),
    origin: req.headers.origin
  });
});

// Authentication routes

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { role, full_name, email, phone, password, language_pref } = req.body;

    const result = await authHelpers.register({
      role: role || 'farmer',
      full_name,
      email,
      phone,
      password,
      language_pref
    });

    res.status(201).json({ ok: true, userId: result.userId });
  } catch (error) {
    if (error.message && error.message.includes('Email already exists')) {
      res.status(409).json({ message: error.message });
    } else {
      console.error('Registration error:', error);
      res.status(400).json({ message: error.message });
    }
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { role, email, password } = req.body;  // email only, no username

    const user = await authHelpers.login(role, email, password);

    // Set session
    req.session.userId = user.id;
    req.session.role = user.role;
    req.session.email = user.email;

    // Determine redirect URL based on role
    let redirectUrl;
    switch (user.role) {
      case 'farmer':
        redirectUrl = '/farmer/dashboard';
        break;
      case 'vendor':
        redirectUrl = '/vendor/dashboard';
        break;
      case 'admin':
        redirectUrl = '/admin/dashboard';
        break;
      default:
        redirectUrl = '/login';
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        role: user.role,
        email: user.email,
        phone: user.phone
      },
      redirectUrl
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({ message: error.message });
  }
});

// Get current session
app.get('/api/auth/session', async (req, res) => {
  try {
    if (req.session.userId) {
      const user = await authHelpers.getUserById(req.session.userId);
      if (user) {
        res.json({
          authenticated: true,
          user: {
            id: user.id,
            role: user.role,
            email: user.email,
            phone: user.phone
          }
        });
      } else {
        // User not found, clear session
        req.session.destroy();
        res.json({ authenticated: false });
      }
    } else {
      res.json({ authenticated: false });
    }
  } catch (error) {
    console.error('Session check error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user details by ID (for profile page)
app.get('/api/auth/user/:id', requireAuth, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    // Ensure user can only access their own data
    if (req.session.userId !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const user = await authHelpers.getUserById(userId);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Get user details error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      res.status(500).json({ message: 'Could not log out' });
    } else {
      res.json({ ok: true });
    }
  });
});

// Get current user's profile
app.get('/api/me/profile', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    const profile = await authHelpers.getUserProfile(userId);

    if (profile) {
      res.json(profile);
    } else {
      res.status(404).json({ message: 'Profile not found' });
    }
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update current user's profile (no aadhar, village, district, state)
app.put('/api/me/profile', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    const { full_name, phone_number, language_pref } = req.body;  // only allowed fields

    const { dbHelpers } = require('./database');
    await dbHelpers.updateProfile(userId, {
      full_name,
      phone_number,
      language_pref
    });

    res.json({ ok: true, message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Protected routes for testing
app.get('/api/farmer/dashboard', requireAuth, requireRole(['farmer']), (req, res) => {
  res.json({ message: 'Farmer dashboard data' });
});

app.get('/api/vendor/dashboard', requireAuth, requireRole(['vendor']), (req, res) => {
  res.json({ message: 'Vendor dashboard data' });
});

app.get('/api/admin/dashboard', requireAuth, requireRole(['admin']), (req, res) => {
  res.json({ message: 'Admin dashboard data' });
});

// ========== NGO SCHEMES ROUTES ==========

// Get all NGO schemes (all authenticated users can read)
app.get('/api/ngo-schemes', requireAuth, async (req, res) => {
  try {
    const schemes = await dbHelpers.getNgoSchemes();
    res.json(schemes);
  } catch (error) {
    console.error('Get NGO schemes error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ========== GOVERNMENT SCHEMES ELIGIBILITY FILTER ==========

// Filter government schemes based on eligibility criteria
app.post('/api/government-schemes/filter', requireAuth, async (req, res) => {
  try {
    const { state, land, category, age, crop } = req.body;

    console.log('🌾 Government Schemes Filter Request:', {
      userId: req.session.userId,
      userRole: req.session.role,
      filters: { state, land, category, age, crop }
    });

    // Validate input
    if (!state && land === undefined && !category && age === undefined) {
      return res.status(400).json({
        message: 'At least one filter criteria (state, land, category, or age) is required'
      });
    }

    // Call the eligibility helper function
    const eligibleSchemes = await dbHelpers.getEligibleSchemes({
      state,
      land: land !== undefined ? parseFloat(land) : undefined,
      category,
      age: age !== undefined ? parseInt(age) : undefined
    });

    console.log(`✅ Returning ${eligibleSchemes.length} eligible schemes to farmer`);

    res.json(eligibleSchemes);
  } catch (error) {
    console.error('❌ Government schemes filter error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get NGO scheme by ID (all authenticated users can read)
app.get('/api/ngo-schemes/:id', requireAuth, async (req, res) => {
  try {
    const schemeId = parseInt(req.params.id);
    const scheme = await dbHelpers.getNgoSchemeById(schemeId);

    if (scheme) {
      res.json(scheme);
    } else {
      res.status(404).json({ message: 'NGO scheme not found' });
    }
  } catch (error) {
    console.error('Get NGO scheme error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create NGO scheme (admin only)
app.post('/api/ngo-schemes', requireAuth, requireRole(['admin']), async (req, res) => {
  try {
    const result = await dbHelpers.createNgoScheme(req.body);
    res.status(201).json({ id: result.id, message: 'NGO scheme created successfully' });
  } catch (error) {
    console.error('Create NGO scheme error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update NGO scheme (admin only)
app.put('/api/ngo-schemes/:id', requireAuth, requireRole(['admin']), async (req, res) => {
  try {
    const schemeId = parseInt(req.params.id);
    await dbHelpers.updateNgoScheme(schemeId, req.body);
    res.json({ message: 'NGO scheme updated successfully' });
  } catch (error) {
    console.error('Update NGO scheme error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete NGO scheme (admin only)
app.delete('/api/ngo-schemes/:id', requireAuth, requireRole(['admin']), async (req, res) => {
  try {
    const schemeId = parseInt(req.params.id);
    await dbHelpers.deleteNgoScheme(schemeId);
    res.json({ message: 'NGO scheme deleted successfully' });
  } catch (error) {
    console.error('Delete NGO scheme error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ========== SOIL LAB ROUTES ==========

// Get all soil labs (all authenticated users can read)
app.get('/api/soil-labs', requireAuth, async (req, res) => {
  try {
    const labs = await dbHelpers.getSoilLabs();
    res.json(labs);
  } catch (error) {
    console.error('Get soil labs error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get soil lab by ID (all authenticated users can read)
app.get('/api/soil-labs/:id', requireAuth, async (req, res) => {
  try {
    const labId = parseInt(req.params.id);
    const lab = await dbHelpers.getSoilLabById(labId);

    if (lab) {
      res.json(lab);
    } else {
      res.status(404).json({ message: 'Soil lab not found' });
    }
  } catch (error) {
    console.error('Get soil lab error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create soil lab (admin only)
app.post('/api/soil-labs', requireAuth, requireRole(['admin']), async (req, res) => {
  try {
    const result = await dbHelpers.createSoilLab(req.body);
    res.status(201).json({ id: result.id, message: 'Soil lab created successfully' });
  } catch (error) {
    console.error('Create soil lab error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update soil lab (admin only)
app.put('/api/soil-labs/:id', requireAuth, requireRole(['admin']), async (req, res) => {
  try {
    const labId = parseInt(req.params.id);
    await dbHelpers.updateSoilLab(labId, req.body);
    res.json({ message: 'Soil lab updated successfully' });
  } catch (error) {
    console.error('Update soil lab error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete soil lab (admin only)
app.delete('/api/soil-labs/:id', requireAuth, requireRole(['admin']), async (req, res) => {
  try {
    const labId = parseInt(req.params.id);
    await dbHelpers.deleteSoilLab(labId);
    res.json({ message: 'Soil lab deleted successfully' });
  } catch (error) {
    console.error('Delete soil lab error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ========== CROP HISTORY ROUTES ==========

// Get crops (farmers get own, admins get all, vendors denied)
app.get('/api/crops', requireAuth, async (req, res) => {
  try {
    const userRole = req.session.role;
    const userId = req.session.userId;

    // Vendors not allowed to access crop history
    if (userRole === 'vendor') {
      return res.status(403).json({ message: 'Vendors cannot access crop history' });
    }

    let crops;
    if (userRole === 'admin') {
      // Admins see all crops
      crops = await dbHelpers.getAllCrops();
    } else {
      // Farmers see only their crops
      crops = await dbHelpers.getCropsByUserId(userId);
    }

    res.json(crops);
  } catch (error) {
    console.error('Get crops error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create crop (farmers and admins only, user_id from session)
app.post('/api/crops', requireAuth, async (req, res) => {
  try {
    const userRole = req.session.role;
    const userId = req.session.userId;

    // Only farmers and admins can create crops
    if (userRole === 'vendor') {
      return res.status(403).json({ message: 'Vendors cannot create crop records' });
    }

    // Validate required fields
    const { crop_name } = req.body;
    if (!crop_name) {
      return res.status(400).json({ message: 'Crop name is required' });
    }

    // SECURITY: user_id from session, NEVER from client
    // Even if client sends user_id, it's ignored
    const result = await dbHelpers.createCrop(userId, req.body);
    res.status(201).json({ id: result.id, message: 'Crop record created successfully' });
  } catch (error) {
    console.error('Create crop error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update crop (owner or admin only)
app.put('/api/crops/:id', requireAuth, async (req, res) => {
  try {
    const cropId = parseInt(req.params.id);
    const userRole = req.session.role;
    const userId = req.session.userId;

    // Vendors not allowed
    if (userRole === 'vendor') {
      return res.status(403).json({ message: 'Vendors cannot modify crop records' });
    }

    // Check ownership (unless admin)
    const crop = await dbHelpers.getCropById(cropId);
    if (!crop) {
      return res.status(404).json({ message: 'Crop record not found' });
    }

    // Only admin or owner can update
    if (userRole !== 'admin' && crop.user_id !== userId) {
      return res.status(403).json({ message: 'You can only update your own crop records' });
    }

    await dbHelpers.updateCrop(cropId, req.body);
    res.json({ message: 'Crop record updated successfully' });
  } catch (error) {
    console.error('Update crop error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete crop (owner or admin only)
app.delete('/api/crops/:id', requireAuth, async (req, res) => {
  try {
    const cropId = parseInt(req.params.id);
    const userRole = req.session.role;
    const userId = req.session.userId;

    // Vendors not allowed
    if (userRole === 'vendor') {
      return res.status(403).json({ message: 'Vendors cannot delete crop records' });
    }

    // Check ownership (unless admin)
    const crop = await dbHelpers.getCropById(cropId);
    if (!crop) {
      return res.status(404).json({ message: 'Crop record not found' });
    }

    // Only admin or owner can delete
    if (userRole !== 'admin' && crop.user_id !== userId) {
      return res.status(403).json({ message: 'You can only delete your own crop records' });
    }

    await dbHelpers.deleteCrop(cropId);
    res.status(204).send();
  } catch (error) {
    console.error('Delete crop error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ========== IOT SENSOR BOOKING API ==========

// GET /api/iot/status/:user_id - Get IoT status for a user
app.get('/api/iot/status/:user_id', requireAuth, async (req, res) => {
  try {
    const userId = parseInt(req.params.user_id);

    console.log(`🔍 IoT Status Request for user_id: ${userId}`);

    // Special case: user_id === 1 always returns 'booked'
    if (userId === 1) {
      console.log('📌 Special case: user_id=1, returning booked status');
      return res.json({
        user_id: userId,
        status: 'booked',
        updated_at: new Date().toISOString(),
        note: 'Auto-booked for user ID 1'
      });
    }

    // Get or create status from database
    let status = await dbHelpers.getIotStatusByUserId(userId);

    if (!status) {
      // Create default 'inactive' status if doesn't exist
      console.log('📝 Creating default inactive status for user');
      status = await dbHelpers.upsertIotStatus(userId, 'inactive');
    }

    res.json(status);
  } catch (error) {
    console.error('❌ Error getting IoT status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/iot/request/:user_id - Get booking request for a user
app.get('/api/iot/request/:user_id', requireAuth, async (req, res) => {
  try {
    const userId = parseInt(req.params.user_id);

    console.log(`🔍 IoT Booking Request for user_id: ${userId}`);

    const booking = await dbHelpers.getIotReadingByUserId(userId);

    if (!booking) {
      return res.status(404).json({ message: 'No booking request found' });
    }

    res.json(booking);
  } catch (error) {
    console.error('❌ Error getting IoT booking request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/iot/request - Create new booking request
app.post('/api/iot/request', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId; // Get user_id from session, NOT from request body

    console.log(`📝 Creating IoT booking for user_id: ${userId}`);

    // Validate required fields
    const { name, phone_number, location, state, district, preferred_visit_date } = req.body;

    if (!name || !phone_number) {
      return res.status(400).json({ message: 'Name and phone number are required' });
    }

    // Validate phone number length (7-20 characters)
    if (phone_number.length < 7 || phone_number.length > 20) {
      return res.status(400).json({ message: 'Phone number must be between 7 and 20 characters' });
    }

    // Validate date format if provided
    if (preferred_visit_date) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(preferred_visit_date)) {
        return res.status(400).json({ message: 'Preferred visit date must be in YYYY-MM-DD format' });
      }

      // Try to parse the date to ensure it's valid
      const parsedDate = new Date(preferred_visit_date);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ message: 'Invalid date provided' });
      }
    }

    // Check if user already has a booking
    const existingBooking = await dbHelpers.getIotReadingByUserId(userId);
    if (existingBooking) {
      console.log('⚠️ User already has an existing booking');
      return res.status(409).json({
        message: 'You already have an existing booking request',
        existing: existingBooking
      });
    }

    // Create the booking
    const newBooking = await dbHelpers.createIotReading(userId, req.body);

    console.log(`✅ Booking created successfully: ID=${newBooking.id}`);

    res.status(201).json(newBooking);
  } catch (error) {
    console.error('❌ Error creating IoT booking:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /api/iot/status/:user_id - Update IoT status (admin only)
app.put('/api/iot/status/:user_id', requireAuth, requireRole(['admin']), async (req, res) => {
  try {
    const userId = parseInt(req.params.user_id);
    const { status } = req.body;

    console.log(`🔧 Admin updating IoT status for user_id: ${userId} to: ${status}`);

    // Validate status value
    const validStatuses = ['inactive', 'active', 'booked'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    // Update or create the status
    const updatedStatus = await dbHelpers.upsertIotStatus(userId, status);

    console.log(`✅ Status updated successfully for user_id: ${userId}`);

    res.json(updatedStatus);
  } catch (error) {
    console.error('❌ Error updating IoT status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/iot/readings/:user_id - Get sensor readings
app.get('/api/iot/readings/:user_id', requireAuth, async (req, res) => {
  try {
    const userId = parseInt(req.params.user_id);
    const limit = parseInt(req.query.limit) || 24;

    console.log(`📊 IoT Readings Request for user_id: ${userId}, limit: ${limit}`);

    // Check if user's device is active
    const status = await dbHelpers.getIotStatusByUserId(userId);

    if (!status || status.status !== 'active') {
      console.log(`⚠️ Device not active for user_id: ${userId}, status: ${status?.status || 'none'}`);
      return res.status(403).json({
        message: 'Device not active. Sensor readings are only available when device status is "active".',
        current_status: status?.status || 'inactive'
      });
    }

    // Generate mock readings
    const readings = dbHelpers.generateMockReadings(limit);

    console.log(`✅ Returning ${readings.length} mock readings`);

    res.json(readings);
  } catch (error) {
    console.error('❌ Error getting IoT readings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// ========== PROFILES / FARMER SEARCH ROUTES ==========

// Get profiles (for vendor farmer search)
app.get('/api/profiles', requireAuth, async (req, res) => {
  try {
    const { q } = req.query;
    console.log(`🔍 Profiles search request: q="${q}"`);

    const profiles = await dbHelpers.getProfiles({ q });
    console.log(`✅ Found ${profiles.length} profiles`);

    res.json(profiles);
  } catch (error) {
    console.error('❌ Get profiles error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ========== EXPERTS ROUTES ==========

// Get experts with search and filter
app.get('/api/experts', requireAuth, async (req, res) => {
  try {
    const { q, specialization, limit, offset } = req.query;
    const rows = await dbHelpers.getExperts({
      q,
      specialization,
      limit: limit || 100,
      offset: offset || 0
    });

    // return parsed specialization as array
    const mapped = rows.map(r => ({
      ...r,
      specializations: r.specializations ? JSON.parse(r.specializations) : []
    }));

    res.json({ data: mapped, count: mapped.length });
  } catch (err) {
    console.error('GET /api/experts error', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ========== QR CODE ROUTES ==========

// Parse QR code text
app.post('/api/qr/parse', requireAuth, async (req, res) => {
  try {
    const { qr_text } = req.body;

    if (!qr_text) {
      return res.status(400).json({ message: 'QR text is required' });
    }

    console.log('📱 QR scanned:', qr_text.substring(0, 100));

    // Return the QR text back for display
    // Frontend will handle JSON pretty-printing if needed
    res.json({ qr_text });
  } catch (error) {
    console.error('❌ QR parse error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ========== MARKET PRICES API PROXY ==========

// In-memory cache for market prices
const MARKET_CACHE = new Map();
const MARKET_CACHE_TTL_MS = (parseInt(process.env.DATA_GOV_API_CACHE_TTL_SEC) || 300) * 1000;

function getMarketCacheKey(query) {
  return `${query.state || ''}|${query.district || ''}|${query.commodity || ''}|${query.offset || 0}|${query.limit || 50}`;
}

// GET /api/market-prices - Proxy to data.gov.in API
app.get('/api/market-prices', async (req, res) => {
  try {
    const { state, district, commodity, offset = '0', limit = '50' } = req.query;

    // Validate and parse parameters
    const parsedOffset = Math.max(0, parseInt(offset) || 0);
    const maxLimit = parseInt(process.env.DATA_GOV_API_MAX_LIMIT) || 1000;
    const parsedLimit = Math.min(Math.max(1, parseInt(limit) || 50), maxLimit);

    // Create cache key
    const cacheKey = getMarketCacheKey({ state, district, commodity, offset: parsedOffset, limit: parsedLimit });

    // Check cache
    const cached = MARKET_CACHE.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < MARKET_CACHE_TTL_MS) {
      console.log(`market-proxy: CACHE HIT for key=${cacheKey}`);
      res.set('X-Cache', 'HIT');
      return res.json(cached.data);
    }

    // Build upstream URL
    const params = new URLSearchParams();
    params.append('api-key', process.env.DATA_GOV_API_KEY);
    params.append('format', 'json');
    params.append('offset', String(parsedOffset));
    params.append('limit', String(parsedLimit));

    // Only add filters if they are NOT "All" values
    if (state && state !== 'all' && state !== 'All States' && state !== 'All State') {
      params.append('filters[state]', state);
    }
    if (district && district !== 'all' && district !== 'All Districts') {
      params.append('filters[district]', district);
    }
    if (commodity && commodity !== 'all' && commodity !== 'All Crops' && commodity !== 'All commodities' && commodity !== 'All Commodity') {
      params.append('filters[commodity]', commodity);
    }

    const upstreamUrl = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?${params.toString()}`;

    // Log request (with redacted API key)
    const logUrl = upstreamUrl.replace(process.env.DATA_GOV_API_KEY, '[REDACTED]');
    console.log(`market-proxy: Fetching upstream url=${logUrl}`);

    const startTime = Date.now();

    // Make upstream request
    const timeout = parseInt(process.env.DATA_GOV_API_TIMEOUT_MS) || 15000;
    const upstreamResponse = await axios.get(upstreamUrl, {
      timeout,
      headers: {
        'Accept': 'application/json'
      }
    });

    const elapsed = Date.now() - startTime;
    console.log(`market-proxy: upstream ${upstreamResponse.status} in ${elapsed}ms`);

    // Parse and normalize response
    const rawData = upstreamResponse.data;
    let records = [];

    // data.gov.in returns data in records array
    if (rawData && Array.isArray(rawData.records)) {
      records = rawData.records;
    } else if (Array.isArray(rawData)) {
      records = rawData;
    }

    // Normalize data
    const normalizedData = records.map(item => {
      // Helper to parse price strings (remove commas, parse to int)
      const parsePrice = (priceStr) => {
        if (!priceStr) return null;
        const cleaned = String(priceStr).replace(/,/g, '').trim();
        const parsed = parseInt(cleaned, 10);
        return isNaN(parsed) ? null : parsed;
      };

      return {
        state: item.state || null,
        district: item.district || null,
        market: item.market || item.district || null,
        commodity: item.commodity || null,
        variety: item.variety || null,
        min_price: parsePrice(item.min_price),
        max_price: parsePrice(item.max_price),
        modal_price: parsePrice(item.modal_price),
        arrival_date: item.arrival_date || null
      };
    });

    // Build response
    const response = {
      meta: {
        offset: parsedOffset,
        limit: parsedLimit,
        count: normalizedData.length
      },
      data: normalizedData
    };

    // Cache the response
    MARKET_CACHE.set(cacheKey, {
      timestamp: Date.now(),
      data: response
    });
    console.log(`market-proxy: CACHE MISS - cached for key=${cacheKey}`);

    res.set('X-Cache', 'MISS');
    return res.json(response);

  } catch (error) {
    console.error('market-proxy ERROR:', error.message);

    // Handle specific error cases
    if (error.response) {
      const status = error.response.status;
      const upstreamData = error.response.data;

      console.error(`market-proxy: upstream error ${status}`, upstreamData);

      // Rate limit error
      if (status === 429) {
        const retryAfter = error.response.headers['retry-after'] || 60;
        res.set('Retry-After', String(retryAfter));
        return res.status(503).json({
          message: 'Upstream rate limit exceeded, please try again later',
          retry_after: retryAfter
        });
      }

      // Upstream server error
      if (status >= 500) {
        return res.status(502).json({
          message: 'Upstream server error - market data temporarily unavailable'
        });
      }

      // Other upstream errors (4xx)
      return res.status(502).json({
        message: 'Failed to fetch market data from upstream API'
      });
    }

    // Timeout or network error
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return res.status(504).json({
        message: 'Request timeout - upstream API not responding'
      });
    }

    // Generic error
    console.error('market-proxy: unexpected error', error);
    return res.status(500).json({
      message: 'Internal server error fetching market data'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Initialize database and start server
const startServer = async () => {
  try {
    await initDatabase();
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
      console.log(`✅ Server accessible at http://127.0.0.1:${PORT}`);
      console.log('✅ Database initialized successfully');
      console.log(`✅ CORS enabled for: ${allowedOrigins.join(', ')}`);
      console.log(`✅ Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
