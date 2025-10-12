const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL environment variable is required');
}

/**
 * Token management utilities
 */
export const tokenManager = {
  getAuthToken() {
    return localStorage.getItem('auth_token');
  },

  setAuthToken(token) {
    localStorage.setItem('auth_token', token);
  },

  clearAuthToken() {
    localStorage.removeItem('auth_token');
  },

  isAuthenticated() {
    return !!this.getAuthToken();
  },
};

/**
 * Base API client with authentication
 */
export const apiClient = {
  baseURL: API_BASE_URL,

  async request(url, options = {}) {
    const token = tokenManager.getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token && !options.skipAuth) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
    });

    return response;
  },

  async get(url, options = {}) {
    return this.request(url, { ...options, method: 'GET' });
  },

  async post(url, body, options = {}) {
    return this.request(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  async put(url, body, options = {}) {
    return this.request(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },

  async delete(url, options = {}) {
    return this.request(url, { ...options, method: 'DELETE' });
  },
};

export default apiClient;
