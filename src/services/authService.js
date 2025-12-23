import { mockUsers } from '../utils/mockData';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Auth Service with mock API
const authService = {
  // Login
  login: async (email, password) => {
    await delay(500);
    
    const user = mockUsers.find(
      u => u.email === email && u.password === password
    );
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    const { password: _, ...userWithoutPassword } = user;
    const token = `mock-token-${user.id}`;
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    
    return { user: userWithoutPassword, token };
  },

  // Register
  register: async (userData) => {
    await delay(500);
    
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    // Create new user
    const newUser = {
      id: mockUsers.length + 1,
      ...userData,
      role: 'customer', // Default role
    };
    
    mockUsers.push(newUser);
    
    const { password: _, ...userWithoutPassword } = newUser;
    const token = `mock-token-${newUser.id}`;
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    
    return { user: userWithoutPassword, token };
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    await delay(500);
    
    const user = authService.getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const fullUser = mockUsers.find(u => u.id === user.id);
    if (fullUser.password !== currentPassword) {
      throw new Error('Current password is incorrect');
    }
    
    fullUser.password = newPassword;
    return { message: 'Password changed successfully' };
  },

  // Reset password (mock)
  resetPassword: async (email) => {
    await delay(500);
    
    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      throw new Error('User not found');
    }
    
    // In a real app, this would send an email
    return { message: 'Password reset link sent to your email' };
  },
};

export default authService;
