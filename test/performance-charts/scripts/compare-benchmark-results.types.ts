export interface BenchmarkResult {
  id: string;
  name: string;
  rank: number;
  rme: number;
  samples: [];
  totalTime: number;
  min: number;
  max: number;
  hz: number;
  period: number;
  mean: number;
  variance: number;
  sd: number;
  sem: number;
  df: number;
  critical: number;
  moe: number;
  p75: number;
  p99: number;
  p995: number;
  p999: number;
  sampleCount: number;
  median: number;
}

export interface FailedBenchmarkResult {
  id: string;
  name: string;
  rank: number;
  rme: number;
  samples: [];
}

export interface BenchmarkComparison {
  name: string;
  baseline: BenchmarkResult;
  compare: BenchmarkResult;
  diff: number; // Percentage difference between the median of compare and baseline
}

export interface BenchmarkResults {
  failed: FailedBenchmarkResult[];
  added: BenchmarkResult[];
  removed: BenchmarkResult[];
  changed: BenchmarkComparison[];
  unchanged: BenchmarkComparison[];
}
