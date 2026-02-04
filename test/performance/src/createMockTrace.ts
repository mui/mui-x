import type {
  TraceFileObjectFormat,
  MetadataEvent,
  CompleteEvent,
  MarkEvent,
  StackFrame,
} from './types';

export interface MockTraceOptions {
  /** Process name for the trace */
  processName?: string;
  /** Thread name for the main thread */
  threadName?: string;
  /** Number of sample events to generate */
  eventCount?: number;
  /** Base timestamp in microseconds */
  baseTimestamp?: number;
  /** Include stack frames */
  includeStackFrames?: boolean;
}

/**
 * Creates a mock TraceFileObjectFormat for testing purposes.
 * Generates a realistic trace structure that mimics Chrome DevTools output.
 */
export function createMockTrace(options: MockTraceOptions = {}): TraceFileObjectFormat {
  const {
    processName = 'Browser',
    threadName = 'CrBrowserMain',
    eventCount = 10,
    baseTimestamp = 1000000,
    includeStackFrames = false,
  } = options;

  const pid = 1;
  const tid = 1;

  // Metadata events for process and thread names
  const metadataEvents: MetadataEvent[] = [
    {
      name: 'process_name',
      cat: '__metadata',
      ph: 'M',
      ts: 0,
      pid,
      tid,
      args: { name: processName },
    },
    {
      name: 'thread_name',
      cat: '__metadata',
      ph: 'M',
      ts: 0,
      pid,
      tid,
      args: { name: threadName },
    },
  ];

  // Mark event for navigation start
  const navigationMark: MarkEvent = {
    name: 'navigationStart',
    cat: 'blink.user_timing',
    ph: 'R',
    ts: baseTimestamp,
    pid,
    tid,
  };

  // Generate sample complete events simulating rendering work
  const sampleEvents: CompleteEvent[] = [];
  let currentTimestamp = baseTimestamp + 1000; // Start 1ms after navigation

  const eventTypes = [
    { name: 'Layout', cat: 'devtools.timeline', avgDuration: 500 },
    { name: 'RecalculateStyles', cat: 'devtools.timeline', avgDuration: 300 },
    { name: 'Paint', cat: 'devtools.timeline', avgDuration: 200 },
    { name: 'FunctionCall', cat: 'devtools.timeline', avgDuration: 1000 },
    { name: 'EvaluateScript', cat: 'devtools.timeline', avgDuration: 2000 },
  ];

  for (let i = 0; i < eventCount; i += 1) {
    const eventType = eventTypes[i % eventTypes.length];
    const duration = eventType.avgDuration + Math.floor(Math.random() * 200);

    const event: CompleteEvent = {
      name: eventType.name,
      cat: eventType.cat,
      ph: 'X',
      ts: currentTimestamp,
      dur: duration,
      pid,
      tid,
    };

    if (includeStackFrames) {
      event.sf = i;
    }

    sampleEvents.push(event);
    currentTimestamp += duration + 100; // Add 100μs gap between events
  }

  // Build the trace file object
  const trace: TraceFileObjectFormat = {
    traceEvents: [...metadataEvents, navigationMark, ...sampleEvents],
    displayTimeUnit: 'ms',
    metadata: {
      'clock-domain': 'LINUX_CLOCK_MONOTONIC',
      'os-name': 'Linux',
      'product-version': 'HeadlessChrome/test',
    },
  };

  // Add stack frames if requested
  if (includeStackFrames) {
    const stackFrames: Record<string, StackFrame> = {};
    for (let i = 0; i < eventCount; i += 1) {
      stackFrames[String(i)] = {
        category: 'program',
        name: `function_${i}`,
        parent: i > 0 ? i - 1 : undefined,
      };
    }
    trace.stackFrames = stackFrames;
  }

  return trace;
}
