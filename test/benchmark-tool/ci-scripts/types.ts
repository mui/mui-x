export interface BenchmarkReport {
  metadata?: { iterations: number };
  renders: Array<{ actualDuration: number }>;
}

export interface BenchmarkResult {
  duration: number;
  renderCount: number;
  iterations: number;
}

export interface AggregatedResults {
  commit: string;
  timestamp: number;
  benchmarks: Record<string, BenchmarkResult>;
}

export interface FailedBenchmark {
  name: string;
  diff: string;
}

export interface ComparisonResult {
  body: string;
  failedBenchmarks: FailedBenchmark[];
}
