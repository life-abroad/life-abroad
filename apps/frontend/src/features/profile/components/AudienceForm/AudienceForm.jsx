import React, { useState, useEffect } from 'react';
import './AudienceForm.css';

function AudienceForm({ audience = null, contacts = [], onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    contactIds: [],
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (audience) {
      setFormData({
        name: audience.name || '',
        contactIds: audience.contacts?.map(c => c.id) || [],
      });
    }
  }, [audience]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Audience name is required';
    }

    if (formData.contactIds.length === 0) {
      newErrors.contacts = 'Select at least one contact';
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

  const handleContactToggle = (contactId) => {
    setFormData((prev) => {
      const isSelected = prev.contactIds.includes(contactId);
      const newContactIds = isSelected
        ? prev.contactIds.filter(id => id !== contactId)
        : [...prev.contactIds, contactId];
      return { ...prev, contactIds: newContactIds };
    });
    if (errors.contacts) {
      setErrors((prev) => ({ ...prev, contacts: '' }));
    }
  };

  const handleSelectAll = () => {
    setFormData((prev) => ({
      ...prev,
      contactIds: contacts.map(c => c.id),
    }));
    if (errors.contacts) {
      setErrors((prev) => ({ ...prev, contacts: '' }));
    }
  };

  const handleSelectNone = () => {
    setFormData((prev) => ({ ...prev, contactIds: [] }));
  };

  return (
    <form onSubmit={handleSubmit} className="audience-form">
      <div className="form-group">
        <label htmlFor="name">Audience Name *</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={errors.name ? 'error' : ''}
          placeholder="e.g., Family, Close Friends, College Buddies"
        />
        {errors.name && <span className="error-message">{errors.name}</span>}
      </div>

      <div className="form-group">
        <div className="contacts-header">
          <label>Select Contacts *</label>
          <div className="selection-buttons">
            <button type="button" onClick={handleSelectAll} className="btn-select-action">
              Select All
            </button>
            <button type="button" onClick={handleSelectNone} className="btn-select-action">
              Clear
            </button>
          </div>
        </div>
        
        {contacts.length === 0 ? (
          <div className="no-contacts-message">
            <p>You need to create contacts first before creating an audience.</p>
          </div>
        ) : (
          <div className={`contacts-selector ${errors.contacts ? 'error' : ''}`}>
            {contacts.map((contact) => (
              <label key={contact.id} className="contact-checkbox">
                <input
                  type="checkbox"
                  checked={formData.contactIds.includes(contact.id)}
                  onChange={() => handleContactToggle(contact.id)}
                />
                <span className="contact-info">
                  <span className="contact-name">{contact.name}</span>
                  <span className="contact-phone">{contact.phone_number}</span>
                </span>
              </label>
            ))}
          </div>
        )}
        {errors.contacts && <span className="error-message">{errors.contacts}</span>}
        <div className="selected-count">
          {formData.contactIds.length} contact{formData.contactIds.length !== 1 ? 's' : ''} selected
        </div>
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn-cancel">
          Cancel
        </button>
        <button 
          type="submit" 
          className="btn-submit"
          disabled={contacts.length === 0}
        >
          {audience ? 'Update' : 'Create'} Audience
        </button>
      </div>
    </form>
  );
}

export default AudienceForm;
