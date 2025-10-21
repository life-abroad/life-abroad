import React, { useState, useEffect } from 'react';
import { authAPI, postsAPI, audiencesAPI, contactsAPI } from '../../../../api';
import ContactForm from '../ContactForm/ContactForm';
import ContactCard from '../ContactCard/ContactCard';
import './Profile.css';

function Profile({ onLogout }) {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [audiences, setAudiences] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('posts');
  const [showContactForm, setShowContactForm] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [userData, postsData, audiencesData, contactsData] = await Promise.all([
        authAPI.getCurrentUser(),
        postsAPI.fetchPosts(),
        audiencesAPI.fetchAudiences(),
        contactsAPI.fetchContacts(),
      ]);
      
      setUser(userData);
      setPosts(postsData);
      setAudiences(audiencesData);
      setContacts(contactsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await authAPI.logout();
    onLogout();
  };

  const handleCreateContact = async (formData) => {
    try {
      setActionError('');
      await contactsAPI.createContact(
        formData.name,
        formData.phoneNumber,
        formData.email || null
      );
      await fetchData();
      setShowContactForm(false);
    } catch (err) {
      setActionError(err.message);
    }
  };

  const handleUpdateContact = async (formData) => {
    if (!editingContact) return;
    try {
      setActionError('');
      await contactsAPI.updateContact(
        editingContact.id,
        formData.name,
        formData.phoneNumber,
        formData.email || null
      );
      await fetchData();
      setEditingContact(null);
      setShowContactForm(false);
    } catch (err) {
      setActionError(err.message);
    }
  };

  const handleDeleteContact = async (contactId) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) {
      return;
    }
    try {
      setActionError('');
      await contactsAPI.deleteContact(contactId);
      await fetchData();
    } catch (err) {
      setActionError(err.message);
    }
  };

  const handleEditContact = (contact) => {
    setEditingContact(contact);
    setShowContactForm(true);
    setActionError('');
  };

  const handleCancelForm = () => {
    setShowContactForm(false);
    setEditingContact(null);
    setActionError('');
  };

  const handleAddContact = () => {
    setEditingContact(null);
    setShowContactForm(true);
    setActionError('');
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading">Loading your profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container">
        <div className="error">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="user-info">
          <h1>Welcome, {user?.name}!</h1>
          <p className="user-email">{user?.email}</p>
        </div>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => setActiveTab('posts')}
        >
          My Posts ({posts.length})
        </button>
        <button
          className={`tab ${activeTab === 'contacts' ? 'active' : ''}`}
          onClick={() => setActiveTab('contacts')}
        >
          My Contacts ({contacts.length})
        </button>
        <button
          className={`tab ${activeTab === 'audiences' ? 'active' : ''}`}
          onClick={() => setActiveTab('audiences')}
        >
          My Audiences ({audiences.length})
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'posts' && (
          <div className="posts-list">
            {posts.length === 0 ? (
              <div className="empty-state">
                <p>You haven't created any posts yet.</p>
              </div>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="profile-post-card">
                  <div className="profile-post-header">
                    <h3>Post #{post.id}</h3>
                    <span className="profile-post-date">
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="profile-post-description">{post.description}</p>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'contacts' && (
          <div className="contacts-section">
            <div className="contacts-header">
              <h2>My Contacts</h2>
              {!showContactForm && (
                <button onClick={handleAddContact} className="btn-add">
                  Add Contact
                </button>
              )}
            </div>

            {actionError && (
              <div className="action-error">
                {actionError}
              </div>
            )}

            {showContactForm && (
              <div className="contact-form-container">
                <h3>{editingContact ? 'Edit Contact' : 'New Contact'}</h3>
                <ContactForm
                  contact={editingContact}
                  onSubmit={editingContact ? handleUpdateContact : handleCreateContact}
                  onCancel={handleCancelForm}
                />
              </div>
            )}

            <div className="contacts-list">
              {contacts.length === 0 ? (
                <div className="empty-state">
                  <p>You haven't added any contacts yet.</p>
                  <p className="hint">Add contacts to organize them into audiences!</p>
                </div>
              ) : (
                contacts.map((contact) => (
                  <ContactCard
                    key={contact.id}
                    contact={contact}
                    onEdit={handleEditContact}
                    onDelete={handleDeleteContact}
                  />
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'audiences' && (
          <div className="audiences-list">
            {audiences.length === 0 ? (
              <div className="empty-state">
                <p>You haven't created any audiences yet.</p>
                <p className="hint">Create audiences to share posts with groups of contacts!</p>
              </div>
            ) : (
              audiences.map((audience) => (
                <div key={audience.id} className="profile-audience-card">
                  <div className="profile-audience-header">
                    <h3>{audience.name}</h3>
                    <span className="profile-audience-id">ID: {audience.id}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
