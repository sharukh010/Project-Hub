const express = require('express');
const { param, body } = require('express-validator');
const User = require('../models/user');
const Post = require('../models/post');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/:id', [
  param('id').isMongoId().withMessage('Invalid user ID')
], async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -__v -updatedAt -savedPosts');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user profile
router.put('/:id', authenticateToken, [
  param('id').isMongoId().withMessage('Invalid user ID'),
  body('username').optional().isLength({ min: 3, max: 30 }),
  body('email').optional().isEmail(),
  body('profile.bio').optional().isLength({ max: 500 }),
  body('profile.skills').optional().isArray(),
  body('profile.experience').optional().isIn(['Beginner', 'Intermediate', 'Advanced']),
  body('profile.github').optional().isURL(),
  body('profile.linkedin').optional().isURL(),
  body('profile.website').optional().isURL()
], async (req, res) => {
  try {
    if (req.params.id !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to update this profile' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { username, email, profile } = req.body;

    // Check if username or email already exists
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ error: 'Username already taken' });
      }
      user.username = username;
    }

    if (email && email !== user.email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ error: 'Email already registered' });
      }
      user.email = email;
    }

    // Update profile fields if provided
    if (profile) {
      user.profile = { ...user.profile.toObject(), ...profile };
    }

    await user.save();
    
    // Remove sensitive data before sending response
    const userObj = user.toObject();
    delete userObj.password;
    
    res.json({ message: 'Profile updated successfully', user: userObj });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's posts
router.get('/:id/posts', [
  param('id').isMongoId().withMessage('Invalid user ID')
], async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ author: req.params.id, isPublished: true })
      .populate('author', 'username profile.avatar')
      .select('-content -__v -updatedAt')
      .sort({ createdAt: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    const total = await Post.countDocuments({ author: req.params.id, isPublished: true });

    res.json({
      posts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalPosts: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get user posts error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Save/unsave post
router.post('/save-post/:postId', authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const user = await User.findById(req.user._id);
    const postIndex = user.savedPosts.indexOf(post._id);
    
    if (postIndex === -1) {
      // Save post
      user.savedPosts.push(post._id);
      await user.save();
      res.json({ message: 'Post saved successfully', saved: true });
    } else {
      // Unsave post
      user.savedPosts.splice(postIndex, 1);
      await user.save();
      res.json({ message: 'Post unsaved successfully', saved: false });
    }
  } catch (error) {
    console.error('Save post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get saved posts
router.get('/saved/posts', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const user = await User.findById(req.user._id)
      .populate({
        path: 'savedPosts',
        select: '-content -__v -updatedAt',
        options: {
          sort: { createdAt: -1 },
          skip: parseInt(skip),
          limit: parseInt(limit)
        },
        populate: {
          path: 'author',
          select: 'username profile.avatar'
        }
      });

    const total = user.savedPosts.length;

    res.json({
      posts: user.savedPosts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalPosts: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get saved posts error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;