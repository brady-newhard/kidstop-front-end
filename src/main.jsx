import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';

import { UserProvider } from './contexts/UserContext.jsx';
import { GoogleMapsProvider } from './contexts/GoogleMapsContext.jsx';

import App from './App.jsx';

import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <GoogleMapsProvider>
          <App />
        </GoogleMapsProvider>
      </UserProvider>
    </BrowserRouter>
  </StrictMode>,
);
