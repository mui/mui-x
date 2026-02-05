/**
 * Chrome DevTools Performance Trace Format Types
 * Based on the Trace Event Format specification used by Chromium
 */

// =============================================================================
// Phase Types
// =============================================================================

/**
 * Event phase types that determine how events are interpreted
 */
export type TraceEventPhase =
  | 'B' // Begin duration event
  | 'E' // End duration event
  | 'X' // Complete event (has duration)
  | 'I' // Instant event (legacy, scope defaults to thread)
  | 'i' // Instant event
  | 'C' // Counter event
  | 'M' // Metadata event
  | 'N' // Object created
  | 'O' // Object snapshot
  | 'D' // Object destroyed
  | 'P' // Sample event
  | 'S' // Async event start
  | 'T' // Async event step into
  | 'p' // Async event step past
  | 'F' // Async event finish
  | 'b' // Nestable async event begin
  | 'n' // Nestable async event instant
  | 'e' // Nestable async event end
  | 'R' // Mark event
  | 's' // Flow event start
  | 't' // Flow event step
  | 'f' // Flow event end
  | 'v' // Memory dump global
  | 'V'; // Memory dump process

/**
 * Scope for instant events
 */
export type InstantEventScope = 'g' | 'p' | 't'; // global, process, thread

// =============================================================================
// Base Event Types
// =============================================================================

/**
 * Common fields shared by all trace events
 */
export interface TraceEventBase {
  /** Event name */
  name: string;

  /** Category string (comma-separated if multiple) */
  cat: string;

  /** Event phase type */
  ph: TraceEventPhase;

  /** Timestamp in microseconds */
  ts: number;

  /** Process ID */
  pid: number;

  /** Thread ID */
  tid: number;

  /** Event-specific arguments */
  args?: Record<string, unknown>;

  /** Thread timestamp in microseconds (optional) */
  tts?: number;

  /** Color name for display (optional) */
  cname?: string;

  /** Stack trace (optional) */
  sf?: number;

  /** Stack trace as array of frame IDs (optional) */
  stack?: number[];
}

/**
 * Duration begin event (ph: 'B')
 */
export interface DurationBeginEvent extends TraceEventBase {
  ph: 'B';
}

/**
 * Duration end event (ph: 'E')
 */
export interface DurationEndEvent extends TraceEventBase {
  ph: 'E';
}

/**
 * Complete event with built-in duration (ph: 'X')
 */
export interface CompleteEvent extends TraceEventBase {
  ph: 'X';

  /** Duration in microseconds */
  dur: number;

  /** Thread duration in microseconds (optional) */
  tdur?: number;
}

/**
 * Instant event (ph: 'I' or 'i')
 */
export interface InstantEvent extends TraceEventBase {
  ph: 'I' | 'i';

  /** Scope: global, process, or thread */
  s?: InstantEventScope;
}

/**
 * Counter event (ph: 'C')
 */
export interface CounterEvent extends TraceEventBase {
  ph: 'C';

  /** Counter ID for distinguishing multiple counters with same name */
  id?: string | number;

  /** Counter values */
  args: Record<string, number>;
}

/**
 * Metadata event (ph: 'M')
 */
export interface MetadataEvent extends TraceEventBase {
  ph: 'M';

  /** Metadata events have specific argument structures based on name */
  args: MetadataArgs;
}

export type MetadataArgs =
  | { name: string } // process_name, thread_name
  | { sort_index: number } // process_sort_index, thread_sort_index
  | { labels: string } // process_labels
  | { uptime: string } // process_uptime
  | Record<string, unknown>;

/**
 * Async event start (ph: 'S')
 */
export interface AsyncStartEvent extends TraceEventBase {
  ph: 'S';

  /** Async event ID (required for correlating start/step/end) */
  id: string | number;

  /** Scope for ID uniqueness (optional) */
  scope?: string;
}

/**
 * Async event step (ph: 'T' or 'p')
 */
export interface AsyncStepEvent extends TraceEventBase {
  ph: 'T' | 'p';
  id: string | number;
  scope?: string;
}

/**
 * Async event finish (ph: 'F')
 */
export interface AsyncFinishEvent extends TraceEventBase {
  ph: 'F';
  id: string | number;
  scope?: string;
}

/**
 * Nestable async begin event (ph: 'b')
 */
export interface NestableAsyncBeginEvent extends TraceEventBase {
  ph: 'b';
  id: string | number;
  id2?: { local?: string; global?: string };
  scope?: string;
}

/**
 * Nestable async end event (ph: 'e')
 */
export interface NestableAsyncEndEvent extends TraceEventBase {
  ph: 'e';
  id: string | number;
  id2?: { local?: string; global?: string };
  scope?: string;
}

/**
 * Nestable async instant event (ph: 'n')
 */
export interface NestableAsyncInstantEvent extends TraceEventBase {
  ph: 'n';
  id: string | number;
  id2?: { local?: string; global?: string };
  scope?: string;
}

/**
 * Flow event start (ph: 's')
 */
