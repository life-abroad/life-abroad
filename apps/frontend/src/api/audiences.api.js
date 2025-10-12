import { apiClient } from './client';

export const audiencesAPI = {
  async fetchAudiences() {
    const response = await apiClient.get('/audiences/');

    if (!response.ok) {
      throw new Error(`Failed to fetch audiences: ${response.status}`);
    }

    return await response.json();
  },

  async getAudience(audienceId) {
    const response = await apiClient.get(`/audiences/${audienceId}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch audience: ${response.status}`);
    }

    return await response.json();
  },

  async createAudience(name, contactIds) {
    const response = await apiClient.post('/audiences/', {
      name,
      contact_ids: contactIds,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to create audience');
    }

    return await response.json();
  },

  async updateAudience(audienceId, name, contactIds) {
    const response = await apiClient.put(`/audiences/${audienceId}`, {
      name,
      contact_ids: contactIds,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to update audience');
    }

    return await response.json();
  },

  async deleteAudience(audienceId) {
    const response = await apiClient.delete(`/audiences/${audienceId}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to delete audience');
    }
  },
};
