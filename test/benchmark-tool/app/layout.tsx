import * as React from 'react';
import type { Metadata } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import { ServerSideProfiler } from '../utils/Profiler';

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
          <ServerSideProfiler>{children}</ServerSideProfiler>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
