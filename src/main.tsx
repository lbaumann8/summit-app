import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './pwa.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register the service worker only in production builds.
// This avoids stale caches during normal Vite development.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js', { scope: '/' })
      .catch((error) => {
        console.error('Service worker registration failed:', error);
      });
  });
}
