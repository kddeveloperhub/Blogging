import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import { motion } from 'framer-motion';
import 'react-quill/dist/quill.snow.css';

export default function BlogEditor({ onSubmit, initialData }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [imageError, setImageError] = useState(false);

  // Load initial data if editing
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setContent(initialData.content || '');
      setCategory(initialData.category || '');
      setImage(initialData.image || '');
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert('Title and content are required.');
      return;
    }

    onSubmit?.({ title, content, category, image });
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-6 mt-6 bg-white rounded-lg shadow-md space-y-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-semibold text-[#4EA685] mb-1">
          Blog Title
        </label>
        <input
          id="title"
          type="text"
          placeholder="Enter blog title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4EA685]"
          required
        />
      </div>

      {/* Category */}
      <div>
        <label htmlFor="category" className="block text-sm font-semibold text-[#4EA685] mb-1">
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4EA685]"
          required
        >
          <option value="">Select category</option>
          <option value="Tech">Tech</option>
          <option value="Life">Life</option>
          <option value="Travel">Travel</option>
        </select>
      </div>

      {/* Image URL */}
      <div>
        <label htmlFor="image" className="block text-sm font-semibold text-[#4EA685] mb-1">
          Cover Image URL (optional)
        </label>
        <input
          id="image"
          type="url"
          placeholder="https://..."
          value={image}
          onChange={(e) => {
            setImage(e.target.value);
            setImageError(false);
          }}
          className="w-full border border-gray-300 px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4EA685]"
        />
        {image && !imageError && (
          <div className="mt-3">
            <img
              src={image}
              alt="Cover Preview"
              onError={() => setImageError(true)}
              className="w-full max-h-60 object-cover rounded-md border border-gray-200 shadow-sm"
            />
          </div>
        )}
        {image && imageError && (
          <p className="text-red-500 text-sm mt-1">⚠️ Invalid image URL.</p>
        )}
      </div>

      {/* Blog Content */}
      <div>
        <label htmlFor="content" className="block text-sm font-semibold text-[#4EA685] mb-1">
          Blog Content
        </label>
        <div className="bg-white border border-gray-300 rounded-md overflow-hidden">
          <ReactQuill
            id="content"
            theme="snow"
            value={content}
            onChange={setContent}
            className="min-h-[200px]"
          />
        </div>
      </div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        whileTap={{ scale: 0.96 }}
        className="w-full sm:w-auto block bg-gradient-to-r from-[#4EA685] to-[#57B894] text-white px-6 py-2 rounded-md hover:from-[#3e9372] hover:to-[#4fb086] transition text-sm sm:text-base font-medium"
      >
        {initialData ? 'Update Blog' : 'Publish Blog'}
      </motion.button>
    </motion.form>
  );
}
