const express = require('express');
const { getAllBlogs, getAllUsers } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/blogs', protect, adminOnly, getAllBlogs);
router.get('/users', protect, adminOnly, getAllUsers);

module.exports = router;
