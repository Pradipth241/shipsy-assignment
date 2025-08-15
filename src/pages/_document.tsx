// src/pages/_document.tsx
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        {/* --- ADD THIS SCRIPT --- */}
        <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  function getInitialColorMode() {
                    const persistedColorPreference = window.localStorage.getItem('color-mode');
                    const hasPersistedPreference = typeof persistedColorPreference === 'string';
                    if (hasPersistedPreference) {
                      return persistedColorPreference;
                    }
                    const mql = window.matchMedia('(prefers-color-scheme: dark)');
                    const hasMediaQueryPreference = typeof mql.matches === 'boolean';
                    if (hasMediaQueryPreference) {
                      return mql.matches ? 'dark' : 'light';
                    }
                    return 'light';
                  }
                  const colorMode = getInitialColorMode();
                  document.documentElement.classList.add(colorMode);
                })();
              `,
            }}
          />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}