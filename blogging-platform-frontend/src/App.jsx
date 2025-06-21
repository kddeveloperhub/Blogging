import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import CreateBlog from './pages/CreateBlog';
import EditBlog from './pages/EditBlog';
import BlogDetails from './components/BlogDetails';
import Profile from './components/Profile';
import AdminDashboard from './components/AdminDashboard';
import Auth from './components/Auth';

function AppContent() {
  const location = useLocation();
  const noHeaderRoutes = ['/auth'];
  const showHeader = !noHeaderRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {showHeader && <Header />}
      <main className="flex-grow overflow-y-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/create" element={<CreateBlog />} />
          <Route path="/edit/:id" element={<EditBlog />} />
          <Route path="/blog/:id" element={<BlogDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminDashboard />} />
         
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
