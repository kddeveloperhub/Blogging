const express = require('express');
const {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  toggleLike,
  addComment,
  getAllBlogs,
  // getMyBlogs, ❌ Removed
} = require('../controllers/blogController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// ✅ Admin-only route to get all blogs
router.get('/admin/all', protect, adminOnly, getAllBlogs);

// ✅ Public & protected blog routes
router.get('/', getBlogs);
router.post('/', protect, createBlog);
router.get('/:id', getBlogById);
router.put('/:id', protect, updateBlog);
router.delete('/:id', protect, deleteBlog);
router.put('/:id/like', protect, toggleLike);
router.post('/:id/comments', protect, addComment);

module.exports = router;
