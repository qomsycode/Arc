import React from 'react';
import ReactDOM from 'react-dom/client';
import { PrivyProvider } from '@privy-io/react-auth';
import { AuthProvider } from './contexts/AuthContext';
import App from './App';
import './index.css';

import ErrorBoundary from './ErrorBoundary';

const privyAppId = import.meta.env.VITE_PRIVY_APP_ID || '';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <PrivyProvider
        appId={privyAppId}
        config={{
          loginMethods: ['email', 'wallet'],
          appearance: {
            theme: 'dark',
            accentColor: '#676FFF',
          },
          embeddedWallets: {
          },
          // NOTE: Arc L1 custom chain will be added here once we have the real RPC URL.
          // For now we use Privy's default chain (Ethereum) for wallet creation.
        }}
      >
        <AuthProvider>
          <App />
        </AuthProvider>
      </PrivyProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
