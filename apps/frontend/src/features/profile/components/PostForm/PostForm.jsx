import React, { useState, useEffect } from 'react';
import './PostForm.css';

function PostForm({ post = null, audiences = [], onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    description: '',
    audienceIds: [],
    images: [],
  });
  const [previewUrls, setPreviewUrls] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (post) {
      setFormData({
        description: post.description || '',
        audienceIds: post.audiences?.map(a => a.id) || [],
        images: [], // Don't pre-populate images for editing
      });
    }
  }, [post]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.audienceIds.length === 0) {
      newErrors.audiences = 'Select at least one audience';
    }

    if (!post && formData.images.length === 0) {
      newErrors.images = 'At least one image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleAudienceToggle = (audienceId) => {
    setFormData((prev) => {
      const isSelected = prev.audienceIds.includes(audienceId);
      const newAudienceIds = isSelected
        ? prev.audienceIds.filter(id => id !== audienceId)
        : [...prev.audienceIds, audienceId];
      return { ...prev, audienceIds: newAudienceIds };
    });
    if (errors.audiences) {
      setErrors((prev) => ({ ...prev, audiences: '' }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate file types
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image file`);
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert(`${file.name} is larger than 10MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setFormData((prev) => ({ ...prev, images: [...prev.images, ...validFiles] }));
      
      // Create preview URLs
      const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
      
      if (errors.images) {
        setErrors((prev) => ({ ...prev, images: '' }));
      }
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    
    // Revoke the preview URL to free memory
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSelectAllAudiences = () => {
    setFormData((prev) => ({
      ...prev,
      audienceIds: audiences.map(a => a.id),
    }));
    if (errors.audiences) {
      setErrors((prev) => ({ ...prev, audiences: '' }));
    }
  };

  const handleClearAudiences = () => {
    setFormData((prev) => ({ ...prev, audienceIds: [] }));
  };

  return (
    <form onSubmit={handleSubmit} className="post-form">
      <div className="form-group">
        <label htmlFor="description">Description *</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className={errors.description ? 'error' : ''}
          placeholder="What's happening in your life abroad?"
          rows="4"
        />
        {errors.description && <span className="error-message">{errors.description}</span>}
      </div>

      {!post && (
        <div className="form-group">
          <label>Images *</label>
          <div className="image-upload-section">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="file-input"
              id="image-upload"
            />
            <label htmlFor="image-upload" className="upload-button">
              Choose Images
            </label>
            <span className="upload-hint">Max 10MB per image</span>
          </div>
          {errors.images && <span className="error-message">{errors.images}</span>}
          
          {previewUrls.length > 0 && (
            <div className="image-previews">
              {previewUrls.map((url, index) => (
                <div key={index} className="image-preview">
                  <img src={url} alt={`Preview ${index + 1}`} />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="remove-image"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="form-group">
        <div className="audiences-header">
          <label>Select Audiences *</label>
          <div className="selection-buttons">
            <button type="button" onClick={handleSelectAllAudiences} className="btn-select-action">
              Select All
            </button>
            <button type="button" onClick={handleClearAudiences} className="btn-select-action">
              Clear
            </button>
          </div>
        </div>
        
        {audiences.length === 0 ? (
          <div className="no-audiences-message">
            <p>You need to create audiences first before creating a post.</p>
          </div>
        ) : (
          <div className={`audiences-selector ${errors.audiences ? 'error' : ''}`}>
            {audiences.map((audience) => (
              <label key={audience.id} className="audience-checkbox">
                <input
                  type="checkbox"
                  checked={formData.audienceIds.includes(audience.id)}
                  onChange={() => handleAudienceToggle(audience.id)}
                />
                <span className="audience-info">
                  <span className="audience-name">{audience.name}</span>
                </span>
              </label>
            ))}
          </div>
        )}
        {errors.audiences && <span className="error-message">{errors.audiences}</span>}
        <div className="selected-count">
          {formData.audienceIds.length} audience{formData.audienceIds.length !== 1 ? 's' : ''} selected
        </div>
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn-cancel">
          Cancel
        </button>
        <button 
          type="submit" 
          className="btn-submit"
          disabled={audiences.length === 0}
        >
          {post ? 'Update' : 'Create'} Post
        </button>
      </div>
    </form>
  );
}

export default PostForm;
