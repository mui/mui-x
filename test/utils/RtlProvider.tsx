import * as React from 'react';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import rtlPlugin from '@mui/stylis-plugin-rtl';
import { onTestFinished } from 'vitest';

const theme = createTheme({ direction: 'rtl' });

export function createRtlProvider() {
  const cache = createCache({ key: 'mui-test-rtl', stylisPlugins: [rtlPlugin] });
  onTestFinished(() => cache.sheet.flush());

  return function RtlProvider({ children }: { children: React.ReactNode }) {
    return (
      <CacheProvider value={cache}>
        <ThemeProvider theme={theme}>
          <div dir="rtl">{children}</div>
        </ThemeProvider>
      </CacheProvider>
    );
  };
}
