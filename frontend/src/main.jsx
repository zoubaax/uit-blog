import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Auto-recover when a new Vercel deployment replaces lazy-loaded chunks
window.addEventListener('vite:preloadError', () => {
  window.location.reload();
});

window.addEventListener('error', (event) => {
  if (
    event?.message?.includes('Failed to fetch dynamically imported module') ||
    event?.message?.includes('Importing a module script failed')
  ) {
    window.location.reload();
  }
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
