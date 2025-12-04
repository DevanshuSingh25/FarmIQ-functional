/**
 * Test Supabase connection and list existing tables
 */

const supabase = require('./supabase-client');

async function testConnection() {
    console.log('🔍 Testing Supabase connection...\n');

    try {
        // Try to query an existing table or get database info
        const { data, error } = await supabase
            .from('users')
            .select('count')
            .limit(1);

        if (error) {
            if (error.code === '42P01') {
                console.log('✅ Connection successful!');
                console.log('⚠️  tables table does not exist yet (expected)');
                console.log('\n📌 Next step: Run the SQL schema in Supabase dashboard\n');
                return true;
            }
            console.error('❌ Connection error:', error.message);
            return false;
        }

        console.log('✅ Connection successful!');
        console.log(' ✅ users table already exists');
        return true;

    } catch (err) {
        console.error('❌ Unexpected error:', err.message);
        return false;
    }
}

testConnection();
