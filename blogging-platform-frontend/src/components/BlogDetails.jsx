import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import CommentSection from './CommentSection';
import { getBlog, likeBlog, deleteBlog } from '../api/blogs';

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  })();

  // 🎯 Fetch blog data
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data } = await getBlog(id);
        setBlog(data);
        setLikeCount(data.likes.length);
        if (user && data.likes.includes(user._id)) {
          setLiked(true);
        }
      } catch (err) {
        console.error('❌ Failed to load blog:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, user]);

  // ❤️ Handle like
  const handleLike = async () => {
    try {
      const { data } = await likeBlog(id);
      setLiked(data.liked);
      setLikeCount((prev) => (data.liked ? prev + 1 : prev - 1));
    } catch (err) {
      alert('❌ Please log in to like posts.');
    }
  };

  // 🗑️ Handle delete
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;

    try {
      await deleteBlog(id);
      alert('✅ Blog deleted.');
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('❌ Failed to delete blog');
    }
  };

  // ⏳ Loading state
  if (loading) {
    return <p className="text-center mt-10 text-gray-500">Loading blog...</p>;
  }

  // ❌ Not found state
  if (!blog) {
    return <p className="text-center mt-10 text-red-500">Blog not found.</p>;
  }

  return (
    <motion.div
      className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 mt-6 sm:mt-10 bg-white rounded-xl shadow-lg"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* 🖼 Banner image */}
      {blog.image && (
        <motion.img
          src={blog.image}
          alt="Blog Banner"
          className="w-full h-56 sm:h-64 object-cover rounded-lg mb-6"
          onError={(e) => (e.target.src = '/fallback.jpg')}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        />
      )}

      {/* 📝 Title */}
      <motion.h1
        className="text-2xl sm:text-4xl font-bold text-[#4EA685] mb-2"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {blog.title}
      </motion.h1>

      {/* ✍️ Author */}
      <p className="text-sm text-gray-500 mb-4">
        By <span className="font-medium">{blog.author?.name || 'Unknown'}</span> •{' '}
        {new Date(blog.createdAt).toLocaleDateString()}
      </p>

      {/* 📃 Content */}
      <motion.div
        className="prose prose-sm sm:prose-lg max-w-none mb-6"
        dangerouslySetInnerHTML={{ __html: blog.content }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      />

      {/* 🔘 Buttons */}
      <div className="mb-6 flex gap-4 flex-wrap">
        <motion.button
          onClick={handleLike}
          className={`px-6 py-2 rounded transition text-sm sm:text-base shadow-sm ${
            liked ? 'bg-[#3e9372]' : 'bg-[#4EA685] hover:bg-[#3e9372]'
          } text-white`}
          whileTap={{ scale: 0.95 }}
        >
          ❤️ {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
        </motion.button>

        {user && (user._id === blog.author._id || user.isAdmin) && (
          <motion.button
            onClick={handleDelete}
            className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition text-sm sm:text-base"
            whileTap={{ scale: 0.95 }}
          >
            🗑️ Delete Blog
          </motion.button>
        )}
      </div>

      {/* 💬 Comments */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <CommentSection blogId={id} comments={blog.comments} />
      </motion.div>
    </motion.div>
  );
};

export default BlogDetails;
