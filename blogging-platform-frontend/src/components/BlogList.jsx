import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function BlogList({ blogs = [] }) {
  if (!blogs.length) {
    return (
      <p className="text-center text-gray-500 italic mt-6">
        No blogs match your criteria.
      </p>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 mt-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {blogs.map((blog, index) => (
          <motion.div
            key={blog._id}
            className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition flex flex-col overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.07, duration: 0.4 }}
          >
            {/* 🖼 Image */}
            {blog.image ? (
              <img
                src={blog.image}
                alt={blog.title}
                onError={(e) => (e.target.src = '/fallback.jpg')}
                className="w-full h-40 sm:h-48 object-cover"
              />
            ) : (
              <div className="w-full h-40 sm:h-48 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                No Image
              </div>
            )}

            {/* 📄 Blog Content */}
            <div className="p-4 flex flex-col flex-grow">
              <h2 className="text-lg sm:text-xl font-semibold text-[#4EA685] line-clamp-2">
                {blog.title}
              </h2>

              <p
                className="text-gray-600 text-sm mt-2 line-clamp-3"
                dangerouslySetInnerHTML={{
                  __html: blog.content
                    ?.replace(/<[^>]+>/g, '')
                    .slice(0, 100) + '...',
                }}
              />

              <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                <span>By {blog.author?.name || 'Anonymous'}</span>
                <Link
                  to={`/blog/${blog._id}`}
                  className="bg-[#4EA685] text-white px-4 py-1 rounded-md hover:bg-[#3e9372] transition flex items-center gap-1"
                >
                  Read More →
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
