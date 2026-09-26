import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { initPWAEvents, registerServiceWorker } from './utils/pwa';

// Initialize PWA installation listeners and service worker
initPWAEvents();
registerServiceWorker();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
