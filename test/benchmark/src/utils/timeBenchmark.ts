import { benchmark, ScalarMetric } from '@mui/internal-benchmark/page';
import type { BenchmarkCaseOptions } from '@mui/internal-benchmark/page';

const duration = new ScalarMetric({
  name: 'duration',
  format: { style: 'unit', unit: 'millisecond', maximumSignificantDigits: 3 },
  alarm: {},
});

// A sample repeats the function for this long, in milliseconds, to measure more than the
// resolution of the timer.
const SAMPLE_DURATION = 20;

// Keeps the results reachable, so that the calls are not optimized away.
const lastResult = { value: undefined as unknown };

/**
 * Registers a benchmark of a function that renders nothing. A sample calls it repeatedly and
 * records the mean duration of a call, in milliseconds, as `duration`.
 * With `prepare`, each call gets a new input, built outside of the measure.
 */
export function timeBenchmark<TInput = void>(
  name: string,
  run: (input: TInput) => unknown,
  options: BenchmarkCaseOptions & { prepare?: () => TInput } = {},
) {
  const { prepare, ...benchmarkOptions } = options;

  return benchmark(
    name,
    () => {
      // An unmeasured call first: it builds the data the function reads lazily.
      lastResult.value = run(prepare ? prepare() : (undefined as TInput));

      let calls = 0;
      let elapsed = 0;
      if (prepare) {
        while (elapsed < SAMPLE_DURATION) {
          const input = prepare();
          const start = performance.now();
          lastResult.value = run(input);
          elapsed += performance.now() - start;
          calls += 1;
        }
      } else {
        // A fast function is called in growing batches, so that reading the clock is not what
        // the sample measures.
        let batch = 1;
        const start = performance.now();
        while (elapsed < SAMPLE_DURATION) {
          for (let call = 0; call < batch; call += 1) {
            lastResult.value = run(undefined as TInput);
          }
          calls += batch;
          const now = performance.now() - start;
          if (now - elapsed < 1) {
            batch *= 2;
          }
          elapsed = now;
        }
      }
      duration.record(elapsed / calls);
    },
    benchmarkOptions,
  );
}

/** Builds a value on its first read, to keep the data of a case out of the others' page loads. */
export function lazy<T>(create: () => T): () => T {
  let value: { current: T } | undefined;
  return () => {
    value ??= { current: create() };
    return value.current;
  };
}
