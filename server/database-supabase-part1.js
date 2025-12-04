const supabase = require('./supabase-client');

// No initialization needed for Supabase (tables created via SQL editor)
const initDatabase = async () => {
    console.log('✅ Supabase database ready (tables should already exist)');
    return Promise.resolve();
};

// Database helper functions - refactored for Supabase
const dbHelpers = {
    // ========== USER HELPERS ==========

    // Insert a new user
    insertUser: async (userData) => {
        try {
            const { email, password_hash, role, phone } = userData;

            const { data, error } = await supabase
                .from('users')
                .insert([{
                    email,
                    password_hash,
                    role: role || 'farmer',
                    phone: phone || ''
                }])
                .select()
                .single();

            if (error) {
                // Check for unique constraint violation
                if (error.code === '23505') {
                    throw new Error('Email already exists');
                }
                throw error;
            }

            return { id: data.id };
        } catch (error) {
            throw error;
        }
    },

    // Find user by role and email (for login)
    findUserByRoleAndEmail: async (role, email) => {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('role', role)
                .eq('email', email)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    // No rows returned
                    return null;
                }
                throw error;
            }

            return data;
        } catch (error) {
            throw error;
        }
    },

    // Find user by email only
    findUserByEmail: async (email) => {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('email', email)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    return null;
                }
                throw error;
            }

            return data;
        } catch (error) {
            throw error;
        }
    },

    // Find user by ID
    findUserById: async (id) => {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('id, role, email, phone, created_at')
                .eq('id', id)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    return null;
                }
                throw error;
            }

            return data;
        } catch (error) {
            throw error;
        }
    },

    // ========== PROFILE HELPERS ==========

    // Insert a new profile
    insertProfile: async (profileData) => {
        try {
            const { id, full_name, email, phone_number, language_pref, location, crops_grown, available_quantity, expected_price } = profileData;

            const { data, error } = await supabase
                .from('profiles')
                .insert([{
                    id,
                    full_name: full_name || '',
                    email: email || '',
                    phone_number: phone_number || '',
                    language_pref: language_pref || 'en',
                    location: location || '',
                    crops_grown: crops_grown || '',
                    available_quantity: available_quantity || '',
                    expected_price: expected_price || ''
                }])
                .select()
                .single();

            if (error) {
                throw error;
            }

            return { id };
        } catch (error) {
            throw error;
        }
    },

    // Find profile by user ID
    findProfileByUserId: async (userId) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    return null;
                }
                throw error;
            }

            return data;
        } catch (error) {
            throw error;
        }
    },

    // Update profile
    updateProfile: async (userId, profileData) => {
        try {
            const { full_name, phone_number, language_pref } = profileData;

            const { data, error } = await supabase
                .from('profiles')
                .update({
                    full_name,
                    phone_number,
                    language_pref,
                    updated_at: new Date().toISOString()
                })
                .eq('id', userId);

            if (error) {
                throw error;
            }

            // Supabase doesn't return a changes count like SQLite, so we simulate it
            return { changes: 1 };
        } catch (error) {
            throw error;
        }
    },

    // ========== NGO SCHEMES HELPERS ==========

    // Get all NGO schemes
    getNgoSchemes: async () => {
        try {
            const { data, error } = await supabase
                .from('ngo_schemes')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                throw error;
            }

            return data || [];
        } catch (error) {
            throw error;
        }
    },

    // Get NGO scheme by ID
    getNgoSchemeById: async (id) => {
        try {
            const { data, error } = await supabase
                .from('ngo_schemes')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    return null;
                }
                throw error;
            }

            return data;
        } catch (error) {
            throw error;
        }
    },

    // Create NGO scheme
    createNgoScheme: async (schemeData) => {
        try {
            const { name, ministry, deadline, location, contact_number, no_of_docs_required, status, benefit_text, eligibility_text } = schemeData;

            const { data, error } = await supabase
                .from('ngo_schemes')
                .insert([{
                    name,
                    ministry: ministry || '',
                    deadline: deadline || '',
                    location: location || '',
                    contact_number: contact_number || '',
                    no_of_docs_required: no_of_docs_required || 0,
                    status: status || 'active',
                    benefit_text: benefit_text || '',
                    eligibility_text: eligibility_text || ''
                }])
                .select()
                .single();

            if (error) {
                throw error;
            }

            return { id: data.id };
        } catch (error) {
            throw error;
        }
    },

    // Update NGO scheme
    updateNgoScheme: async (id, schemeData) => {
        try {
            const { name, ministry, deadline, location, contact_number, no_of_docs_required, status, benefit_text, eligibility_text } = schemeData;

            const { data, error } = await supabase
                .from('ngo_schemes')
                .update({
                    name,
                    ministry,
                    deadline,
                    location,
                    contact_number,
                    no_of_docs_required,
                    status,
                    benefit_text,
                    eligibility_text,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id);

            if (error) {
                throw error;
            }

            return { changes: 1 };
        } catch (error) {
            throw error;
        }
    },

    // Delete NGO scheme
    deleteNgoScheme: async (id) => {
        try {
            const { data, error } = await supabase
                .from('ngo_schemes')
                .delete()
                .eq('id', id);

            if (error) {
                throw error;
            }

            return { changes: 1 };
        } catch (error) {
            throw error;
        }
    },

    // Get eligible government schemes based on farmer's criteria
    getEligibleSchemes: async (filters) => {
        try {
            const { state, land, category, age } = filters;

            console.log('🔍 Filtering schemes with criteria:', { state, land, category, age });

            let query = supabase
                .from('ngo_schemes')
                .select('*');

            // State filter: Match if required_state is NULL, 'ALL', or matches the input state
            if (state) {
                query = query.or(`required_state.is.null,required_state.eq.ALL,required_state.eq.${state}`);
            }

            // Land size filter: Match if within min_land and max_land range
            if (land !== undefined && land !== null) {
                query = query.or(`min_land.is.null,min_land.lte.${land}`)
                    .or(`max_land.is.null,max_land.gte.${land}`);
            }

            // Category filter: Match if required_category is NULL, 'ALL', or matches input
            if (category) {
                query = query.or(`required_category.is.null,required_category.eq.ALL,required_category.eq.${category}`);
            }

            // Age filter: Match if within age_min and age_max range
            if (age !== undefined && age !== null) {
                query = query.or(`age_min.is.null,age_min.lte.${age}`)
                    .or(`age_max.is.null,age_max.gte.${age}`);
            }

            // Order by created_at descending
            query = query.order('created_at', { ascending: false });

            const { data, error } = await query;

            if (error) {
                console.error('❌ Error filtering schemes:', error);
                throw error;
            }

            console.log(`✅ Found ${data?.length || 0} eligible schemes`);
            return data || [];
        } catch (error) {
            throw error;
        }
    },

    // ========== SOIL LAB HELPERS ==========

    // Get all soil labs
    getSoilLabs: async () => {
        try {
            const { data, error } = await supabase
                .from('soil_lab')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                throw error;
            }

            return data || [];
        } catch (error) {
            throw error;
        }
    },

    // Get soil lab by ID
    getSoilLabById: async (id) => {
        try {
            const { data, error } = await supabase
                .from('soil_lab')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    return null;
                }
                throw error;
            }

            return data;
        } catch (error) {
            throw error;
        }
    },

    // Create soil lab
    createSoilLab: async (labData) => {
        try {
            const { name, location, contact_number, price, rating, tag } = labData;

            const { data, error } = await supabase
                .from('soil_lab')
                .insert([{
                    name,
                    location: location || '',
                    contact_number: contact_number || '',
                    price: price || 0,
                    rating: rating || 0,
                    tag: tag || ''
                }])
                .select()
                .single();

            if (error) {
                throw error;
            }

            return { id: data.id };
        } catch (error) {
            throw error;
        }
    },

    // Update soil lab
    updateSoilLab: async (id, labData) => {
        try {
            const { name, location, contact_number, price, rating, tag } = labData;

            const { data, error } = await supabase
                .from('soil_lab')
                .update({
                    name,
                    location,
                    contact_number,
                    price,
                    rating,
                    tag,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id);

            if (error) {
                throw error;
            }

            return { changes: 1 };
        } catch (error) {
            throw error;
        }
    },

    // Delete soil lab
    deleteSoilLab: async (id) => {
        try {
            const { data, error } = await supabase
                .from('soil_lab')
                .delete()
                .eq('id', id);

            if (error) {
                throw error;
            }

            return { changes: 1 };
        } catch (error) {
            throw error;
        }
    },

    // ========== CROP HISTORY HELPERS ==========

    // Get crops by user ID (for farmers)
    getCropsByUserId: async (userId) => {
        try {
            const { data, error } = await supabase
                .from('crop_history')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) {
                throw error;
            }

            return data || [];
        } catch (error) {
            throw error;
        }
    },

    // Get all crops (for admins)
    getAllCrops: async () => {
        try {
            const { data, error } = await supabase
                .from('crop_history')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                throw error;
            }

            return data || [];
        } catch (error) {
            throw error;
        }
    },

    // Get crop by ID
    getCropById: async (id) => {
        try {
            const { data, error } = await supabase
                .from('crop_history')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    return null;
                }
                throw error;
            }

            return data;
        } catch (error) {
            throw error;
        }
    },

    // Create crop (user_id from server, never from client)
    createCrop: async (userId, cropData) => {
        try {
            const { crop_name, crop_price, selling_price, crop_produced_kg } = cropData;

            const { data, error } = await supabase
                .from('crop_history')
                .insert([{
                    user_id: userId,
                    crop_name,
                    crop_price: crop_price || 0,
                    selling_price: selling_price || 0,
                    crop_produced_kg: crop_produced_kg || 0
                }])
                .select()
                .single();

            if (error) {
                throw error;
            }

            return { id: data.id };
        } catch (error) {
            throw error;
        }
    },

    // Update crop
    updateCrop: async (id, cropData) => {
        try {
            const { crop_name, crop_price, selling_price, crop_produced_kg } = cropData;

            const { data, error } = await supabase
                .from('crop_history')
                .update({
                    crop_name,
                    crop_price,
                    selling_price,
                    crop_produced_kg,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id);

            if (error) {
                throw error;
            }

            return { changes: 1 };
        } catch (error) {
            throw error;
        }
    },

    // Delete crop
    deleteCrop: async (id) => {
        try {
            const { data, error } = await supabase
                .from('crop_history')
                .delete()
                .eq('id', id);

            if (error) {
                throw error;
            }

            return { changes: 1 };
        } catch (error) {
            throw error;
        }
    },

    // ========== IOT SENSOR HELPERS ==========

    // Get IoT booking request by user ID
    getIot ReadingByUserId: async (userId) => {
        try {
            const { data, error } = await supabase
                .from('iot_reading')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    return null;
                }
                throw error;
            }

            return data;
        } catch (error) {
            throw error;
        }
    },

    // To be continued in next part...
};

module.exports = {
    initDatabase,
    dbHelpers
};
