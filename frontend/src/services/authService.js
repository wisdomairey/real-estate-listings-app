import api from './api';

export const authService = {
  // Login
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    if (response.data.success) {
      const { token, user } = response.data.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }
    return response.data;
  },

  // Logout
  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  // Get current user
  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Verify token
  async verifyToken() {
    const response = await api.get('/auth/verify');
    return response.data;
  },

  // Change password
  async changePassword(passwords) {
    const response = await api.put('/auth/change-password', passwords);
    return response.data;
  },

  // Get stored user
  getStoredUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Get stored token
  getStoredToken() {
    return localStorage.getItem('token');
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getStoredToken();
  },

  // Check if user is admin
  isAdmin() {
    const user = this.getStoredUser();
    return user && user.role === 'admin';
  }
};
