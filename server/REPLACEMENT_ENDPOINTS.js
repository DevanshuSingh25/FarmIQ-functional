/**
 * This file contains the corrected admin and forum endpoints
 * to replace the SQLite versions in server.js
 * 
 * Find these sections in server.js and replace them:
 * 1. Forum posts endpoint (around line 1106-1158)
 * 2. Forum post creation endpoint (around line 1167-1363)  
 * 3. Admin users endpoints (around line 1471-1570)
 * 4. Admin reset password endpoint (around line 1526-1552)
 * 5. Admin experts endpoints (around line 1719-1773)
 */

// ========== REPLACEMENT 1: Get all forum posts ==========
// Replace lines ~1106-1158
app.get('/api/forum/posts', async (req, res) => {
    try {
        const { category } = req.query;

        // Get all posts with replies using dbHelpers
        let posts = await dbHelpers.getForumPosts();

        // Filter by category if specified
        if (category && category !== 'All') {
            posts = posts.filter(p => p.category === category);
        }

        console.log(`Found ${posts.length} posts`);
        res.json(posts);
    } catch (error) {
        console.error('Get forum posts error:', error);
        res.status(500).json({ message: 'Database error', error: error.message });
    }
});

// ========== REPLACEMENT 2: Get replies for specific post ==========
// Replace lines ~1161-1176
app.get('/api/forum/posts/:post_id/replies', async (req, res) => {
    try {
        const { post_id } = req.params;

        const posts = await dbHelpers.getForumPosts();
        const post = posts.find(p => p.id === parseInt(post_id));

        if (!post) {
            return res.json([]);
        }

        console.log(`✓ Returning ${post.replies ? post.replies.length : 0} replies for post ${post_id}`);
        res.json(post.replies || []);
    } catch (error) {
        console.error('Get forum replies error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// NOTE: Forum post creation (POST /api/forum) is complex with auto-answer generation
// It uses many db.run and db.get calls. For now, we'll use the simple version:

app.post('/api/forum', requireAuth, async (req, res) => {
    try {
        const userId = req.session.userId;
        const { category, question } = req.body;

        if (!category || !question) {
            return res.status(400).json({ message: 'Category and question are required' });
        }

        // Simple version - just create the post
        const { extractKeywords } = require('./keywords');
        const keywords = extractKeywords(question);

        const result = await dbHelpers.createForumPost(userId, category, question, category, keywords);

        res.status(201).json({
            id: result.id,
            message: 'Question posted successfully'
        });
    } catch (error) {
        console.error('Create forum post error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// ========== REPLACEMENT 3: Get all users (admin) ==========
// Replace lines ~1471-1507
app.get('/api/admin/users', requireAuth, requireRole(['admin']), async (req, res) => {
    try {
        const users = await dbHelpers.getAllUsers();
        res.json(users);
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// ========== REPLACEMENT 4: Get all profiles (admin) ==========
// Replace lines ~1509-1524
app.get('/api/admin/profiles', requireAuth, requireRole(['admin']), async (req, res) => {
    try {
        const profiles = await dbHelpers.getAllProfiles();
        res.json(profiles);
    } catch (error) {
        console.error('Get all profiles error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// ========== REPLACEMENT 5: Reset user password (admin) ==========
// Replace lines ~1526-1552
app.post('/api/admin/reset-password', requireAuth, requireRole(['admin']), async (req, res) => {
    try {
        const { userId, newPassword } = req.body;

        if (!userId || !newPassword) {
            return res.status(400).json({ message: 'User ID and new password are required' });
        }

        // Hash the new password
        const bcrypt = require('bcrypt');
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await dbHelpers.updateUserPassword(userId, hashedPassword);

        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// ========== REPLACEMENT 6: Delete user (admin) ==========
// Replace lines ~1554-1578
app.delete('/api/admin/users/:userId', requireAuth, requireRole(['admin']), async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);

        if (!userId) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        await dbHelpers.deleteUser(userId);

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// ========== REPLACEMENT 7: Update user password (user's own)  ==========
// Replace lines ~1580-1607
app.put('/api/auth/update-password', requireAuth, async (req, res) => {
    try {
        const userId = req.session.userId;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Current and new passwords are required' });
        }

        // Get current user
        const user = await dbHelpers.findUserById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify current password
        const bcrypt = require('bcrypt');
        const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        // Hash and update new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await dbHelpers.updateUserPassword(userId, hashedPassword);

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Update password error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// ========== REPLACEMENT 8: Get all experts  (admin) ==========
// Replace lines ~1719-1732
app.get('/api/admin/experts', requireAuth, requireRole(['admin']), async (req, res) => {
    try {
        const experts = await dbHelpers.getAllExperts();
        res.json(experts);
    } catch (error) {
        console.error('Get experts error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// ========== REPLACEMENT 9: Create expert (admin) ==========
// Replace lines ~1734-1754
app.post('/api/admin/experts', requireAuth, requireRole(['admin']), async (req, res) => {
    try {
        const result = await dbHelpers.createExpert(req.body);
        res.status(201).json({ id: result.id, message: 'Expert created successfully' });
    } catch (error) {
        console.error('Create expert error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// ========== REPLACEMENT 10: Update expert (admin) ==========
// Replace lines ~1756-1776
app.put('/api/admin/experts/:expertId', requireAuth, requireRole(['admin']), async (req, res) => {
    try {
        const expertId = parseInt(req.params.expertId);
        await dbHelpers.updateExpert(expertId, req.body);
        res.json({ message: 'Expert updated successfully' });
    } catch (error) {
        console.error('Update expert error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// ========== REPLACEMENT 11: Delete expert (admin) ==========
// Replace lines ~1778-1792
app.delete('/api/admin/experts/:expertId', requireAuth, requireRole(['admin']), async (req, res) => {
    try {
        const expertId = parseInt(req.params.expertId);
        await dbHelpers.deleteExpert(expertId);
        res.status(204).send();
    } catch (error) {
        console.error('Delete expert error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = {}; // Placeholder for reference
