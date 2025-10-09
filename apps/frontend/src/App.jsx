import React, { useState, useEffect } from 'react';
import PostView from './components/PostView';
import PostsList from './components/PostsList';
import ScreenTemplate from './components/ScreenTemplate';
import AuthForm from './components/AuthForm';
import Profile from './components/Profile';
import ApiService from './services/api';
import './App.css';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [viewMode, setViewMode] = useState(null); // 'token-view', 'profile', or 'login'

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const viewToken = urlParams.get('token');
    const postId = urlParams.get('post_id');

    // Check if this is a token-based view (shareable link)
    if (viewToken) {
      setViewMode('token-view');
      fetchTokenData(viewToken, postId);
    } 
    // Check if user is authenticated for profile view
    else if (ApiService.isAuthenticated()) {
      setIsAuthenticated(true);
      setViewMode('profile');
      setLoading(false);
    } 
    // Show login/register page
    else {
      setViewMode('login');
      setLoading(false);
    }
  }, []);

  const fetchTokenData = async (token, postId) => {
    try {
      const result = await ApiService.fetchWithToken(token, postId);
      setData(result);
    } catch (err) {
      setError('Failed to load content: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setViewMode('profile');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setViewMode('login');
  };

  // Loading state
  if (loading) {
    return (
      <ScreenTemplate>
        <div className="loading">Loading...</div>
      </ScreenTemplate>
    );
  }

  // Token-based view (shareable links)
  if (viewMode === 'token-view') {
    if (error) {
      return (
        <ScreenTemplate>
          <div className="error">
            <h2>Error</h2>
            <p>{error}</p>
          </div>
        </ScreenTemplate>
      );
    }

    return (
      <ScreenTemplate>
        {data?.post_id ? (
          <PostView post={data} />
        ) : data?.posts ? (
          <PostsList posts={data.posts} />
        ) : (
          <div className="error">No content available</div>
        )}
      </ScreenTemplate>
    );
  }

  // Profile view (authenticated users)
  if (viewMode === 'profile' && isAuthenticated) {
    return <Profile onLogout={handleLogout} />;
  }

  // Login/Register view
  return <AuthForm onLoginSuccess={handleLoginSuccess} />;
}

export default App;