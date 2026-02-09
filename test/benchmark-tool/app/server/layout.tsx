import * as React from 'react';
import { ServerSideProfiler } from '../../utils/Profiler';

export default function ServerSideProfilerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ServerSideProfiler>{children}</ServerSideProfiler>;
}
