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
  }
};

module.exports = {
  db,
  initDatabase,
  dbHelpers
};
