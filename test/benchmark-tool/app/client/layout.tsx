import * as React from 'react';
import { ClientSideProfiler } from '../../utils/Profiler';

export default function ClientSideProfilerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ClientSideProfiler>{children}</ClientSideProfiler>;
}
