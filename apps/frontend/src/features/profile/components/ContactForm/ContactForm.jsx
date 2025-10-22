import React, { useState, useEffect } from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import './ContactForm.css';

function ContactForm({ contact = null, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (contact) {
      setFormData({
        name: contact.name || '',
        phoneNumber: contact.phone_number || '',
        email: contact.email || '',
      });
    }
  }, [contact]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Format phone number: remove '+' and keep only digits
      const formattedData = {
        ...formData,
        phoneNumber: formData.phoneNumber.replace(/\+/g, '')
      };
      onSubmit(formattedData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handlePhoneChange = (value) => {
    setFormData((prev) => ({ ...prev, phoneNumber: value || '' }));
    if (errors.phoneNumber) {
      setErrors((prev) => ({ ...prev, phoneNumber: '' }));
    }
  };

  const handleImportContact = async () => {
    // Check if Contact Picker API is supported (Safari iOS 14.5+)
    if ('contacts' in navigator && 'ContactsManager' in window) {
      try {
        const props = ['name', 'tel', 'email'];
        const opts = { multiple: false };
        
        const contacts = await navigator.contacts.select(props, opts);
        
        if (contacts.length > 0) {
          const contact = contacts[0];
          
          setFormData((prev) => ({
            ...prev,
            name: contact.name?.[0] || prev.name,
            phoneNumber: contact.tel?.[0] || prev.phoneNumber,
            email: contact.email?.[0] || prev.email,
          }));
        }
      } catch (error) {
        // User cancelled or error occurred
        console.error('Error importing contact:', error);
      }
    } else {
      alert('Contact import is not supported on this device/browser');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      {'contacts' in navigator && (
        <div className="import-contact-section">
          <button type="button" onClick={handleImportContact} className="btn-import-contact">
            Import from Contacts
          </button>
        </div>
      )}
      
      <div className="form-group">
        <label htmlFor="name">Name *</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={errors.name ? 'error' : ''}
        />
        {errors.name && <span className="error-message">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="phoneNumber">Phone Number *</label>
        <PhoneInput
          international
          defaultCountry="US"
          value={formData.phoneNumber}
          onChange={handlePhoneChange}
          className={errors.phoneNumber ? 'phone-input error' : 'phone-input'}
        />
        {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={errors.email ? 'error' : ''}
        />
        {errors.email && <span className="error-message">{errors.email}</span>}
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn-cancel">
          Cancel
        </button>
        <button type="submit" className="btn-submit">
          {contact ? 'Update' : 'Create'} Contact
        </button>
      </div>
    </form>
  );
}

export default ContactForm;