export interface FlowStartEvent extends TraceEventBase {
  ph: 's';
  id: string | number;
  id2?: { local?: string; global?: string };
}

/**
 * Flow event step (ph: 't')
 */
export interface FlowStepEvent extends TraceEventBase {
  ph: 't';
  id: string | number;
  id2?: { local?: string; global?: string };
}

/**
 * Flow event end (ph: 'f')
 */
export interface FlowEndEvent extends TraceEventBase {
  ph: 'f';
  id: string | number;
  id2?: { local?: string; global?: string };

  /** Binding point: enclosing slice or next slice */
  bp?: 'e' | 'n';
}

/**
 * Object created event (ph: 'N')
 */
export interface ObjectCreatedEvent extends TraceEventBase {
  ph: 'N';
  id: string | number;
  scope?: string;
}

/**
 * Object snapshot event (ph: 'O')
 */
export interface ObjectSnapshotEvent extends TraceEventBase {
  ph: 'O';
  id: string | number;
  scope?: string;
  args: {
    snapshot: unknown;
  };
}

/**
 * Object destroyed event (ph: 'D')
 */
export interface ObjectDestroyedEvent extends TraceEventBase {
  ph: 'D';
  id: string | number;
  scope?: string;
}

/**
 * Sample event (ph: 'P')
 */
export interface SampleEvent extends TraceEventBase {
  ph: 'P';
  id?: string | number;
}

/**
 * Mark event (ph: 'R')
 */
export interface MarkEvent extends TraceEventBase {
  ph: 'R';
}

/**
 * Memory dump events (ph: 'v' or 'V')
 */
export interface MemoryDumpEvent extends TraceEventBase {
  ph: 'v' | 'V';
  id: string;
}

// =============================================================================
// Union of All Event Types
// =============================================================================

export type TraceEvent =
  | DurationBeginEvent
  | DurationEndEvent
  | CompleteEvent
  | InstantEvent
  | CounterEvent
  | MetadataEvent
  | AsyncStartEvent
  | AsyncStepEvent
  | AsyncFinishEvent
  | NestableAsyncBeginEvent
  | NestableAsyncEndEvent
  | NestableAsyncInstantEvent
  | FlowStartEvent
  | FlowStepEvent
  | FlowEndEvent
  | ObjectCreatedEvent
  | ObjectSnapshotEvent
  | ObjectDestroyedEvent
  | SampleEvent
  | MarkEvent
  | MemoryDumpEvent;

// =============================================================================
// Stack Frame Types
// =============================================================================

export interface StackFrame {
  /** Category */
  category: string;

  /** Function name */
  name: string;

  /** Parent frame ID (optional) */
  parent?: number;
}

// =============================================================================
// Sample Types (for CPU profiling)
// =============================================================================

export interface CpuProfileSample {
  /** CPU index */
  cpu?: number;

  /** Thread ID */
  tid: number;

  /** Timestamp in microseconds */
  ts: number;

  /** Stack frame ID at the leaf of the call stack */
  sf: number;

  /** Weight/duration (optional) */
  weight?: number;
}

// =============================================================================
// DevTools-Specific Event Arguments
// =============================================================================

/**
 * Common args for devtools.timeline events
 */
export interface TimelineEventArgs {
  data?: {
    /** URL associated with the event */
    url?: string;

    /** Line number in source */
    lineNumber?: number;

    /** Column number in source */
    columnNumber?: number;

    /** Script ID */
    scriptId?: string;

    /** Frame ID */
    frame?: string;

    /** Stack trace */
    stackTrace?: CallFrame[];

    /** Node ID for DOM-related events */
    nodeId?: number;

    /** Layout/paint specific */
    x?: number;
    y?: number;
    width?: number;
    height?: number;

    /** Network specific */
    requestId?: string;
    priority?: string;
    mimeType?: string;
    encodedDataLength?: number;
    decodedBodyLength?: number;

    [key: string]: unknown;
  };

  /** Beginning state for state changes */
  beginData?: Record<string, unknown>;

  /** Ending state for state changes */
  endData?: Record<string, unknown>;
}

export interface CallFrame {
  functionName: string;
  scriptId: string;
  url: string;
  lineNumber: number;
  columnNumber: number;
}

// =============================================================================
// Top-Level Trace File Structure
// =============================================================================

/**
 * Trace file in JSON Array Format (simple)
 * The file is just an array of events
 */
export type TraceFileArrayFormat = TraceEvent[];

/**
 * Trace file in JSON Object Format (full)
 * Includes metadata, stack frames, and samples
 */
export interface TraceFileObjectFormat {
  /** Array of trace events */
  traceEvents: TraceEvent[];

  /** Display time unit: 'ms' or 'ns' */
  displayTimeUnit?: 'ms' | 'ns';

  /** System trace data (Linux ftrace) */
  systemTraceEvents?: string;

  /** Power trace data (BattOr) */
  powerTraceAsString?: string;

  /** Stack frames indexed by ID */
  stackFrames?: Record<string, StackFrame>;

  /** CPU profile samples */
  samples?: CpuProfileSample[];

