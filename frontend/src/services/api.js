import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// Create axios instance
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me'),
  updatePassword: (currentPassword, newPassword) => 
    api.put('/auth/password', { currentPassword, newPassword }),
}

// Posts API
export const postsAPI = {
  getPosts: (params = {}) => api.get('/posts', { params }),
  getFeaturedPosts: () => api.get('/posts/featured'),
  getPost: (slug) => api.get(`/posts/${slug}`),
  createPost: (postData) => api.post('/posts', postData),
  updatePost: (id, postData) => api.put(`/posts/${id}`, postData),
  deletePost: (id) => api.delete(`/posts/${id}`),
  likePost: (id) => api.post(`/posts/${id}/like`),
  getMyPosts: (params = {}) => api.get('/posts/user/my-posts', { params }),
  getPostForEdit: (id) => api.get(`/posts/edit/${id}`),
  getTrendingTags: () => api.get('/posts/stats/trending-tags'),
  getPlatformStats: () => api.get('/posts/stats/platform'),
}

// Users API
export const usersAPI = {
  getUserProfile: (username) => api.get(`/users/${username}`),
  updateProfile: (profileData) => api.put('/users/profile', { profile: profileData }),
  savePost: (postId) => api.post(`/users/save-post/${postId}`),
  getSavedPosts: () => api.get('/users/saved-posts'),
}

// Upload API
export const uploadAPI = {
  uploadImage: (formData) => api.post('/upload/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteImage: (publicId) => api.delete(`/upload/image/${publicId}`),
}

export default api
