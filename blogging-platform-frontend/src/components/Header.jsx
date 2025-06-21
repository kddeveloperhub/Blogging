import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiMenu, HiX } from 'react-icons/hi';

const NavLink = ({ to, label, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="hover:underline transition text-white text-base"
  >
    {label}
  </Link>
);

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Load user from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('user');
      if (stored) setUser(JSON.parse(stored));
    } catch {
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="bg-gradient-to-r from-[#4EA685] to-[#57B894] shadow-md p-4 sticky top-0 z-50">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-white tracking-wide">
          MyBlog
        </Link>

        {/* Hamburger toggle (mobile) */}
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="text-white text-2xl sm:hidden"
          aria-label="Toggle Menu"
        >
          {menuOpen ? <HiX /> : <HiMenu />}
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden sm:flex gap-6 items-center text-white text-sm sm:text-base">
          {user && <NavLink to="/create" label="Create" />}
          {user && <NavLink to="/profile" label="Profile" />}
          {user?.isAdmin && <NavLink to="/admin" label="Admin" />}
          {user ? (
            <button
              onClick={handleLogout}
              className="hover:underline font-semibold transition"
              title="Logout"
            >
              Logout {user?.name && <span className="ml-1 text-sm italic">({user.name})</span>}
            </button>
          ) : (
            <NavLink to="/auth" label="Login" />
          )}
        </nav>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="sm:hidden mt-4 px-4 flex flex-col gap-3 text-white animate-fadeIn">
          {user && <NavLink to="/create" label="Create" onClick={() => setMenuOpen(false)} />}
          {user && <NavLink to="/profile" label="Profile" onClick={() => setMenuOpen(false)} />}
          {user?.isAdmin && <NavLink to="/admin" label="Admin" onClick={() => setMenuOpen(false)} />}
          {user ? (
            <button
              onClick={handleLogout}
              className="text-left hover:underline transition"
            >
              Logout {user?.name && <span className="ml-1 text-sm italic">({user.name})</span>}
            </button>
          ) : (
            <NavLink to="/auth" label="Login" onClick={() => setMenuOpen(false)} />
          )}
        </div>
      )}
    </header>
  );
}
