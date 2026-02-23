import * as React from 'react';
import type { Metadata } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import { ClientSideProfiler } from '../utils/Profiler';

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
          <ClientSideProfiler>{children}</ClientSideProfiler>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
