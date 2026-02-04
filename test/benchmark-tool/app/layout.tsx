import * as React from 'react';
import type { Metadata } from 'next';

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
      <body>{children}</body>
    </html>
  );
}
