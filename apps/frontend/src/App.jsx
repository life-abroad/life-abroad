import React, { useState, useEffect } from 'react';
import PostView from './components/PostView';
import PostsList from './components/PostsList';
import ApiService from './services/api';
import './App.css';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const postId = urlParams.get('post_id');

    if (!token) {
      setError('No authentication token provided');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const result = await ApiService.fetchWithToken(token, postId);
        setData(result);
      } catch (err) {
        setError('Failed to load content: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="app">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <div className="error">
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Life Abroad</h1>
      </header>
      
      <main className="app-main">
        {data?.post_id ? (
          <PostView post={data} />
        ) : data?.posts ? (
          <PostsList posts={data.posts} />
        ) : (
          <div className="error">No content available</div>
        )}
      </main>
    </div>
  );
}

export default App;