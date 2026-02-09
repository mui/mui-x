import type { Trace } from './types';

export function extractTotalDuration(trace: Trace): number {
  let totalDuration = 0;
  for (const event of trace.traceEvents) {
    if (event.ph === 'X') {
      totalDuration += event.dur ?? 0;
    }
  }
  return totalDuration;
}
