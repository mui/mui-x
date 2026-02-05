'use client';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

export const CAPTURE_RENDER_FN = '__captureRender';

export interface RenderEvent {
  id: string;
  name?: string;
  phase: 'mount' | 'update' | 'nested-update';
  actualDuration: number;
}

function onRender(id: string, phase: 'mount' | 'update' | 'nested-update', actualDuration: number) {
  (window as any)[CAPTURE_RENDER_FN]?.({ id, phase, actualDuration } satisfies RenderEvent);
}

/**
 * This profiler will render its children directly, so steps including hydration are included in the benchmark.
 */
export function ServerSideProfiler({ children }: { children: React.ReactNode }) {
  return (
    <React.Profiler id="bench" onRender={onRender}>
      {children}
    </React.Profiler>
  );
}

/**
 * This profiler will render its children client-side, so certain steps like hydration are not included in the benchmark.
 */
export function ClientSideProfiler({ children }: { children: React.ReactNode }) {
  const [benchmark, setBenchmark] = React.useState(false);

  React.useEffect(() => {
    ReactDOM.flushSync(() => {
      setBenchmark(true);
    });
  }, []);

  return (
    <React.Profiler id="bench" onRender={onRender}>
      {benchmark ? children : null}
    </React.Profiler>
  );
}
