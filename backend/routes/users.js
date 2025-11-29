// // routes/users.js
// const express = require('express');
// const User = require('../models/user');
// const Post = require('../models/post');
// const { authenticateToken, optionalAuth } = require('../middleware/auth');

// const router = express.Router();

// // ✅ FIXED: Get user profile by username
// router.get('/:username', optionalAuth, async (req, res) => {
//   try {
//     // Find user by username field, not _id
//     const user = await User.findOne({ username: req.params.username })
//       .select('-email -savedPosts');
    
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     // Get user's posts
//     const posts = await Post.find({ 
//       author: user._id, 
//       isPublished: true 
//     })
//     .select('title slug excerpt featuredImage tags difficulty category likes views createdAt readTime')
//     .sort({ createdAt: -1 });

//     // Add like status if user is authenticated
//     const postsWithLikeStatus = posts.map(post => {
//       const postObj = post.toObject();
//       postObj.likesCount = post.likes.length;
//       postObj.isLiked = req.user ? post.likes.includes(req.user._id) : false;
//       delete postObj.likes;
//       return postObj;
//     });

//     res.json({
//       user,
//       posts: postsWithLikeStatus,
//       totalPosts: posts.length
//     });

//   } catch (error) {
//     console.error('Get user profile error:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // Update user profile (authenticated)
// router.put('/profile', authenticateToken, async (req, res) => {
//   try {
//     const { profile } = req.body;
    
//     const user = await User.findByIdAndUpdate(
//       req.user._id,
//       { 
//         $set: {
//           'profile.bio': profile.bio || '',
//           'profile.skills': profile.skills || [],
//           'profile.experience': profile.experience || 'Beginner',
//           'profile.github': profile.github || '',
//           'profile.linkedin': profile.linkedin || '',
//           'profile.website': profile.website || '',
//           'profile.avatar': profile.avatar || ''
//         }
//       },
//       { new: true, runValidators: true }
//     ).select('-password');

//     res.json({
//       message: 'Profile updated successfully',
//       user
//     });

//   } catch (error) {
//     console.error('Profile update error:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // Save/unsave post
// router.post('/save-post/:postId', authenticateToken, async (req, res) => {
//   try {
//     const { postId } = req.params;
//     const user = await User.findById(req.user._id);

//     const post = await Post.findById(postId);
//     if (!post) {
//       return res.status(404).json({ error: 'Post not found' });
//     }

//     const isAlreadySaved = user.savedPosts.includes(postId);

//     if (isAlreadySaved) {
//       user.savedPosts = user.savedPosts.filter(id => id.toString() !== postId);
//       await user.save();
//       return res.json({ message: 'Post removed from saved', saved: false });
//     } else {
//       user.savedPosts.push(postId);
//       await user.save();
//       return res.json({ message: 'Post saved successfully', saved: true });
//     }

//   } catch (error) {
//     console.error('Save post error:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // Get saved posts
// router.get('/saved-posts', authenticateToken, async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id)
//       .populate({
//         path: 'savedPosts',
//         select: 'title slug excerpt featuredImage tags difficulty category author createdAt readTime',
//         populate: {
//           path: 'author',
//           select: 'username profile.avatar'
//         }
//       });

//     res.json({ savedPosts: user.savedPosts });

//   } catch (error) {
//     console.error('Get saved posts error:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// module.exports = router;

// routes/users.js
const express = require('express');
const User = require('../models/User');
const Post = require('../models/Post');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

const router = express.Router();

//  FIXED: Get user profile by username
router.get('/:username', optionalAuth, async (req, res) => {
  try {
    // Find user by username field, not _id
    const user = await User.findOne({ username: req.params.username })
      .select('-email -savedPosts');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user's posts
    const posts = await Post.find({ 
      author: user._id, 
      isPublished: true 
    })
    .select('title slug excerpt featuredImage tags difficulty category likes views createdAt readTime')
    .sort({ createdAt: -1 });

    // Add like status if user is authenticated
    const postsWithLikeStatus = posts.map(post => {
      const postObj = post.toObject();
      postObj.likesCount = post.likes.length;
      postObj.isLiked = req.user ? post.likes.includes(req.user._id) : false;
      delete postObj.likes;
      return postObj;
    });

    res.json({
      user,
      posts: postsWithLikeStatus,
      totalPosts: posts.length
    });

  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user profile (authenticated)
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { profile } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { 
        $set: {
          'profile.bio': profile.bio || '',
          'profile.skills': profile.skills || [],
          'profile.experience': profile.experience || 'Beginner',
          'profile.github': profile.github || '',
          'profile.linkedin': profile.linkedin || '',
          'profile.website': profile.website || '',
          'profile.avatar': profile.avatar || ''
        }
      },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Save/unsave post
router.post('/save-post/:postId', authenticateToken, async (req, res) => {
  try {
    const { postId } = req.params;
    const user = await User.findById(req.user._id);

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const isAlreadySaved = user.savedPosts.includes(postId);

    if (isAlreadySaved) {
      user.savedPosts = user.savedPosts.filter(id => id.toString() !== postId);
      await user.save();
      return res.json({ message: 'Post removed from saved', saved: false });
    } else {
      user.savedPosts.push(postId);
      await user.save();
      return res.json({ message: 'Post saved successfully', saved: true });
    }

  } catch (error) {
    console.error('Save post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get saved posts
router.get('/saved/posts', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'savedPosts',
        select: 'title slug excerpt featuredImage tags difficulty category author createdAt readTime',
        populate: {
          path: 'author',
          select: 'username profile.avatar'
        }
      });

    res.json({ savedPosts: user.savedPosts });

  } catch (error) {
    console.error('Get saved posts error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;