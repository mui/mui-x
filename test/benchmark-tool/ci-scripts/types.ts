export interface TraceEvent {
  ph: string;
  dur?: number;
}

export interface Trace {
  traceEvents: TraceEvent[];
}

export interface Metadata {
  files: string[];
}

export interface FailedBenchmark {
  name: string;
  diff: string;
}

export interface ComparisonResult {
  body: string;
  failedBenchmarks: FailedBenchmark[];
}
