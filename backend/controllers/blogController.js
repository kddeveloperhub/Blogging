const Blog = require('../models/Blog');

// ✅ Create Blog
exports.createBlog = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Unauthorized - user not authenticated' });
    }

    const blog = new Blog({
      ...req.body,
      author: req.user._id,
    });

    const saved = await blog.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('❌ Error creating blog:', err.message);
    res.status(400).json({ error: err.message });
  }
};

// ✅ Get Blogs (with pagination, search, category)
exports.getBlogs = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const { category, search } = req.query;
    const query = {};

    if (category) query.category = category;
    if (search) query.title = { $regex: search, $options: 'i' };

    const blogs = await Blog.find(query)
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Blog.countDocuments(query);

    res.json({ blogs, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    console.error('❌ Error fetching blogs:', err.message);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get Blog by ID
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'name email');
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (err) {
    console.error('❌ Error fetching blog:', err.message);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update Blog
exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    const isAuthor = blog.author.toString() === req.user._id.toString();
    const isAdmin = req.user.isAdmin;

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({ message: 'Unauthorized - not author or admin' });
    }

    blog.title = req.body.title || blog.title;
    blog.content = req.body.content || blog.content;
    blog.category = req.body.category || blog.category;
    blog.image = req.body.image || blog.image;

    const updated = await blog.save();
    res.json(updated);
  } catch (err) {
    console.error('❌ Error updating blog:', err.message);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete Blog
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    const isAuthor = blog.author.toString() === req.user._id.toString();
    const isAdmin = req.user.isAdmin;

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({ message: 'Unauthorized - cannot delete blog' });
    }

    await blog.deleteOne();
    res.json({ message: 'Blog deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting blog:', err.message);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Toggle Like / Unlike Blog
exports.toggleLike = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    const userId = req.user._id;

    const liked = blog.likes.includes(userId);
    if (liked) {
      blog.likes.pull(userId);
    } else {
      blog.likes.push(userId);
    }

    await blog.save();
    res.json({ liked: !liked });
  } catch (err) {
    console.error('❌ Error toggling like:', err.message);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Add Comment to Blog
exports.addComment = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    const comment = {
      user: req.user._id,
      text: req.body.text,
    };

    blog.comments.push(comment);
    await blog.save();

    const latestComment = blog.comments[blog.comments.length - 1];
    res.status(201).json(latestComment);
  } catch (err) {
    console.error('❌ Error adding comment:', err.message);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Admin: Get all blogs (no pagination)
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate('author', 'name email')
      .sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    console.error('❌ Error fetching all blogs (admin):', err.message);
    res.status(500).json({ message: 'Failed to fetch blogs' });
  }
};
