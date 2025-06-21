import API from './axios';

export const fetchAllBlogs = () => API.get('/admin/blogs');
export const fetchAllUsers = () => API.get('/admin/users');
