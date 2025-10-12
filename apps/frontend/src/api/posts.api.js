import { apiClient } from './client';

export const postsAPI = {
  async fetchPosts() {
    const response = await apiClient.get('/posts/');

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.status}`);
    }

    return await response.json();
  },

  async fetchWithToken(token, postId = null) {
    let url = `/frontend/view?token=${token}`;
    if (postId) {
      url += `&post_id=${postId}`;
    }

    const response = await fetch(`${apiClient.baseURL}${url}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Add direct URLs to media items with token appended for authentication
    if (data.post_id) {
      // Single post - add URLs to media items
      data.media_items = data.media_items?.map(item => ({
        ...item,
        url: `${apiClient.baseURL}/media-items/${item.id}/stream?token=${token}`
      })) || [];
    } else if (data.posts) {
      // Multiple posts - add URLs to media items for each post
      data.posts = data.posts.map(post => ({
        ...post,
        media_items: post.media_items?.map(item => ({
          ...item,
          url: `${apiClient.baseURL}/media-items/${item.id}/stream?token=${token}`
        })) || []
      }));
    }
    
    return data;
  },

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
  },

  async getMediaItemBlobUrl(mediaItemId) {
    const response = await fetch(`${apiClient.baseURL}/media-items/${mediaItemId}/stream`, {
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
  },
};
