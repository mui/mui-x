import * as React from 'react';

export interface RenderEvent {
  id: string;
  phase: 'mount' | 'update' | 'nested-update';
  actualDuration: number;
  /** Start time in milliseconds (from performance.now()) */
  startTime: number;
}

export function BenchProfiler({
  captures,
  children,
}: {
  captures: RenderEvent[];
  children: React.ReactNode;
}) {
  const onRender = React.useCallback(
    (
      id: string,
      phase: 'mount' | 'update' | 'nested-update',
      actualDuration: number,
      _baseDuration: number,
      startTime: number,
    ) => {
      captures.push({ id, phase, actualDuration, startTime });
    },
    [captures],
  );

  return (
    <React.Profiler id="bench" onRender={onRender}>
      {children}
    </React.Profiler>
  );
}
