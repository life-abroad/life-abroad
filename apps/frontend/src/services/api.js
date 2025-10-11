const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL environment variable is required');
}

class ApiService {
  // Token management
  getAuthToken() {
    return localStorage.getItem('auth_token');
  }

  setAuthToken(token) {
    localStorage.setItem('auth_token', token);
  }

  clearAuthToken() {
    localStorage.removeItem('auth_token');
  }

  isAuthenticated() {
    return !!this.getAuthToken();
  }

  // Authentication methods
  async register(email, password, name, phoneNumber) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        name,
        phone_number: phoneNumber,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Registration failed');
    }

    return await response.json();
  }

  async login(email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/jwt/login`, {
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
    this.setAuthToken(data.access_token);
    return data;
  }

  async logout() {
    const token = this.getAuthToken();
    if (token) {
      try {
        await fetch(`${API_BASE_URL}/auth/jwt/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error('Logout request failed:', error);
      }
    }
    this.clearAuthToken();
  }

  // Authenticated API requests
  async fetchPosts() {
    const token = this.getAuthToken();
    const response = await fetch(`${API_BASE_URL}/posts/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.status}`);
    }

    return await response.json();
  }

  async fetchAudiences() {
    const token = this.getAuthToken();
    const response = await fetch(`${API_BASE_URL}/audiences/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch audiences: ${response.status}`);
    }

    return await response.json();
  }

  async getCurrentUser() {
    const token = this.getAuthToken();
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.status}`);
    }

    return await response.json();
  }

  async fetchContacts() {
    const token = this.getAuthToken();
    const response = await fetch(`${API_BASE_URL}/contacts/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch contacts: ${response.status}`);
    }

    return await response.json();
  }

  async createContact(name, phoneNumber, email = null, profilePictureId = null) {
    const token = this.getAuthToken();
    const response = await fetch(`${API_BASE_URL}/contacts/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        phone_number: phoneNumber,
        email,
        profile_picture_id: profilePictureId,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to create contact');
    }

    return await response.json();
  }

  async updateContact(contactId, name, phoneNumber, email = null, profilePictureId = null) {
    const token = this.getAuthToken();
    const response = await fetch(`${API_BASE_URL}/contacts/${contactId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        phone_number: phoneNumber,
        email,
        profile_picture_id: profilePictureId,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to update contact');
    }

    return await response.json();
  }

  async deleteContact(contactId) {
    const token = this.getAuthToken();
    const response = await fetch(`${API_BASE_URL}/contacts/${contactId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to delete contact');
    }
  }

  async createAudience(name, contactIds) {
    const token = this.getAuthToken();
    const response = await fetch(`${API_BASE_URL}/audiences/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        contact_ids: contactIds,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to create audience');
    }

    return await response.json();
  }

  async updateAudience(audienceId, name, contactIds) {
    const token = this.getAuthToken();
    const response = await fetch(`${API_BASE_URL}/audiences/${audienceId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        contact_ids: contactIds,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to update audience');
    }

    return await response.json();
  }

  async deleteAudience(audienceId) {
    const token = this.getAuthToken();
    const response = await fetch(`${API_BASE_URL}/audiences/${audienceId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to delete audience');
    }
  }

  async getAudience(audienceId) {
    const token = this.getAuthToken();
    const response = await fetch(`${API_BASE_URL}/audiences/${audienceId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch audience: ${response.status}`);
    }

    return await response.json();
  }

  async fetchWithToken(token, postId = null) {
    let url = `${API_BASE_URL}/frontend/view?token=${token}`;
    if (postId) {
      url += `&post_id=${postId}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Add direct URLs to media items
    if (data.post_id) {
      // Single post - add URLs to media items
      data.media_items = data.media_items?.map(item => ({
        ...item,
        url: `${API_BASE_URL}/media-items/${item.id}/stream`
      })) || [];
    } else if (data.posts) {
      // Multiple posts - add URLs to media items for each post
      data.posts = data.posts.map(post => ({
        ...post,
        media_items: post.media_items?.map(item => ({
          ...item,
          url: `${API_BASE_URL}/media-items/${item.id}/stream`
        })) || []
      }));
    }
    
    return data;
  }

  async processMediaItems(mediaItems) {
    if (!mediaItems || mediaItems.length === 0) {
      return mediaItems;
    }

    // Create blob URLs for each media item by streaming from the backend
    const processedItems = await Promise.all(
      mediaItems.map(async (item) => {
        try {
          const blobUrl = await this.getMediaItemBlobUrl(item.id);
          console.log(`Got blob URL for media item ${item.id}:`, blobUrl);
          return {
            ...item,
            url: blobUrl
          };
        } catch (error) {
          console.error(`Failed to fetch stream for media item ${item.id}:`, error);
          return {
            ...item,
            url: null // Handle failed URLs gracefully
          };
        }
      })
    );

    return processedItems;
  }

  async getMediaItemBlobUrl(mediaItemId) {
    const response = await fetch(`${API_BASE_URL}/media-items/${mediaItemId}/stream`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch media stream: ${response.status}`);
    }

    // Debug: Log response details
    console.log(`Response for media ${mediaItemId}:`, {
      status: response.status,
      contentType: response.headers.get('content-type'),
      contentLength: response.headers.get('content-length')
    });

    // Get the blob from the response
    const blob = await response.blob();
    
    // Debug: Log blob details
    console.log(`Blob for media ${mediaItemId}:`, {
      size: blob.size,
      type: blob.type
    });
    
    // Create a blob URL for the frontend to use
    const blobUrl = URL.createObjectURL(blob);
    
    return blobUrl;
  }
}

export default new ApiService();