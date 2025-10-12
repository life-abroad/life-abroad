export { apiClient, tokenManager } from './client';
export { authAPI } from './auth.api';
export { postsAPI } from './posts.api';
export { contactsAPI } from './contacts.api';
export { audiencesAPI } from './audiences.api';

// Default export for backwards compatibility
import { authAPI } from './auth.api';
import { postsAPI } from './posts.api';
import { contactsAPI } from './contacts.api';
import { audiencesAPI } from './audiences.api';

export default {
  ...authAPI,
  ...postsAPI,
  ...contactsAPI,
  ...audiencesAPI,
};
