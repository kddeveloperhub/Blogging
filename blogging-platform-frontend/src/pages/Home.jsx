import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import BlogList from '../components/BlogList';
import { getBlogs } from '../api/blogs';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);

  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState(null);

  // categories extracted on first load; fallback to hard-coded list
  const [categories, setCategories] = useState(['Tech', 'Life', 'Travel']);

  // ––––– Debounce ref
  const debounceRef = useRef();

  /** -------------------------------------------
   * build query string from state
   * ------------------------------------------*/
  const buildQuery = useCallback(() => {
    let q = `?page=${page}`;
    if (searchQuery)    q += `&search=${encodeURIComponent(searchQuery)}`;
    if (activeCategory) q += `&category=${encodeURIComponent(activeCategory)}`;
    return q;
  }, [page, searchQuery, activeCategory]);

  /** -------------------------------------------
   * fetchBlogs – wrapped with useCallback so we
   * can call it in debounced & immediate ways.
   * ------------------------------------------*/
  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await getBlogs(buildQuery());
      setBlogs(data.blogs);
      setTotalPages(data.totalPages);

      // Extract unique categories from first page
      if (data.blogs?.length) {
        const unique = [
          ...new Set(data.blogs.map((b) => b.category).filter(Boolean)),
        ];
        if (unique.length) setCategories(unique);
      }
    } catch (err) {
      console.error('Failed to fetch blogs:', err);
      setError('Unable to load blogs – please try again.');
    } finally {
      setLoading(false);
    }
  }, [buildQuery]);

  /** -------------------------------------------
   * Debounced effect: search / category / page
   * ------------------------------------------*/
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(fetchBlogs, 400);
    return () => clearTimeout(debounceRef.current);
  }, [fetchBlogs]);

  /** -------------------------------------------
   * Handlers
   * ------------------------------------------*/
  const handleCategoryClick = (cat) => {
    setActiveCategory(cat === activeCategory ? null : cat);
    setPage(1);
  };
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  /** -------------------------------------------
   * JSX
   * ------------------------------------------*/
  return (
    <motion.div
      className="max-w-6xl mx-auto px-4 sm:px-6 py-6 mt-4"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl sm:text-3xl font-bold text-[#4EA685] mb-6 text-center sm:text-left">
        Latest Blogs
      </h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search blogs..."
        className="w-full border border-gray-300 px-4 py-2 mb-6 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4EA685]"
        value={searchQuery}
        onChange={handleSearch}
        aria-label="Search Blogs"
      />

      {/* Categories */}
      <div className="flex flex-wrap gap-2 justify-center sm:justify-start mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryClick(cat)}
            aria-pressed={activeCategory === cat}
            className={`px-4 py-1 rounded-full text-sm font-medium transition focus:outline-none focus:ring-2
              ${
                cat === activeCategory
                  ? 'bg-[#4EA685] text-white focus:ring-[#4EA685]'
                  : 'bg-gray-200 text-gray-700 hover:bg-[#4EA685] hover:text-white focus:ring-gray-400'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Blog List / States */}
      {loading ? (
        <p className="text-center text-gray-400 animate-pulse">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : blogs.length === 0 ? (
        <p className="text-center text-gray-500 italic">
          No blogs match your criteria.
        </p>
      ) : (
        <BlogList blogs={blogs} />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 gap-2">
          <button
            onClick={() => page > 1 && setPage(page - 1)}
            disabled={page === 1}
            className="px-3 py-1 rounded-md text-sm border bg-white text-[#4EA685] border-[#4EA685] disabled:opacity-40"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded-md text-sm border focus:outline-none focus:ring-2 focus:ring-[#4EA685]
                ${
                  page === i + 1
                    ? 'bg-[#4EA685] text-white border-[#4EA685]'
                    : 'bg-white text-[#4EA685] border-[#4EA685] hover:bg-[#4EA685] hover:text-white'
                }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => page < totalPages && setPage(page + 1)}
            disabled={page === totalPages}
            className="px-3 py-1 rounded-md text-sm border bg-white text-[#4EA685] border-[#4EA685] disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </motion.div>
  );
}
