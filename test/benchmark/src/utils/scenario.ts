import { reactBenchmark } from '@mui/internal-benchmark/page';

/** A `reactBenchmark()` case, kept unregistered so more than one benchmark file can register it. */
export type Scenario = Parameters<typeof reactBenchmark>;

/**
 * Defines a scenario with `reactBenchmark()`'s arguments, without registering it: its chart's
 * benchmark file registers it, and so does `smoke/charts.bench.tsx` when it is that chart's smoke
 * case.
 */
export function defineScenario(...scenario: Scenario): Scenario {
  return scenario;
}

/** Registers a scenario as a `reactBenchmark()` case. */
export function registerScenario(scenario: Scenario) {
  return reactBenchmark(...scenario);
}
