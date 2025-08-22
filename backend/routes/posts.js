const express = require('express');
const { body, param, validationResult } = require('express-validator');
const Post = require('../models/post');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

const router = express.Router();

const dummyImages = [
  // Web App Images
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&crop=entropy&auto=format",
  "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=600&fit=crop&crop=entropy&auto=format",
  "https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=600&fit=crop&crop=entropy&auto=format",
  "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop&crop=entropy&auto=format",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&crop=entropy&auto=format",
  
  // Mobile App Images
  "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop&crop=entropy&auto=format",
  "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop&crop=entropy&auto=format",
  "https://images.unsplash.com/photo-1559526324-593bc073d938?w=800&h=600&fit=crop&crop=entropy&auto=format",
  "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&h=600&fit=crop&crop=entropy&auto=format",
  
  // API/Backend Images
  "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&h=600&fit=crop&crop=entropy&auto=format",
  "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=800&h=600&fit=crop&crop=entropy&auto=format",
  "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?w=800&h=600&fit=crop&crop=entropy&auto=format",
  
  // Game Development Images
  "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=600&fit=crop&crop=entropy&auto=format",
  "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=600&fit=crop&crop=entropy&auto=format",
  "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&h=600&fit=crop&crop=entropy&auto=format",
  
  // Data Science/ML Images
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&crop=entropy&auto=format",
  "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=600&fit=crop&crop=entropy&auto=format",
  "https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?w=800&h=600&fit=crop&crop=entropy&auto=format",
  
  // DevOps/Cloud Images
  "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop&crop=entropy&auto=format",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop&crop=entropy&auto=format",
  "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&h=600&fit=crop&crop=entropy&auto=format",
  
  // E-commerce Images
  "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop&crop=entropy&auto=format",
  "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop&crop=entropy&auto=format",
  
  // Portfolio/Personal Website Images
  "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=600&fit=crop&crop=entropy&auto=format",
  "https://images.unsplash.com/photo-1586717799252-bd134ad00e26?w=800&h=600&fit=crop&crop=entropy&auto=format",
  
  // Chat/Social Media Images
  "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=800&h=600&fit=crop&crop=entropy&auto=format",
  "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop&crop=entropy&auto=format"
];

// Category-specific image collections for better matching
const categoryImages = {
  "Web App": [
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&crop=entropy&auto=format",
    "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=600&fit=crop&crop=entropy&auto=format",
    "https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=600&fit=crop&crop=entropy&auto=format",
    "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop&crop=entropy&auto=format",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&crop=entropy&auto=format"
  ],
  "Mobile App": [
    "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop&crop=entropy&auto=format",
    "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop&crop=entropy&auto=format",
    "https://images.unsplash.com/photo-1559526324-593bc073d938?w=800&h=600&fit=crop&crop=entropy&auto=format",
    "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&h=600&fit=crop&crop=entropy&auto=format"
  ],
  "API": [
    "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&h=600&fit=crop&crop=entropy&auto=format",
    "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=800&h=600&fit=crop&crop=entropy&auto=format",
    "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?w=800&h=600&fit=crop&crop=entropy&auto=format"
  ],
  "Game": [
    "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=600&fit=crop&crop=entropy&auto=format",
    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=600&fit=crop&crop=entropy&auto=format",
    "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&h=600&fit=crop&crop=entropy&auto=format"
  ],
  "Desktop App": [
    "https://images.unsplash.com/photo-1586717799252-bd134ad00e26?w=800&h=600&fit=crop&crop=entropy&auto=format",
    "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=600&fit=crop&crop=entropy&auto=format"
  ],
  "CLI Tool": [
    "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&h=600&fit=crop&crop=entropy&auto=format",
    "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=800&h=600&fit=crop&crop=entropy&auto=format"
  ],
  "Library": [
    "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&h=600&fit=crop&crop=entropy&auto=format",
    "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?w=800&h=600&fit=crop&crop=entropy&auto=format"
  ],
  "Other": [
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop&crop=entropy&auto=format",
    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop&crop=entropy&auto=format"
  ]
};