  /** Control flow data */
  controlFlowData?: unknown;

  /** Metadata about the trace */
  metadata?: TraceMetadata;
}

export interface TraceMetadata {
  /** Clock domain information */
  'clock-domain'?: string;

  /** Trace start time */
  'trace-start-time'?: number;

  /** Command line used */
  command_line?: string;

  /** Chrome version */
  'chromium-version'?: string;

  /** OS name */
  'os-name'?: string;

  /** OS version */
  'os-version'?: string;

  /** CPU brand */
  'cpu-brand'?: string;

  /** Number of CPUs */
  'num-cpus'?: number;

  /** Physical memory in MB */
  'physical-memory'?: number;

  /** Network type */
  'network-type'?: string;

  /** Product version */
  'product-version'?: string;

  /** User agent */
  'user-agent'?: string;

  /** V8 version */
  'v8-version'?: string;

  /** Custom metadata */
  [key: string]: unknown;
}

/**
 * Union type for any valid trace file format
 */
export type TraceFile = TraceFileArrayFormat | TraceFileObjectFormat;

// =============================================================================
// Type Guards
// =============================================================================

export function isTraceFileObjectFormat(trace: TraceFile): trace is TraceFileObjectFormat {
  return typeof trace === 'object' && !Array.isArray(trace) && 'traceEvents' in trace;
}

export function isCompleteEvent(event: TraceEvent): event is CompleteEvent {
  return event.ph === 'X';
}

export function isDurationBeginEvent(event: TraceEvent): event is DurationBeginEvent {
  return event.ph === 'B';
}

export function isDurationEndEvent(event: TraceEvent): event is DurationEndEvent {
  return event.ph === 'E';
}

export function isInstantEvent(event: TraceEvent): event is InstantEvent {
  return event.ph === 'I' || event.ph === 'i';
}

export function isMetadataEvent(event: TraceEvent): event is MetadataEvent {
  return event.ph === 'M';
}

export function isAsyncEvent(
  event: TraceEvent,
): event is AsyncStartEvent | AsyncStepEvent | AsyncFinishEvent {
  return event.ph === 'S' || event.ph === 'T' || event.ph === 'p' || event.ph === 'F';
}

export function isFlowEvent(
  event: TraceEvent,
): event is FlowStartEvent | FlowStepEvent | FlowEndEvent {
  return event.ph === 's' || event.ph === 't' || event.ph === 'f';
}

export function isCounterEvent(event: TraceEvent): event is CounterEvent {
  return event.ph === 'C';
}

// =============================================================================
// Common DevTools Timeline Event Names
// =============================================================================

/**
 * Common event names found in devtools.timeline category
 */
export type TimelineEventName =
  // Rendering
  | 'Layout'
  | 'RecalculateStyles'
  | 'UpdateLayoutTree'
  | 'Paint'
  | 'PaintImage'
  | 'Layerize'
  | 'Commit'
  | 'CompositeLayers'
  | 'RasterTask'
  | 'ImageDecodeTask'

  // JavaScript
  | 'FunctionCall'
  | 'EvaluateScript'
  | 'v8.compile'
  | 'v8.compileModule'
  | 'v8.parseOnBackground'
  | 'V8.Execute'
  | 'MajorGC'
  | 'MinorGC'

  // Events/Animation
  | 'EventDispatch'
  | 'RequestAnimationFrame'
  | 'FireAnimationFrame'
  | 'CancelAnimationFrame'
  | 'RequestIdleCallback'
  | 'FireIdleCallback'
  | 'CancelIdleCallback'
  | 'Animation'

  // Timers
  | 'TimerInstall'
  | 'TimerRemove'
  | 'TimerFire'

  // Network
  | 'ResourceSendRequest'
  | 'ResourceReceiveResponse'
  | 'ResourceReceivedData'
  | 'ResourceFinish'
  | 'ResourceMarkAsCached'

  // DOM
  | 'ParseHTML'
  | 'ParseAuthorStyleSheet'
  | 'DOMContentLoaded'
  | 'LoadEvent'

  // Other
  | 'RunTask'
  | 'ThreadControllerImpl::RunTask'
  | 'FrameCommittedInBrowser'
  | 'Screenshot'
  | 'SetLayerTreeId'
  | 'TracingStartedInBrowser'
  | 'TracingStartedInPage'
  | string; // Allow other event names

/**
 * Common category strings
 */
export type TraceCategory =
  | 'devtools.timeline'
  | 'disabled-by-default-devtools.timeline'
  | 'disabled-by-default-devtools.timeline.frame'
  | 'disabled-by-default-devtools.timeline.stack'
  | 'disabled-by-default-devtools.screenshot'
  | 'v8'
  | 'v8.execute'
  | 'disabled-by-default-v8.cpu_profiler'
  | 'disabled-by-default-v8.gc'
  | 'blink'
  | 'blink.user_timing'
  | 'blink.console'
  | 'cc'
  | 'gpu'
  | 'loading'
  | 'navigation'
  | 'rail'
  | '__metadata'
  | string; // Allow other categories
