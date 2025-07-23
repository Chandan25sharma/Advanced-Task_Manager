import api from './index';

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  role?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

// Auth API functions
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    console.log('📡 API login request:', credentials);
    console.log('📡 API base URL:', (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:5000/api');
    try {
      const response = await api.post('/auth/login', credentials);
      console.log('✅ API login response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ API login error:', error);
      throw error;
    }
  },

  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (updates: Partial<User>): Promise<{ user: User; message: string }> => {
    const response = await api.put('/auth/profile', updates);
    return response.data;
  },

  changePassword: async (passwordData: {
    currentPassword: string;
    newPassword: string;
  }): Promise<{ message: string }> => {
    const response = await api.put('/auth/password', passwordData);
    return response.data;
  },
};
