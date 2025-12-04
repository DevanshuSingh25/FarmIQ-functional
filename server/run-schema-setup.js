/**
 * Execute Supabase schema setup using Supabase's query method
 * This creates all tables directly via the JavaScript client
 */

const supabase = require('./supabase-client');

async function createTable(sql, tableName) {
    console.log(`\n📝 Creating table: ${tableName}...`);

    try {
        const { data, error } = await supabase.rpc('exec_sql', { query: sql });

        if (error) {
            // If exec_sql RPC doesn't exist, we'll use a different approach
            if (error.code === '42883') {
                console.log(`   ⚠️  RPC method not available, using SQL Editor instead`);
                return false;
            }
            console.error(`   ❌ Error:`, error.message);
            throw error;
        }

        console.log(`   ✅ Table ${tableName} created successfully`);
        return true;
    } catch (err) {
        console.error(`   ❌ Failed to create ${tableName}:`, err.message);
        throw err;
    }
}

async function setupSchema() {
    console.log('🚀 Setting up Supabase schema...\n');
    console.log('='.repeat(60));

    const tables = [
        {
            name: 'users',
            sql: `
        CREATE TABLE users (
          id BIGSERIAL PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          role TEXT DEFAULT 'farmer',
          phone TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
        CREATE INDEX idx_users_email ON users (email);
      `
        },
        {
            name: 'profiles',
            sql: `
        CREATE TABLE profiles (
          id BIGINT PRIMARY KEY,
          full_name TEXT,
          email TEXT,
          phone_number TEXT,
          language_pref TEXT DEFAULT 'en',
          location TEXT,
          crops_grown TEXT,
          available_quantity TEXT,
          expected_price TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW(),
          FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
        );
      `
        },
        {
            name: 'ngo_schemes',
            sql: `
        CREATE TABLE ngo_schemes (
          id BIGSERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          ministry TEXT,
          deadline TEXT,
          location TEXT,
          contact_number TEXT,
          no_of_docs_required INTEGER DEFAULT 0,
          status TEXT DEFAULT 'active',
          benefit_text TEXT,
          eligibility_text TEXT,
          scheme_type TEXT DEFAULT 'government',
          required_state TEXT,
          min_land REAL,
          max_land REAL,
          required_category TEXT,
          age_min INTEGER,
          age_max INTEGER,
          official_link TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
        CREATE INDEX idx_ngo_name ON ngo_schemes(name);
        CREATE INDEX idx_ngo_status ON ngo_schemes(status);
        CREATE INDEX idx_ngo_scheme_type ON ngo_schemes(scheme_type);
        CREATE INDEX idx_ngo_required_state ON ngo_schemes(required_state);
      `
        },
        {
            name: 'soil_lab',
            sql: `
        CREATE TABLE soil_lab (
          id BIGSERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          location TEXT,
          contact_number TEXT,
          price REAL,
          rating REAL,
          tag TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
        CREATE INDEX idx_soil_name ON soil_lab(name);
        CREATE INDEX idx_soil_location ON soil_lab(location);
      `
        },
        {
            name: 'crop_history',
            sql: `
        CREATE TABLE crop_history (
          id BIGSERIAL PRIMARY KEY,
          user_id BIGINT NOT NULL,
          crop_name TEXT NOT NULL,
          crop_price REAL,
          selling_price REAL,
          crop_produced_kg REAL,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW(),
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
        CREATE INDEX idx_crop_history_user ON crop_history(user_id);
      `
        },
        {
            name: 'iot_reading',
            sql: `
        CREATE TABLE iot_reading (
          id BIGSERIAL PRIMARY KEY,
          user_id BIGINT NOT NULL,
          name TEXT NOT NULL,
          phone_number TEXT NOT NULL,
          location TEXT,
          state TEXT,
          district TEXT,
          preferred_visit_date TEXT,
          status TEXT DEFAULT 'pending',
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW(),
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
        CREATE INDEX idx_iot_reading_user_id ON iot_reading(user_id);
      `
        },
        {
            name: 'iot_status',
            sql: `
        CREATE TABLE iot_status (
          user_id BIGINT PRIMARY KEY,
          status TEXT NOT NULL DEFAULT 'inactive',
          updated_at TIMESTAMPTZ DEFAULT NOW(),
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
      `
        },
        {
            name: 'experts_info',
            sql: `
        CREATE TABLE experts_info (
          id BIGSERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          experience_years INTEGER NOT NULL DEFAULT 0,
          specializations TEXT,
          rating REAL DEFAULT 0.0,
          consultation_count INTEGER DEFAULT 0,
          phone_number TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
        },
        {
            name: 'farmer_forum',
            sql: `
        CREATE TABLE farmer_forum (
          id BIGSERIAL PRIMARY KEY,
          question TEXT NOT NULL,
          highlighted_keywords TEXT,
          community TEXT NOT NULL,
          answer TEXT NOT NULL,
          expert_name TEXT NOT NULL,
          expert_role TEXT NOT NULL,
          upvotes INTEGER DEFAULT 0,
          replies INTEGER DEFAULT 0,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
        },
        {
            name: 'forum_posts',
            sql: `
        CREATE TABLE forum_posts (
          id BIGSERIAL PRIMARY KEY,
          user_id BIGINT NOT NULL,
          category TEXT NOT NULL,
          question TEXT NOT NULL,
          community TEXT,
          status TEXT DEFAULT 'Answered',
          extracted_keywords TEXT,
          upvotes INTEGER DEFAULT 0,
          reply_count INTEGER DEFAULT 0,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          FOREIGN KEY (user_id) REFERENCES users(id)
        );
      `
        },
        {
            name: 'forum_replies',
            sql: `
        CREATE TABLE forum_replies (
          id BIGSERIAL PRIMARY KEY,
          post_id BIGINT NOT NULL,
          reply_text TEXT NOT NULL,
          replied_by TEXT NOT NULL,
          upvotes INTEGER DEFAULT 0,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          FOREIGN KEY (post_id) REFERENCES forum_posts(id)
        );
      `
        }
    ];

    console.log(`\n📋 Will create ${tables.length} tables\n`);

    try {
        // Try using RPC first
        for (const table of tables) {
            const success = await createTable(table.sql, table.name);
            if (!success) {
                // RPC not available, fall back to manual instructions
                console.log('\n⚠️  Direct SQL execution not available via JavaScript client.');
                console.log('📌 Please run the schema manually in Supabase dashboard:');
                console.log('   1. Go to: https://rzrawloihpdozkvumpye.supabase.co');
                console.log('   2. Navigate to: SQL Editor');
                console.log('   3. Open and run file: setup-supabase-schema.sql\n');
                process.exit(0);
            }
        }

        console.log('\n' + '='.repeat(60));
        console.log('✅ All tables created successfully!\n');

    } catch (error) {
        console.error('\n❌ Schema setup failed:', error.message);
        console.log('\n📌 Alternative: Run SQL schema manually in Supabase dashboard');
        console.log('   File location: setup-supabase-schema.sql\n');
        process.exit(1);
    }
}

setupSchema();
