import type { reactBenchmark } from '@mui/internal-benchmark/page';

/** A `reactBenchmark()` case, kept unregistered until a benchmark file registers it. */
export type Scenario = Parameters<typeof reactBenchmark>;

/**
 * Defines a scenario with `reactBenchmark()`'s arguments, without registering it: a benchmark file
 * registers it, such as `smoke/x.bench.tsx`.
 */
export function defineScenario(...scenario: Scenario): Scenario {
  return scenario;
}
