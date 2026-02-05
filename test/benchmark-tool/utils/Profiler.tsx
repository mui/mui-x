'use client';

import * as React from 'react';

export const CAPTURE_RENDER_FN = '__captureRender';

export interface RenderEvent {
  id: string;
  name?: string;
  phase: 'mount' | 'update' | 'nested-update';
  actualDuration: number;
}

function onRender(id: string, phase: 'mount' | 'update' | 'nested-update', actualDuration: number) {
  console.log('render found', id, phase, actualDuration);
  (window as any)[CAPTURE_RENDER_FN]?.({ id, phase, actualDuration } satisfies RenderEvent);
}

export function Profiler({ children }: { children: React.ReactNode }) {
  return (
    <React.Profiler id="bench" onRender={onRender}>
      {children}
    </React.Profiler>
  );
}