function getDummyImage(category = null, title = null) {
  let imagePool = dummyImages;
  
  // If category is provided and exists in categoryImages, use category-specific images
  if (category && categoryImages[category]) {
    imagePool = categoryImages[category];
  }
  
  
  // Otherwise return a random image
  const randomIndex = Math.floor(Math.random() * imagePool.length);
  return imagePool[randomIndex];
}

// Get all posts with optional filtering
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, category, difficulty, search, tag } = req.query;
    const skip = (page - 1) * limit;
    
    const query = { isPublished: true };
    
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }
    if (tag) query.tags = tag;

    const posts = await Post.find(query)
      .populate('author', 'username profile.avatar')
      .select('-content -__v -updatedAt')
      .sort({ createdAt: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    const total = await Post.countDocuments(query);

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
    console.error('Get posts error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single post by ID or slug
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    let post

    // If id is a valid ObjectId, search by _id
    if (/^[0-9a-fA-F]{24}$/.test(id)) {
      post = await Post.findById(id)
    }
    // Otherwise, treat as slug
    if (!post) {
      post = await Post.findOne({ slug: id })
    }

    if (!post) {
      return res.status(404).json({ error: 'Post not found' })
    }

    res.json({ post })
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
})

// Create new post
router.post('/', authenticateToken, [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('githubRepo').isURL().withMessage('Valid GitHub repo URL is required'),
  body('difficulty').isIn(['Beginner', 'Intermediate', 'Advanced']).withMessage('Invalid difficulty level'),
  body('category').isIn(['Web App', 'Mobile App', 'API', 'Desktop App', 'Game', 'CLI Tool', 'Library', 'Other'])
    .withMessage('Invalid category')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, excerpt, githubRepo, liveDemo, tags, difficulty, category } = req.body;
    
    const post = new Post({
      title,
      content,
      excerpt: excerpt || content.substring(0, 200) + '...',
      githubRepo,
      liveDemo: liveDemo || '',
      tags: Array.isArray(tags) ? tags : [],
      difficulty,
      category,
      author: req.user._id,
      featuredImage: req.body.featuredImage || getDummyImage(category,)
    });

    await post.save();
    res.status(201).json({ message: 'Post created successfully', post });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update post
router.put('/:id', authenticateToken, [
  param('id').isMongoId().withMessage('Invalid post ID')
], async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to update this post' });
    }

    const { title, content, excerpt, githubRepo, liveDemo, tags, difficulty, category, featuredImage } = req.body;
    
    if (title) post.title = title;
    if (content) post.content = content;
    if (excerpt) post.excerpt = excerpt;
    if (githubRepo) post.githubRepo = githubRepo;
    if (liveDemo !== undefined) post.liveDemo = liveDemo;
    if (tags) post.tags = Array.isArray(tags) ? tags : [];
    if (difficulty) post.difficulty = difficulty;
    if (category) post.category = category;
    if (featuredImage !== undefined) post.featuredImage = featuredImage;

    await post.save();
    res.json({ message: 'Post updated successfully', post });
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
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/user/my-posts', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 6 } = req.query
    const posts = await Post.find({ author: req.user._id })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 })

    const totalPosts = await Post.countDocuments({ author: req.user._id })
    res.json({
      posts,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(totalPosts / limit),
        totalPosts
      }
    })
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
})


router.post('/:id/like', authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) return res.status(404).json({ error: 'Post not found' })

    // Like/unlike logic here
    // Example:
    if (!post.likes.includes(req.user._id)) {
      post.likes.push(req.user._id)
    } else {
      post.likes = post.likes.filter(id => id.toString() !== req.user._id.toString())
    }
    await post.save()

    res.json({ message: 'Like updated', post })
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router;