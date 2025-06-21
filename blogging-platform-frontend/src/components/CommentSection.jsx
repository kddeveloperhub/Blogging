import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { addComment } from '../api/blogs';

const CommentSection = ({ blogId, comments: initialComments = [] }) => {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState('');
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  })();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (!user) {
      alert('❌ Please log in to post a comment.');
      return;
    }

    try {
      const res = await addComment(blogId, newComment.trim());
      const comment = {
        ...res.data,
        user: { name: user?.name || 'You' },
      };

      setComments((prev) => [...prev, comment]);
      setNewComment('');
    } catch (err) {
      console.error('Failed to post comment:', err);
      alert('⚠️ Could not post comment.');
    }
  };

  return (
    <motion.div
      className="mt-8 px-4 sm:px-6 py-6 bg-white rounded-lg shadow-md"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl sm:text-2xl font-semibold text-[#4EA685] mb-4">
        Comments
      </h2>

      {/* 🗨️ Comment List */}
      <div className="space-y-3 mb-6">
        <AnimatePresence>
          {comments.length === 0 ? (
            <motion.p
              className="text-gray-500 italic"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              No comments yet. Be the first!
            </motion.p>
          ) : (
            comments.map((c, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="border border-gray-200 p-3 rounded-md bg-gray-50 text-sm sm:text-base"
              >
                <span className="font-semibold text-[#4EA685]">{c.user?.name || 'Anonymous'}:</span>{' '}
                <span className="text-gray-700">{c.text}</span>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* ➕ Add Comment Form */}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Write a comment..."
          className="flex-1 border border-gray-300 px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#57B894]"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <motion.button
          type="submit"
          whileTap={{ scale: 0.97 }}
          className="w-full sm:w-auto bg-gradient-to-r from-[#4EA685] to-[#57B894] text-white px-6 py-2 rounded-md hover:from-[#3e9372] hover:to-[#4fb086] transition"
        >
          Post
        </motion.button>
      </form>
    </motion.div>
  );
};

export default CommentSection;
