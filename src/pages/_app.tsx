// src/pages/_app.tsx
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from 'react-hot-toast';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
      <Toaster position="bottom-right" />
    </AuthProvider>
  );
}