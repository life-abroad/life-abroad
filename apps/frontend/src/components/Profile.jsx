import React, { useState, useEffect } from 'react';
import ApiService from '../services/api';
import './Profile.css';

function Profile({ onLogout }) {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [audiences, setAudiences] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('posts');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [userData, postsData, audiencesData, contactsData] = await Promise.all([
        ApiService.getCurrentUser(),
        ApiService.fetchPosts(),
        ApiService.fetchAudiences(),
        ApiService.fetchContacts(),
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
    await ApiService.logout();
    onLogout();
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
                <div key={post.id} className="post-card">
                  <div className="post-header">
                    <h3>Post #{post.id}</h3>
                    <span className="post-date">
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="post-description">{post.description}</p>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'contacts' && (
          <div className="contacts-list">
            {contacts.length === 0 ? (
              <div className="empty-state">
                <p>You haven't added any contacts yet.</p>
                <p className="hint">Add contacts to organize them into audiences!</p>
              </div>
            ) : (
              contacts.map((contact) => (
                <div key={contact.id} className="contact-card">
                  <div className="contact-header">
                    <h3>{contact.name}</h3>
                    <span className="contact-phone">{contact.phone_number}</span>
                  </div>
                  {contact.email && (
                    <p className="contact-email">{contact.email}</p>
                  )}
                </div>
              ))
            )}
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
                <div key={audience.id} className="audience-card">
                  <div className="audience-header">
                    <h3>{audience.name}</h3>
                    <span className="audience-id">ID: {audience.id}</span>
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
