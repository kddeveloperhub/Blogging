import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import BlogEditor from '../components/BlogEditor';
import { getBlog, updateBlog } from '../api/blogs';

export default function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🧠 Fetch blog on mount
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const { data } = await getBlog(id);

        if (!data || !data.title) {
          throw new Error('Invalid blog data received');
        }

        setInitialData({
          title: data.title,
          content: data.content || '',
          category: data.category || '',
        });
        setError(null);
      } catch (err) {
        console.error('❌ Failed to fetch blog:', err);
        setError('Could not load blog. It may have been deleted or you lack permission.');
        setTimeout(() => navigate('/'), 2000); // Redirect after 2 sec
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, navigate]);

  // ✅ Handle update
  const handleUpdate = async (updatedBlog) => {
    try {
      await updateBlog(id, updatedBlog);
      alert('✅ Blog updated successfully!');
      navigate(`/blog/${id}`);
    } catch (err) {
      console.error('❌ Failed to update blog:', err);
      alert('Update failed. Ensure you are the author or an admin.');
    }
  };

  return (
    <motion.div
      className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 bg-white rounded-xl shadow-md mt-6 sm:mt-10"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl sm:text-3xl font-bold text-[#4EA685] mb-6 text-center sm:text-left">
        Edit Blog
      </h1>

      {loading ? (
        <p className="text-gray-500 italic text-center" role="status">
          Loading blog data...
        </p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <BlogEditor onSubmit={handleUpdate} initialData={initialData} />
      )}
    </motion.div>
  );
}
