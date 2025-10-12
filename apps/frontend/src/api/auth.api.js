import { apiClient, tokenManager } from './client';

export const authAPI = {
  async register(email, password, name, phoneNumber) {
    const response = await apiClient.post(
      '/auth/register',
      {
        email,
        password,
        name,
        phone_number: phoneNumber,
      },
      { skipAuth: true }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Registration failed');
    }

    return await response.json();
  },

  async login(email, password) {
    const response = await fetch(`${apiClient.baseURL}/auth/jwt/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        username: email,
        password: password,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Login failed');
    }

    const data = await response.json();
    tokenManager.setAuthToken(data.access_token);
    return data;
  },

  async logout() {
    const token = tokenManager.getAuthToken();
    if (token) {
      try {
        await apiClient.post('/auth/jwt/logout');
      } catch (error) {
        console.error('Logout request failed:', error);
      }
    }
    tokenManager.clearAuthToken();
  },

  async getCurrentUser() {
    const response = await apiClient.get('/auth/me');

    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.status}`);
    }

    return await response.json();
  },

  isAuthenticated() {
    return tokenManager.isAuthenticated();
  },

  getAuthToken() {
    return tokenManager.getAuthToken();
  },
};
