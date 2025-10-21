import React, { useState, useEffect } from 'react';
import { mediaItemsAPI, apiClient, tokenManager } from '../../../../api';
import './PostCard.css';

function PostCard({ post, onEdit, onDelete }) {
  const [mediaUrls, setMediaUrls] = useState([]);
  const [loadingMedia, setLoadingMedia] = useState(true);

  useEffect(() => {
    loadMediaItems();
    
    // Cleanup blob URLs when component unmounts
    return () => {
      mediaUrls.forEach(media => {
        if (media.blobUrl) {
          URL.revokeObjectURL(media.blobUrl);
        }
      });
    };
  }, [post.id]);

  const loadMediaItems = async () => {
    try {
      setLoadingMedia(true);
      const mediaItems = await mediaItemsAPI.getMediaItemsByPost(post.id);
      
      // Fetch each media item as a blob with authentication
      const mediaWithBlobs = await Promise.all(
        mediaItems.map(async (item) => {
          try {
            const response = await apiClient.get(`/media-items/${item.id}/stream`);
            
            if (!response.ok) {
              console.error(`Failed to fetch media item ${item.id}:`, response.status);
              return { id: item.id, type: item.type, blobUrl: null, error: true };
            }
            
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            
            return {
              id: item.id,
              type: item.type,
              blobUrl,
              error: false,
            };
          } catch (error) {
            console.error(`Error loading media item ${item.id}:`, error);
            return { id: item.id, type: item.type, blobUrl: null, error: true };
          }
        })
      );
      
      setMediaUrls(mediaWithBlobs);
    } catch (error) {
      console.error('Failed to load media items:', error);
    } finally {
      setLoadingMedia(false);
    }
  };

  return (
    <div className="post-card">
      <div className="post-card-header">
        <div className="post-meta">
          <h3>Post #{post.id}</h3>
          <span className="post-date">
            {new Date(post.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>

      <p className="post-description">{post.description}</p>

      {loadingMedia ? (
        <div className="media-loading">Loading images...</div>
      ) : mediaUrls.length > 0 ? (
        <div className="post-media-grid">
          {mediaUrls.map((media) => (
            <div key={media.id} className="media-item">
              {media.error ? (
                <div className="media-error">Failed to load image</div>
              ) : (
                <img 
                  src={media.blobUrl} 
                  alt="Post media"
                  onError={(e) => {
                    console.error('Image render error for media:', media.id);
                  }}
                />
              )}
            </div>
          ))}
        </div>
      ) : null}

      {post.audiences && post.audiences.length > 0 && (
        <div className="post-audiences">
          <span className="audiences-label">Shared with:</span>
          <div className="audience-tags">
            {post.audiences.map((audience) => (
              <span key={audience.id} className="audience-tag">
                {audience.name}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="post-card-actions">
        <button onClick={() => onEdit(post)} className="btn-edit">
          Edit
        </button>
        <button onClick={() => onDelete(post.id)} className="btn-delete">
          Delete
        </button>
      </div>
    </div>
  );
}

export default PostCard;
