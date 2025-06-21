import API from './axios';

// ✅ Blog CRUD
export const createBlog = (data) => API.post('/blogs', data);
export const updateBlog = (id, data) => API.put(`/blogs/${id}`, data);
export const deleteBlog = (id) => API.delete(`/blogs/${id}`);

// ✅ Get blogs
export const getBlogs = (query = '') => API.get(`/blogs${query}`);
export const getBlog = (id) => API.get(`/blogs/${id}`);

// ✅ Interactions
export const likeBlog = (id) => API.put(`/blogs/${id}/like`);
export const addComment = (id, text) => API.post(`/blogs/${id}/comments`, { text });

