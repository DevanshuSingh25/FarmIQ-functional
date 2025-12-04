/**
 * Cleanup script to delete all data from Supabase tables
 * Run this before re-running the migration
 */

const supabase = require('./supabase-client');

async function cleanupSupabase() {
    console.log('🧹 Cleaning up Supabase tables...\n');

    const tables = [
        'forum_replies',
        'forum_posts',
        'farmer_forum',
        'experts_info',
        'iot_status',
        'iot_reading',
        'crop_history',
        'soil_lab',
        'ngo_schemes',
        'profiles',
        'users'
    ];

    for (const table of tables) {
        console.log(`  Deleting all records from ${table}...`);
        const { error } = await supabase
            .from(table)
            .delete()
            .neq('id', 0); // Delete all (neq catches all records)

        if (error) {
            console.error(`  ❌ Error cleaning ${table}:`, error.message);
        } else {
            console.log(`  ✅ Cleared ${table}`);
        }
    }

    console.log('\n✅ All tables cleaned! Ready for fresh migration.\n');
}

cleanupSupabase();
