/**
 * Migration script: SQLite to Supabase (FIXED VERSION)
 * This script migrates all data from the SQLite database to Supabase
 * Handles orphaned records with invalid foreign keys
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const supabase = require('./supabase-client');

// SQLite database path
const dbPath = path.join(__dirname, 'farmiQ.db');
const db = new sqlite3.Database(dbPath);

// Helper to promisify SQLite queries
function sqliteAll(query, params = []) {
    return new Promise((resolve, reject) => {
        db.all(query, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows || []);
        });
    });
}

// Migration functions for each table
async function migrateUsers() {
    console.log('\n📊 Migrating users table...');
    const users = await sqliteAll('SELECT * FROM users ORDER BY id');
    console.log(`   Found ${users.length} users in SQLite`);

    if (users.length === 0) {
        console.log('   ⚠️  No users to migrate');
        return;
    }

    const { data, error } = await supabase
        .from('users')
        .insert(users.map(user => ({
            id: user.id,
            email: user.email,
            password_hash: user.password_hash,
            role: user.role,
            phone: user.phone,
            created_at: user.created_at,
            updated_at: user.updated_at
        })));

    if (error) throw error;
    console.log(`   ✅ Migrated ${users.length} users`);
}

async function migrateProfiles() {
    console.log('\n📊 Migrating profiles table...');
    const profiles = await sqliteAll('SELECT * FROM profiles ORDER BY id');
    console.log(`   Found ${profiles.length} profiles in SQLite`);

    if (profiles.length === 0) return;

    const { error } = await supabase
        .from('profiles')
        .insert(profiles.map(p => ({
            id: p.id, full_name: p.full_name, email: p.email,
            phone_number: p.phone_number, language_pref: p.language_pref,
            location: p.location, crops_grown: p.crops_grown,
            available_quantity: p.available_quantity, expected_price: p.expected_price,
            created_at: p.created_at, updated_at: p.updated_at
        })));

    if (error) throw error;
    console.log(`   ✅ Migrated ${profiles.length} profiles`);
}

async function migrateNgoSchemes() {
    console.log('\n📊 Migrating ngo_schemes table...');
    const schemes = await sqliteAll('SELECT * FROM ngo_schemes ORDER BY id');
    console.log(`   Found ${schemes.length} schemes in SQLite`);

    if (schemes.length === 0) return;

    const { error } = await supabase.from('ngo_schemes').insert(schemes);
    if (error) throw error;
    console.log(`   ✅ Migrated ${schemes.length} schemes`);
}

async function migrateSoilLabs() {
    console.log('\n📊 Migrating soil_lab table...');
    const labs = await sqliteAll('SELECT * FROM soil_lab ORDER BY id');
    console.log(`   Found ${labs.length} soil labs in SQLite`);

    if (labs.length === 0) return;

    const { error } = await supabase.from('soil_lab').insert(labs);
    if (error) throw error;
    console.log(`   ✅ Migrated ${labs.length} soil labs`);
}

async function migrateCropHistory() {
    console.log('\n📊 Migrating crop_history table...');
    const crops = await sqliteAll('SELECT * FROM crop_history ORDER BY id');
    console.log(`   Found ${crops.length} crop records in SQLite`);

    if (crops.length === 0) return;

    const { error } = await supabase.from('crop_history').insert(crops);
    if (error) throw error;
    console.log(`   ✅ Migrated ${crops.length} crop records`);
}

async function migrateIotReading() {
    console.log('\n📊 Migrating iot_reading table...');
    const readings = await sqliteAll('SELECT * FROM iot_reading ORDER BY id');
    console.log(`   Found ${readings.length} IoT readings in SQLite`);

    if (readings.length === 0) return;

    const { error } = await supabase.from('iot_reading').insert(readings);
    if (error) throw error;
    console.log(`   ✅ Migrated ${readings.length} IoT readings`);
}

async function migrateIotStatus() {
    console.log('\n📊 Migrating iot_status table...');
    const statuses = await sqliteAll('SELECT * FROM iot_status ORDER BY user_id');
    console.log(`   Found ${statuses.length} IoT statuses in SQLite`);

    if (statuses.length === 0) return;

    const { error } = await supabase.from('iot_status').insert(statuses);
    if (error) throw error;
    console.log(`   ✅ Migrated ${statuses.length} IoT statuses`);
}

async function migrateExpertsInfo() {
    console.log('\n📊 Migrating experts_info table...');
    const experts = await sqliteAll('SELECT * FROM experts_info ORDER BY id');
    console.log(`   Found ${experts.length} experts in SQLite`);

    if (experts.length === 0) return;

    const { error } = await supabase.from('experts_info').insert(experts);
    if (error) throw error;
    console.log(`   ✅ Migrated ${experts.length} experts`);
}

async function migrateFarmerForum() {
    console.log('\n📊 Migrating farmer_forum table...');
    const items = await sqliteAll('SELECT * FROM farmer_forum ORDER BY id');
    console.log(`   Found ${items.length} farmer forum items in SQLite`);

    if (items.length === 0) return;

    const { error } = await supabase.from('farmer_forum').insert(items);
    if (error) throw error;
    console.log(`   ✅ Migrated ${items.length} farmer forum items`);
}

async function migrateForumPosts() {
    console.log('\n📊 Migrating forum_posts table...');
    const posts = await sqliteAll('SELECT * FROM forum_posts ORDER BY id');
    console.log(`   Found ${posts.length} forum posts in SQLite`);

    if (posts.length === 0) return;

    // Get valid user IDs from Supabase to filter orphaned records
    const { data: validUsers } = await supabase.from('users').select('id');
    const validUserIds = new Set(validUsers.map(u => u.id));

    const validPosts = posts.filter(post => validUserIds.has(post.user_id));
    const skipped = posts.length - validPosts.length;

    if (skipped > 0) {
        console.log(`   ⚠️  Skipping ${skipped} orphaned posts with invalid user_ids`);
    }

    if (validPosts.length > 0) {
        const { error } = await supabase.from('forum_posts').insert(validPosts);
        if (error) throw error;
        console.log(`   ✅ Migrated ${validPosts.length} forum posts`);
    }
}

async function migrateForumReplies() {
    console.log('\n📊 Migrating forum_replies table...');
    const replies = await sqliteAll('SELECT * FROM forum_replies ORDER BY id');
    console.log(`   Found ${replies.length} forum replies in SQLite`);

    if (replies.length === 0) return;

    // Get valid post IDs from Supabase
    const { data: validPosts } = await supabase.from('forum_posts').select('id');
    const validPostIds = new Set(validPosts.map(p => p.id));

    const validReplies = replies.filter(r => validPostIds.has(r.post_id));
    const skipped = replies.length - validReplies.length;

    if (skipped > 0) {
        console.log(`   ⚠️  Skipping ${skipped} replies referencing orphaned posts`);
    }

    if (validReplies.length > 0) {
        const { error } = await supabase.from('forum_replies').insert(validReplies);
        if (error) throw error;
        console.log(`   ✅ Migrated ${validReplies.length} forum replies`);
    }
}

// Main migration function
async function runMigration() {
    console.log('🚀 Starting SQLite to Supabase Migration\n');
    console.log('='.repeat(60));

    try {
        // Migrate in order of dependencies
        await migrateUsers();
        await migrateProfiles();
        await migrateNgoSchemes();
        await migrateSoilLabs();
        await migrateCropHistory();
        await migrateIotReading();
        await migrateIotStatus();
        await migrateExpertsInfo();
        await migrateFarmerForum();
        await migrateForumPosts();
        await migrateForumReplies();

        console.log('\n' + '='.repeat(60));
        console.log('✅ Migration completed successfully!\n');

        // Verify
        const { data: users } = await supabase.from('users').select('id, email, role');
        console.log('📋 Verification Summary:');
        console.log(`   Users in Supabase: ${users?.length || 0}`);

        if (users && users.length >= 7) {
            console.log('\n   ✅ All 7 farmer accounts confirmed:');
            users.forEach(user => {
                console.log(`      - ${user.email} (${user.role})`);
            });
        }

        console.log('\n🎉 Migration complete! Database has been migrated to Supabase.\n');

    } catch (error) {
        console.error('\n❌ Migration failed:', error.message);
        console.error(error);
        process.exit(1);
    } finally {
        db.close();
    }
}

runMigration();
