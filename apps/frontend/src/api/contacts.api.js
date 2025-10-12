import { apiClient } from './client';

export const contactsAPI = {
  async fetchContacts() {
    const response = await apiClient.get('/contacts/');

    if (!response.ok) {
      throw new Error(`Failed to fetch contacts: ${response.status}`);
    }

    return await response.json();
  },

  async createContact(name, phoneNumber, email = null, profilePictureId = null) {
    const response = await apiClient.post('/contacts/', {
      name,
      phone_number: phoneNumber,
      email,
      profile_picture_id: profilePictureId,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to create contact');
    }

    return await response.json();
  },

  async updateContact(contactId, name, phoneNumber, email = null, profilePictureId = null) {
    const response = await apiClient.put(`/contacts/${contactId}`, {
      name,
      phone_number: phoneNumber,
      email,
      profile_picture_id: profilePictureId,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to update contact');
    }

    return await response.json();
  },

  async deleteContact(contactId) {
    const response = await apiClient.delete(`/contacts/${contactId}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to delete contact');
    }
  },
};
