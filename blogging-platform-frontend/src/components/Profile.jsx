import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Load user or redirect if not logged in
  useEffect(() => {
    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        navigate('/auth');
      }
    } catch {
      navigate('/auth');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  if (!user) return null;

  return (
    <motion.div
      className="max-w-xl mx-auto px-4 sm:px-6 py-6 sm:py-10 mt-6 sm:mt-10 bg-white rounded-xl shadow-lg"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Profile Header */}
      <div className="flex flex-col items-center text-center">
        <img
          src={`https://i.pravatar.cc/150?u=${user.email}`}
          alt={`${user.name}'s avatar`}
          className="w-24 h-24 rounded-full mb-4 shadow-md object-cover"
        />
        <h1 className="text-xl sm:text-2xl font-bold text-[#4EA685]">{user.name}</h1>
        <p className="text-gray-600 text-sm sm:text-base">{user.email}</p>
      </div>

      {/* Info */}
      <div className="mt-6 space-y-4 text-sm sm:text-base">
        <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg shadow-sm">
          <span className="font-semibold text-[#4EA685]">Name:</span> {user.name}
        </div>
        <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg shadow-sm">
          <span className="font-semibold text-[#4EA685]">Email:</span> {user.email}
        </div>
        <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg shadow-sm">
          <span className="font-semibold text-[#4EA685]">Role:</span>{' '}
          {user.isAdmin ? 'Admin' : 'User'}
        </div>
      </div>

      {/* Logout Button */}
      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={handleLogout}
        className="mt-6 w-full sm:w-auto bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-md hover:from-red-600 hover:to-red-700 transition"
      >
        Logout
      </motion.button>
    </motion.div>
  );
};

export default Profile;
