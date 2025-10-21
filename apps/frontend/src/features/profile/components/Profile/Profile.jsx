import React, { useState, useEffect } from 'react';
import { authAPI, postsAPI, audiencesAPI, contactsAPI } from '../../../../api';
import ContactForm from '../ContactForm/ContactForm';
import ContactCard from '../ContactCard/ContactCard';
import AudienceForm from '../AudienceForm/AudienceForm';
import AudienceCard from '../AudienceCard/AudienceCard';
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
  const [showAudienceForm, setShowAudienceForm] = useState(false);
  const [editingAudience, setEditingAudience] = useState(null);
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

  const handleCreateAudience = async (formData) => {
    try {
      setActionError('');
      await audiencesAPI.createAudience(formData.name, formData.contactIds);
      await fetchData();
      setShowAudienceForm(false);
    } catch (err) {
      setActionError(err.message);
    }
  };

  const handleUpdateAudience = async (formData) => {
    if (!editingAudience) return;
    try {
      setActionError('');
      await audiencesAPI.updateAudience(
        editingAudience.id,
        formData.name,
        formData.contactIds
      );
      await fetchData();
      setEditingAudience(null);
      setShowAudienceForm(false);
    } catch (err) {
      setActionError(err.message);
    }
  };

  const handleDeleteAudience = async (audienceId) => {
    if (!window.confirm('Are you sure you want to delete this audience?')) {
      return;
    }
    try {
      setActionError('');
      await audiencesAPI.deleteAudience(audienceId);
      await fetchData();
    } catch (err) {
      setActionError(err.message);
    }
  };

  const handleEditAudience = async (audience) => {
    try {
      setActionError('');
      // Fetch full audience details with contacts
      const fullAudience = await audiencesAPI.getAudience(audience.id);
      setEditingAudience(fullAudience);
      setShowAudienceForm(true);
    } catch (err) {
      setActionError(err.message);
    }
  };

  const handleCancelAudienceForm = () => {
    setShowAudienceForm(false);
    setEditingAudience(null);
    setActionError('');
  };

  const handleAddAudience = () => {
    setEditingAudience(null);
    setShowAudienceForm(true);
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
          <div className="audiences-section">
            <div className="audiences-header">
              <h2>My Audiences</h2>
              {!showAudienceForm && (
                <button onClick={handleAddAudience} className="btn-add">
                  Add Audience
                </button>
              )}
            </div>

            {actionError && (
              <div className="action-error">
                {actionError}
              </div>
            )}

            {showAudienceForm && (
              <div className="audience-form-container">
                <h3>{editingAudience ? 'Edit Audience' : 'New Audience'}</h3>
                <AudienceForm
                  audience={editingAudience}
                  contacts={contacts}
                  onSubmit={editingAudience ? handleUpdateAudience : handleCreateAudience}
                  onCancel={handleCancelAudienceForm}
                />
              </div>
            )}

            <div className="audiences-list">
              {audiences.length === 0 ? (
                <div className="empty-state">
                  <p>You haven't created any audiences yet.</p>
                  <p className="hint">Create audiences to share posts with groups of contacts!</p>
                </div>
              ) : (
                audiences.map((audience) => (
                  <AudienceCard
                    key={audience.id}
                    audience={audience}
                    onEdit={handleEditAudience}
                    onDelete={handleDeleteAudience}
                  />
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
