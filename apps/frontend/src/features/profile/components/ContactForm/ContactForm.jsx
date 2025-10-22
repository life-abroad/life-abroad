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

  const handlePhonePaste = (e) => {
    e.preventDefault();
    
    // Get pasted text
    const pastedText = e.clipboardData.getData('text');
    
    // Remove all non-digit characters
    let digitsOnly = pastedText.replace(/\D/g, '');
    
    // If it starts with 1 and has 11 digits (US format with country code), remove the 1
    if (digitsOnly.startsWith('1') && digitsOnly.length === 11) {
      digitsOnly = digitsOnly.substring(1);
    }
    
    // Format as +1 followed by the number for the PhoneInput component
    const formattedNumber = digitsOnly ? `+1${digitsOnly}` : '';
    
    setFormData((prev) => ({ ...prev, phoneNumber: formattedNumber }));
    
    if (errors.phoneNumber) {
      setErrors((prev) => ({ ...prev, phoneNumber: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="contact-form">
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
        <div onPaste={handlePhonePaste}>
          <PhoneInput
            international
            defaultCountry="US"
            value={formData.phoneNumber}
            onChange={handlePhoneChange}
            className={errors.phoneNumber ? 'phone-input error' : 'phone-input'}
          />
        </div>
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
