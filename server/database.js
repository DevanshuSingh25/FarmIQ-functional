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
      const { id, full_name, email, phone_number, language_pref } = profileData;
      db.run(
        `INSERT INTO profiles (id, full_name, email, phone_number, language_pref) 
         VALUES (?, ?, ?, ?, ?)`,
        [id, full_name || '', email || '', phone_number || '', language_pref || 'en'],
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
  }
};


module.exports = {
  db,
  initDatabase,
  dbHelpers
};
