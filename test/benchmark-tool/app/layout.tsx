import * as React from 'react';
import type { Metadata } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import { Profiler } from '../utils/Profiler';

export const metadata: Metadata = {
  title: 'MUI X Benchmark Tool',
  description: 'Benchmark tool for MUI X Charts',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <Profiler>{children}</Profiler>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
