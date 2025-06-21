import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import BlogEditor from '../components/BlogEditor';
import { createBlog } from '../api/blogs';

export default function CreateBlog() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async (blogData) => {
    if (!blogData.title || !blogData.content) {
      alert('Please enter a title and content for your blog.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await createBlog(blogData);
      console.log('✅ Blog created:', res.data);
      alert('✅ Blog created successfully!');
      navigate(`/blog/${res.data._id}`);
    } catch (err) {
      console.error('❌ Error creating blog:', err);
      alert('Failed to create blog. Please ensure you are logged in.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 mt-6 sm:mt-10 bg-white rounded-xl shadow-md"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl sm:text-3xl font-bold text-[#4EA685] mb-6 text-center sm:text-left">
        Create New Blog
      </h1>

      {submitting ? (
        <p className="text-center text-gray-500 italic">Submitting your blog...</p>
      ) : (
        <BlogEditor onSubmit={handleCreate} />
      )}
    </motion.div>
  );
}
