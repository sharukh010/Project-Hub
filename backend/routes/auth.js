const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require("../models/user");
const Post = require("../models/post")
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Register
router.post('/register', [
  body('username')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return res.status(400).json({ 
        error: existingUser.email === email ? 'Email already registered' : 'Username already taken'
      });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password
    });

    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profile: user.profile
      }
    });

  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete post
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this post' });
    }

    await Post.findByIdAndDelete(req.params.id);

    // Remove from all users' saved posts
    await User.updateMany(
      { savedPosts: req.params.id },
      { $pull: { savedPosts: req.params.id } }
    );

    res.json({ message: 'Post deleted successfully' });

  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Like/unlike post
router.post('/:id/like', authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const isAlreadyLiked = post.likes.includes(req.user._id);

    if (isAlreadyLiked) {
      post.likes = post.likes.filter(id => id.toString() !== req.user._id.toString());
      await post.save();
      return res.json({ 
        message: 'Post unliked', 
        liked: false, 
        likesCount: post.likes.length 
      });
    } else {
      post.likes.push(req.user._id);
      await post.save();
      return res.json({ 
        message: 'Post liked', 
        liked: true, 
        likesCount: post.likes.length 
      });
    }

  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's own posts
router.get('/user/my-posts', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ author: req.user._id })
      .select('title slug excerpt featuredImage tags difficulty category likes views createdAt readTime isPublished')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments({ author: req.user._id });

    const postsWithCount = posts.map(post => {
      const postObj = post.toObject();
      postObj.likesCount = post.likes.length;
      delete postObj.likes;
      return postObj;
    });

    res.json({
      posts: postsWithCount,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalPosts: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get user posts error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get post for editing (only author can access)
router.get('/edit/:id', authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to edit this post' });
    }

    res.json({ post });

  } catch (error) {
    console.error('Get post for edit error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get trending tags
router.get('/stats/trending-tags', async (req, res) => {
  try {
    const trendingTags = await Post.aggregate([
      { $match: { isPublished: true } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);

    res.json({ trendingTags });

  } catch (error) {
    console.error('Get trending tags error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get platform statistics
router.get('/stats/platform', async (req, res) => {
  try {
    const totalPosts = await Post.countDocuments({ isPublished: true });
    const totalUsers = await User.countDocuments();
    
    const categoryStats = await Post.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const difficultyStats = await Post.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: '$difficulty', count: { $sum: 1 } } }
    ]);

    res.json({
      totalPosts,
      totalUsers,
      categoryStats,
      difficultyStats
    });

  } catch (error) {
    console.error('Get platform stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;