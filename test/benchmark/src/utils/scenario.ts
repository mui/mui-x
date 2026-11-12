import { reactBenchmark } from '@mui/internal-benchmark/page';

/** A `reactBenchmark()` case, kept unregistered so more than one benchmark file can register it. */
export type Scenario = Parameters<typeof reactBenchmark>;

/**
 * Defines a scenario with `reactBenchmark()`'s arguments, without registering it: a benchmark
 * file registers it, such as `charts/charts.bench.tsx`, and so does `smoke/x.bench.tsx` when it
 * is a smoke case.
 */
export function defineScenario(...scenario: Scenario): Scenario {
  return scenario;
}

/** Registers a scenario as a `reactBenchmark()` case. */
export function registerScenario(scenario: Scenario) {
  return reactBenchmark(...scenario);
}
