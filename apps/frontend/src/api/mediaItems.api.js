import { apiClient } from './client';

export const mediaItemsAPI = {
  async uploadMediaItem(postId, file, order = 0) {
    const formData = new FormData();
    formData.append('post_id', postId.toString());
    formData.append('order', order.toString());
    formData.append('file', file);

    // Use fetch directly for file upload instead of apiClient.post
    // because we need multipart/form-data, not application/json
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${apiClient.baseURL}/media-items/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Don't set Content-Type - let browser set it with boundary
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to upload media item');
    }

    return await response.json();
  },

  async deleteMediaItem(mediaItemId) {
    const response = await apiClient.delete(`/media-items/${mediaItemId}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to delete media item');
    }
  },

  async getMediaItemsByPost(postId) {
    const response = await apiClient.get(`/media-items/?post_id=${postId}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch media items: ${response.status}`);
    }

    return await response.json();
  },

  getMediaItemStreamUrl(mediaItemId) {
    return `${apiClient.baseURL}/media-items/${mediaItemId}/stream`;
  },
};
