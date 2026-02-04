import type { TraceFileObjectFormat, CompleteEvent } from './types';

export interface TraceMetrics {
  /** Total duration of all complete events in microseconds */
  totalDuration: number;
  /** Number of trace events */
  eventCount: number;
  /** Breakdown of duration by event name */
  durationByEvent: Record<string, number>;
}

/**
 * Extracts performance metrics from a trace file.
 */
export function extractMetrics(trace: TraceFileObjectFormat): TraceMetrics {
  const durationByEvent: Record<string, number> = {};
  let totalDuration = 0;
  let eventCount = 0;

  for (const event of trace.traceEvents) {
    if (event.ph === 'X') {
      // Complete event with duration
      const completeEvent = event as CompleteEvent;
      totalDuration += completeEvent.dur;
      eventCount += 1;
      durationByEvent[completeEvent.name] =
        (durationByEvent[completeEvent.name] ?? 0) + completeEvent.dur;
    }
  }

  return {
    totalDuration,
    eventCount,
    durationByEvent,
  };
}
