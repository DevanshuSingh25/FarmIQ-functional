const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create database connection
const dbPath = path.join(__dirname, 'farmiQ.db');
const db = new sqlite3.Database(dbPath);

// Initialize database with users table
const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Create users table (updated schema - no username, aadhar, name)
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE,
          password_hash TEXT NOT NULL,
          role TEXT DEFAULT 'farmer',
          phone TEXT,
          created_at TEXT DEFAULT (datetime('now')),
          updated_at TEXT DEFAULT (datetime('now'))
        )
      `, (err) => {
        if (err) {
          console.error('Error creating users table:', err);
          reject(err);
          return;
        }
        console.log('Users table created successfully');
      });

      // Create index on email for faster lookups
      db.run(`
        CREATE INDEX IF NOT EXISTS idx_users_email 
        ON users (email)
      `, (err) => {
        if (err) {
          console.error('Error creating index:', err);
          reject(err);
          return;
        }
        console.log('Index created successfully');
        resolve();
      });
      // Create profiles table (updated schema with new fields)
      db.run(`
        CREATE TABLE IF NOT EXISTS profiles (
          id INTEGER PRIMARY KEY,
          full_name TEXT,
          email TEXT,
          phone_number TEXT,
          language_pref TEXT DEFAULT 'en',
          location TEXT,
          crops_grown TEXT,
          available_quantity TEXT,
          expected_price TEXT,
          created_at TEXT DEFAULT (datetime('now')),
          updated_at TEXT DEFAULT (datetime('now')),
          FOREIGN KEY (id) REFERENCES users (id)
        )
      `, (err) => {
        if (err) {
          console.error('Error creating profiles table:', err);
          reject(err);
          return;
        }
        console.log('Profiles table created successfully');
        resolve();
      });
    });
  });
};

// Database helper functions
const dbHelpers = {
  // Insert a new user (no username, aadhar, name)
  insertUser: (userData) => {
    return new Promise((resolve, reject) => {
      const { email, password_hash, role, phone } = userData;
      db.run(
        `INSERT INTO users (email, password_hash, role, phone) 
         VALUES (?, ?, ?, ?)`,
        [email, password_hash, role || 'farmer', phone || ''],
        function (err) {
          if (err) {
            if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
              reject(new Error('Email already exists'));
            } else {
              reject(err);
            }
            return;
          }
          resolve({ id: this.lastID });
        }
      );
    });
  },

  // Find user by role and email (for login)
  findUserByRoleAndEmail: (role, email) => {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM users WHERE role = ? AND email = ?`,
        [role, email],
        (err, row) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(row);
        }
      );
    });
  },

  // Find user  by email only
  findUserByEmail: (email) => {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM users WHERE email = ?`,
        [email],
        (err, row) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(row);
        }
      );
    });
  },

  // Find user by ID
  findUserById: (id) => {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT id, role, email, phone, created_at FROM users WHERE id = ?`,
        [id],
        (err, row) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(row);
        }
      );
    });
  },

  // ========== PROFILE HELPERS ==========

  // Insert a new profile (no username, aadhar, village, district, state)
  insertProfile: (profileData) => {
    return new Promise((resolve, reject) => {
      const { id, full_name, email, phone_number, language_pref, location, crops_grown, available_quantity, expected_price } = profileData;
      db.run(
        `INSERT INTO profiles (id, full_name, email, phone_number, language_pref, location, crops_grown, available_quantity, expected_price) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          full_name || '',
          email || '',
          phone_number || '',
          language_pref || 'en',
          location || '',
          crops_grown || '',
          available_quantity || '',
          expected_price || ''
        ],
        function (err) {
          if (err) {
            reject(err);
            return;
          }
          resolve({ id });
        }
      );
    });
  },

  // Find profile by user ID
  findProfileByUserId: (userId) => {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM profiles WHERE id = ?`,
        [userId],
        (err, row) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(row);
        }
      );
    });
  },

  // Update profile (no username, aadhar, village, district, state)
  updateProfile: (userId, profileData) => {
    return new Promise((resolve, reject) => {
      const { full_name, phone_number, language_pref } = profileData;
      db.run(
        `UPDATE profiles 
         SET full_name = ?, phone_number = ?, language_pref = ?, updated_at = datetime('now')
         WHERE id = ?`,
        [full_name, phone_number, language_pref, userId],
        function (err) {
          if (err) {
            reject(err);
            return;
          }
          resolve({ changes: this.changes });
        }
      );
    });
  },

  // ========== NGO SCHEMES HELPERS ==========

  // Get all NGO schemes
  getNgoSchemes: () => {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM ngo_schemes ORDER BY created_at DESC`,
        [],
        (err, rows) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(rows || []);
        }
      );
    });
  },

  // Get NGO scheme by ID
  getNgoSchemeById: (id) => {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM ngo_schemes WHERE id = ?`,
        [id],
        (err, row) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(row);
        }
      );
    });
  },

  // Create NGO scheme
  createNgoScheme: (data) => {
    return new Promise((resolve, reject) => {
      const { name, ministry, deadline, location, contact_number, no_of_docs_required, status, benefit_text, eligibility_text } = data;
      db.run(
        `INSERT INTO ngo_schemes (name, ministry, deadline, location, contact_number, no_of_docs_required, status, benefit_text, eligibility_text)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [name, ministry || '', deadline || '', location || '', contact_number || '', no_of_docs_required || 0, status || 'active', benefit_text || '', eligibility_text || ''],
        function (err) {
          if (err) {
            reject(err);
            return;
          }
          resolve({ id: this.lastID });
        }
      );
    });
  },

  // Update NGO scheme
  updateNgoScheme: (id, data) => {
    return new Promise((resolve, reject) => {
      const { name, ministry, deadline, location, contact_number, no_of_docs_required, status, benefit_text, eligibility_text } = data;
      db.run(
        `UPDATE ngo_schemes 
         SET name = ?, ministry = ?, deadline = ?, location = ?, contact_number = ?, 
             no_of_docs_required = ?, status = ?, benefit_text = ?, eligibility_text = ?,
             updated_at = datetime('now')
         WHERE id = ?`,
        [name, ministry, deadline, location, contact_number, no_of_docs_required, status, benefit_text, eligibility_text, id],
        function (err) {
          if (err) {
            reject(err);
            return;
          }
          resolve({ changes: this.changes });
        }
      );
    });
  },

  // Delete NGO scheme
  deleteNgoScheme: (id) => {
    return new Promise((resolve, reject) => {
      db.run(
        `DELETE FROM ngo_schemes WHERE id = ?`,
        [id],
        function (err) {
          if (err) {
            reject(err);
            return;
          }
          resolve({ changes: this.changes });
        }
      );
    });
  },

  // Get eligible government schemes based on farmer's criteria
  getEligibleSchemes: (filters) => {
    return new Promise((resolve, reject) => {
      const { state, land, category, age } = filters;

      console.log('🔍 Filtering schemes with criteria:', { state, land, category, age });

      // Build dynamic SQL query
      let query = `SELECT * FROM ngo_schemes WHERE 1=1`;
      const params = [];

      // State filter: Match if required_state is NULL, 'ALL', or matches the input state
      if (state) {
        query += ` AND (required_state IS NULL OR required_state = 'ALL' OR required_state = ?)`;
        params.push(state);
      }

      // Land size filter: Match if within min_land and max_land range
      if (land !== undefined && land !== null) {
        query += ` AND (
          (min_land IS NULL OR ? >= min_land) AND
          (max_land IS NULL OR ? <= max_land)
        )`;
        params.push(land, land);
      }

      // Category filter: Match if required_category is NULL, 'ALL', or matches input
      if (category) {
        query += ` AND (required_category IS NULL OR required_category = 'ALL' OR required_category = ?)`;
        params.push(category);
      }

      // Age filter: Match if within age_min and age_max range
      if (age !== undefined && age !== null) {
        query += ` AND (
          (age_min IS NULL OR ? >= age_min) AND
          (age_max IS NULL OR ? <= age_max)
        )`;
        params.push(age, age);
      }

      // Order by created_at descending
      query += ` ORDER BY created_at DESC`;

      console.log('📝 SQL Query:', query);
      console.log('📌 Query Params:', params);

      db.all(query, params, (err, rows) => {
        if (err) {
          console.error('❌ Error filtering schemes:', err);
          reject(err);
          return;
        }
        console.log(`✅ Found ${rows?.length || 0} eligible schemes`);
        resolve(rows || []);
      });
    });
  },

  // ========== SOIL LAB HELPERS ==========

  // Get all soil labs
  getSoilLabs: () => {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM soil_lab ORDER BY created_at DESC`,
        [],
        (err, rows) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(rows || []);
        }
      );
    });
  },

  // Get soil lab by ID
  getSoilLabById: (id) => {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM soil_lab WHERE id = ?`,
        [id],
        (err, row) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(row);
        }
      );
    });
  },

  // Create soil lab
  createSoilLab: (data) => {
    return new Promise((resolve, reject) => {
      const { name, location, contact_number, price, rating, tag } = data;
      db.run(
        `INSERT INTO soil_lab (name, location, contact_number, price, rating, tag)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [name, location || '', contact_number || '', price || 0, rating || 0, tag || ''],
        function (err) {
          if (err) {
            reject(err);
            return;
          }
          resolve({ id: this.lastID });
        }
      );
    });
  },

  // Update soil lab
  updateSoilLab: (id, data) => {
    return new Promise((resolve, reject) => {
      const { name, location, contact_number, price, rating, tag } = data;
      db.run(
        `UPDATE soil_lab 
         SET name = ?, location = ?, contact_number = ?, price = ?, rating = ?, tag = ?,
             updated_at = datetime('now')
         WHERE id = ?`,
        [name, location, contact_number, price, rating, tag, id],
        function (err) {
          if (err) {
            reject(err);
            return;
          }
          resolve({ changes: this.changes });
        }
      );
    });
  },

  // Delete soil lab
  deleteSoilLab: (id) => {
    return new Promise((resolve, reject) => {
      db.run(
        `DELETE FROM soil_lab WHERE id = ?`,
        [id],
        function (err) {
          if (err) {
            reject(err);
            return;
          }
          resolve({ changes: this.changes });
        }
      );
    });
  },

  // ========== CROP HISTORY HELPERS ==========

  // Get crops by user ID (for farmers)
  getCropsByUserId: (userId) => {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM crop_history WHERE user_id = ? ORDER BY created_at DESC`,
        [userId],
        (err, rows) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(rows || []);
        }
      );
    });
  },

  // Get all crops (for admins)
  getAllCrops: () => {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM crop_history ORDER BY created_at DESC`,
        [],
        (err, rows) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(rows || []);
        }
      );
    });
  },

  // Get crop by ID
  getCropById: (id) => {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM crop_history WHERE id = ?`,
        [id],
        (err, row) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(row);
        }
      );
    });
  },

  // Create crop (user_id from server, never from client)
  createCrop: (userId, data) => {
    return new Promise((resolve, reject) => {
      const { crop_name, crop_price, selling_price, crop_produced_kg } = data;
      db.run(
        `INSERT INTO crop_history (user_id, crop_name, crop_price, selling_price, crop_produced_kg)
         VALUES (?, ?, ?, ?, ?)`,
        [userId, crop_name, crop_price || 0, selling_price || 0, crop_produced_kg || 0],
        function (err) {
          if (err) {
            reject(err);
            return;
          }
          resolve({ id: this.lastID });
        }
      );
    });
  },

  // Update crop
  updateCrop: (id, data) => {
    return new Promise((resolve, reject) => {
      const { crop_name, crop_price, selling_price, crop_produced_kg } = data;
      db.run(
        `UPDATE crop_history 
         SET crop_name = ?, crop_price = ?, selling_price = ?, crop_produced_kg = ?,
             updated_at = datetime('now')
         WHERE id = ?`,
        [crop_name, crop_price, selling_price, crop_produced_kg, id],
        function (err) {
          if (err) {
            reject(err);
            return;
          }
          resolve({ changes: this.changes });
        }
      );
    });
  },

  // Delete crop
  deleteCrop: (id) => {
    return new Promise((resolve, reject) => {
      db.run(
        `DELETE FROM crop_history WHERE id = ?`,
        [id],
        function (err) {
          if (err) {
            reject(err);
            return;
          }
          resolve({ changes: this.changes });
        }
      );
    });
  },

  // ========== IOT SENSOR HELPERS ==========

  // Get IoT booking request by user ID
  getIotReadingByUserId: (userId) => {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM iot_reading WHERE user_id = ? ORDER BY created_at DESC LIMIT 1`,
        [userId],
        (err, row) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(row);
        }
      );
    });
  },

  // Create IoT booking request
  createIotReading: (userId, data) => {
    return new Promise((resolve, reject) => {
      const { name, phone_number, location, state, district, preferred_visit_date } = data;
      db.run(
        `INSERT INTO iot_reading (user_id, name, phone_number, location, state, district, preferred_visit_date, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
        [userId, name, phone_number, location || '', state || '', district || '', preferred_visit_date || ''],
        function (err) {
          if (err) {
            reject(err);
            return;
          }
          // Return the created record
          db.get(
            `SELECT * FROM iot_reading WHERE id = ?`,
            [this.lastID],
            (err, row) => {
              if (err) {
                reject(err);
                return;
              }
              resolve(row);
            }
          );
        }
      );
    });
  },

  // Get IoT status by user ID
  getIotStatusByUserId: (userId) => {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM iot_status WHERE user_id = ?`,
        [userId],
        (err, row) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(row);
        }
      );
    });
  },

  // Upsert IoT status (create or update)
  upsertIotStatus: (userId, status) => {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO iot_status (user_id, status, updated_at)
         VALUES (?, ?, datetime('now'))
         ON CONFLICT(user_id) DO UPDATE SET
           status = excluded.status,
           updated_at = datetime('now')`,
        [userId, status],
        function (err) {
          if (err) {
            reject(err);
            return;
          }
          // Return the updated status
          db.get(
            `SELECT * FROM iot_status WHERE user_id = ?`,
            [userId],
            (err, row) => {
              if (err) {
                reject(err);
                return;
              }
              resolve(row);
            }
          );
        }
      );
    });
  },

  // ========== PROFILE SEARCH HELPERS ==========

  // Get profiles with optional search filter (for vendor farmer search)
  getProfiles: (filter = {}) => {
    return new Promise((resolve, reject) => {
      let query = `SELECT p.id, p.full_name, p.crops_grown, p.available_quantity, p.location, p.expected_price 
                   FROM profiles p
                   INNER JOIN users u ON p.id = u.id
                   WHERE u.role = 'farmer'`;
      const params = [];

      // Search filter (case-insensitive substring match on name and location)
      if (filter.q) {
        query += ` AND (LOWER(p.full_name) LIKE ? OR LOWER(p.location) LIKE ?)`;
        const searchTerm = `%${filter.q.toLowerCase()}%`;
        params.push(searchTerm, searchTerm);
      }

      query += ` ORDER BY p.id DESC`;

      db.all(query, params, (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows || []);
      });
    });
  },

  // Fetch sensor readings from ThingSpeak
  fetchThingSpeakReadings: async (limit = 24) => {
    const axios = require('axios');
    const THINGSPEAK_API_KEY = 'OTIJXUV8A9RZ1VVC'; // Read API Key
    const CHANNEL_ID = '3189406'; // Correct Channel ID from user's ThingSpeak setup

    try {
      // ThingSpeak API endpoint to get channel feeds
      const url = `https://api.thingspeak.com/channels/${CHANNEL_ID}/feeds.json?api_key=${THINGSPEAK_API_KEY}&results=${limit}`;

      const response = await axios.get(url, { timeout: 10000 });

      if (!response.data || !response.data.feeds) {
        console.warn('No data from ThingSpeak, returning empty array');
        return [];
      }

      // Transform ThingSpeak data to our format
      const readings = response.data.feeds.map(feed => ({
        timestamp: feed.created_at,
        temperature: parseFloat(feed.field1) || 0,  // Field 1: Temperature
        humidity: parseFloat(feed.field2) || 0,      // Field 2: Humidity
        soil_moisture: parseFloat(feed.field3) || 0  // Field 3: Soil Moisture
      }));

      // Reverse array so newest data is first
      readings.reverse();

      const latestTimestamp = readings[0]?.timestamp || 'none';
      console.log(`✅ Fetched ${readings.length} readings from ThingSpeak (latest: ${latestTimestamp})`);
      return readings;

    } catch (error) {
      console.error('❌ Error fetching ThingSpeak data:', error.message);
      // Return empty array on error (NO MOCK DATA)
      return [];
    }
  },

  // ========== EXPERTS HELPERS ==========

  // Get experts with search and filter
  getExperts: ({ q, specialization, limit = 20, offset = 0 }) => {
    return new Promise((resolve, reject) => {
      let where = [];
      let params = [];

      if (q) {
        where.push("(name LIKE ? OR specializations LIKE ?)");
        params.push(`%${q}%`, `%${q}%`);
      }
      if (specialization) {
        where.push("specializations LIKE ?");
        params.push(`%${specialization}%`);
      }

      let whereSQL = where.length ? "WHERE " + where.join(" AND ") : "";
      const sql = `SELECT id, name, experience_years, specializations, rating, consultation_count, phone_number FROM experts_info ${whereSQL} ORDER BY rating DESC LIMIT ? OFFSET ?`;
      params.push(Number(limit), Number(offset));

      db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows || []);
      });
    });
  },

  // ========== FORUM HELPERS ==========

  // Get all forum posts with replies
  getForumPosts: () => {
    return new Promise((resolve, reject) => {
      // First get all posts
      db.all(
        `SELECT fp.id, fp.user_id, fp.category, fp.community, fp.question, fp.extracted_keywords,
                fp.status, fp.upvotes, fp.reply_count, fp.created_at, p.full_name as user_name
         FROM forum_posts fp
         LEFT JOIN profiles p ON fp.user_id = p.id
         ORDER BY fp.created_at DESC`,
        [],
        (err, posts) => {
          if (err) {
            reject(err);
            return;
          }

          if (!posts || posts.length === 0) {
            resolve([]);
            return;
          }

          // Then get all replies
          db.all(
            `SELECT * FROM forum_replies ORDER BY created_at ASC`,
            [],
            (err, replies) => {
              if (err) {
                reject(err);
                return;
              }

              // Map replies to posts
              const postsWithReplies = posts.map(post => {
                return {
                  ...post,
                  replies: replies.filter(reply => reply.post_id === post.id)
                };
              });

              resolve(postsWithReplies);
            }
          );
        }
      );
    });
  },

  // Create forum post
  createForumPost: (userId, category, question, community, extractedKeywords) => {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO forum_posts (user_id, category, community, question, extracted_keywords, status, upvotes, reply_count) 
         VALUES (?, ?, ?, ?, ?, 'Unanswered', 0, 0)`,
        [userId, category, community || category, question, extractedKeywords || ''],
        function (err) {
          if (err) {
            reject(err);
            return;
          }
          resolve({ id: this.lastID });
        }
      );
    });
  },

  // Create forum reply
  createForumReply: (postId, replyText, repliedBy) => {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO forum_replies (post_id, reply_text, replied_by, upvotes) VALUES (?, ?, ?, 0)`,
        [postId, replyText, repliedBy],
        function (err) {
          if (err) {
            reject(err);
            return;
          }

          // Increment reply_count in forum_posts
          db.run(
            `UPDATE forum_posts SET reply_count = reply_count + 1 WHERE id = ?`,
            [postId],
            (updateErr) => {
              if (updateErr) console.error('Error updating reply_count:', updateErr);
            }
          );

          resolve({ id: this.lastID });
        }
      );
    });
  },

  // Increment post upvotes
  incrementPostUpvotes: (postId) => {
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE forum_posts SET upvotes = upvotes + 1 WHERE id = ?`,
        [postId],
        function (err) {
          if (err) {
            reject(err);
            return;
          }
          // Get updated count
          db.get(`SELECT upvotes FROM forum_posts WHERE id = ?`, [postId], (err, row) => {
            if (err) reject(err);
            else resolve({ upvotes: row?.upvotes || 0 });
          });
        }
      );
    });
  },

  // Decrement post upvotes
  decrementPostUpvotes: (postId) => {
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE forum_posts SET upvotes = upvotes - 1 WHERE id = ?`,
        [postId],
        function (err) {
          if (err) {
            reject(err);
            return;
          }
          // Get updated count
          db.get(`SELECT upvotes FROM forum_posts WHERE id = ?`, [postId], (err, row) => {
            if (err) reject(err);
            else resolve({ upvotes: row?.upvotes || 0 });
          });
        }
      );
    });
  },

  // ========== FARMER FORUM HELPERS (Intelligent Q&A System) ==========

  // Get all farmer forum posts
  getFarmerForumPosts: () => {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM farmer_forum ORDER BY created_at DESC`,
        [],
        (err, rows) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(rows || []);
        }
      );
    });
  },

  // Search farmer forum by keywords and community with intelligent ranking
  searchFarmerForumByKeywords: (keywords, community) => {
    return new Promise((resolve, reject) => {
      // Build the query to match keywords and community
      const keywordArray = keywords.split(',').map(k => k.trim().toLowerCase()).filter(k => k);

      if (keywordArray.length === 0) {
        // No keywords, just filter by community if provided
        const query = community
          ? `SELECT * FROM farmer_forum WHERE community = ? ORDER BY created_at DESC LIMIT 10`
          : `SELECT * FROM farmer_forum ORDER BY created_at DESC LIMIT 10`;
        const params = community ? [community] : [];

        db.all(query, params, (err, rows) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(rows || []);
        });
        return;
      }

      // Get all posts from the specified community (or all if no community)
      const query = community
        ? `SELECT * FROM farmer_forum WHERE community = ?`
        : `SELECT * FROM farmer_forum`;
      const params = community ? [community] : [];

      db.all(query, params, (err, rows) => {
        if (err) {
          reject(err);
          return;
        }

        if (!rows || rows.length === 0) {
          resolve([]);
          return;
        }

        // Rank posts by keyword matching
        const rankedPosts = rows.map(post => {
          const postKeywords = (post.highlighted_keywords || '').toLowerCase();
          const postQuestion = (post.question || '').toLowerCase();
          const postAnswer = (post.answer || '').toLowerCase();

          let matchScore = 0;
          keywordArray.forEach(keyword => {
            if (postKeywords.includes(keyword)) matchScore += 3; // Keywords match is most important
            if (postQuestion.includes(keyword)) matchScore += 2;
            if (postAnswer.includes(keyword)) matchScore += 1;
          });

          return {
            ...post,
            matchScore
          };
        });

        // Sort by match score (descending), then by recency
        rankedPosts.sort((a, b) => {
          if (b.matchScore !== a.matchScore) {
            return b.matchScore - a.matchScore;
          }
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });

        // Return top 10 results
        const topResults = rankedPosts.slice(0, 10);

        // Remove matchScore before returning
        const cleanResults = topResults.map(({ matchScore, ...post }) => post);

        resolve(cleanResults);
      });
    });
  }
};


module.exports = {
  db,
  initDatabase,
  dbHelpers
};
