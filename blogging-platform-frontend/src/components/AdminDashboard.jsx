import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchAllBlogs, fetchAllUsers } from '../api/admin';
import { deleteBlog } from '../api/blogs';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [blogsRes, usersRes] = await Promise.all([
          fetchAllBlogs(),
          fetchAllUsers(),
        ]);
        setPosts(blogsRes.data || []);
        setUsers(usersRes.data || []);
        setError(null);
      } catch (err) {
        console.error('Admin fetch failed:', err);
        setError('Access denied or failed to fetch admin data.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleDeleteBlog = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this blog?');
    if (!confirm) return;

    try {
      await deleteBlog(id);
      setPosts((prev) => prev.filter((p) => p._id !== id));
      alert('✅ Blog deleted.');
    } catch (err) {
      console.error(err);
      alert('❌ Failed to delete blog.');
    }
  };

  return (
    <motion.div
      className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 mt-6 sm:mt-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-2xl sm:text-3xl font-bold text-[#4EA685] mb-6 text-center sm:text-left">
        Admin Dashboard
      </h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading dashboard data...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Blogs Panel */}
          <div className="bg-white border border-gray-200 p-4 sm:p-6 rounded-lg shadow hover:shadow-md transition">
            <h2 className="text-lg sm:text-xl font-semibold text-[#4EA685] mb-4">
              All Blogs ({posts.length})
            </h2>
            {posts.length === 0 ? (
              <p className="text-gray-400 italic">No blogs available.</p>
            ) : (
              <ul className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {posts
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map((post) => (
                    <li
                      key={post._id}
                      className="border border-gray-100 p-3 rounded-md bg-gray-50 text-sm sm:text-base"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <span className="font-medium">{post.title}</span>{' '}
                          <span className="text-gray-500 text-xs block sm:inline">
                            by {post.author?.name || 'Unknown'} on{' '}
                            {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <Link
                            to={`/blog/${post._id}`}
                            className="text-blue-500 hover:underline text-sm"
                          >
                            View
                          </Link>
                          <Link
                            to={`/edit/${post._id}`}
                            className="text-yellow-500 hover:underline text-sm"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDeleteBlog(post._id)}
                            className="text-red-500 hover:underline text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
              </ul>
            )}
          </div>

          {/* Users Panel */}
          <div className="bg-white border border-gray-200 p-4 sm:p-6 rounded-lg shadow hover:shadow-md transition">
            <h2 className="text-lg sm:text-xl font-semibold text-[#4EA685] mb-4">
              All Users ({users.length})
            </h2>
            {users.length === 0 ? (
              <p className="text-gray-400 italic">No users found.</p>
            ) : (
              <ul className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {users
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map((user) => (
                    <li
                      key={user._id}
                      className="border border-gray-100 p-3 rounded-md bg-gray-50 text-sm sm:text-base flex items-center gap-3"
                    >
                      <div className="w-8 h-8 flex items-center justify-center bg-[#4EA685] text-white rounded-full text-xs font-bold">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-gray-500 text-xs">{user.email}</div>
                      </div>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AdminDashboard;
