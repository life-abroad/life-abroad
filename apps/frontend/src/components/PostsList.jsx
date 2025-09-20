import React from 'react';

function PostsList({ posts }) {
  const handlePostClick = (postId) => {
    // Add post_id to current URL to view specific post
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('post_id', postId);
    window.location.search = urlParams.toString();
  };

  if (!posts || posts.length === 0) {
    return (
      <div className="posts-list">
        <h2>Your Posts</h2>
        <p className="no-posts">No posts available for you to view.</p>
      </div>
    );
  }

  return (
    <div className="posts-list">
      <h2>Your Shared Memories</h2>
      <p className="posts-count">{posts.length} post{posts.length !== 1 ? 's' : ''} shared with you</p>
      
      <div className="posts-grid">
        {posts.map((post) => (
          <div 
            key={post.post_id} 
            className="post-card"
            onClick={() => handlePostClick(post.post_id)}
            style={{ cursor: 'pointer' }}
          >
            <div className="post-card-header">
              <h3>From {post.creator_name}</h3>
              <p className="post-card-date">{new Date(post.created_at).toLocaleDateString()}</p>
            </div>
            
            <div className="post-card-content">
              <p className="post-card-description">{post.description}</p>
              
              {post.media_items && post.media_items.length > 0 && (
                <div className="post-card-media">
                  <div className="media-preview">
                    {post.media_items.slice(0, 2).map((media) => (
                      <div key={media.id} className="media-thumbnail">
                        {media.url ? (
                          media.type === 'image' ? (
                            <img 
                              src={media.url} 
                              alt="Preview"
                              className="thumbnail-image"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'block';
                              }}
                            />
                          ) : media.type === 'video' ? (
                            <div className="thumbnail-video">
                              Video
                            </div>
                          ) : (
                            <div className="thumbnail-file">
                              File
                            </div>
                          )
                        ) : (
                          <div className="thumbnail-error">
                            Error
                          </div>
                        )}
                        {media.url && (
                          <div className="thumbnail-error" style={{display: 'none'}}>
                            Error
                          </div>
                        )}
                      </div>
                    ))}
                    {post.media_items.length > 2 && (
                      <div className="media-count">
                        +{post.media_items.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PostsList;