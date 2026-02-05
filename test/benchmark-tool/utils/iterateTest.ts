import type { PlaywrightTestArgs, PlaywrightTestOptions, TestInfo } from '@playwright/test';
import { RenderEvent } from './Profiler';

type TestArgs = Pick<PlaywrightTestArgs, 'page' | 'context' | 'request'>;

type TestFn = (
  args: TestArgs,
  testInfo: TestInfo,
  options: { renders: RenderEvent[] },
) => Promise<void> | void;

export function iterateTest(
  times: number,
  testFn: TestFn,
  onComplete?: (iterations: RenderEvent[][]) => void,
  options?: { warmupRuns?: number },
) {
  return async (
    { page, context, request }: PlaywrightTestArgs & PlaywrightTestOptions,
    testInfo: TestInfo,
  ) => {
    const args = { page, context, request };

    if (options?.warmupRuns) {
      for (let i = 0; i < options.warmupRuns; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        await testFn(args, testInfo, { renders: [] });
      }
    }

    const iterations: RenderEvent[][] = [];
    for (let i = 0; i < times; i += 1) {
      const renders: RenderEvent[] = [];
      // eslint-disable-next-line no-await-in-loop
      await testFn(args, testInfo, { renders });

      iterations[i] = renders;
    }

    if (onComplete) {
      onComplete(iterations);
    }
  };
}
