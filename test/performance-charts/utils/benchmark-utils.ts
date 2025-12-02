import { cdp, server } from 'vitest/browser';
import type {} from '@vitest/browser-playwright';

const baseDir = './traces';

export async function startBenchmark(name: string) {
  await cdp().send('Tracing.start', {
    transferMode: 'ReturnAsStream',
    traceConfig: {
      includedCategories: [
        // JavaScript execution traces
        'v8.execute',
        'v8.compile',
        'v8.parse',
        'v8.gc',
        'v8.gc_stats',
        'v8.runtime_stats',
        'v8.wasm',

        // Browser events
        'blink.console',
        'blink.user_timing',
        'benchmark',
        'devtools.timeline',
        'disabled-by-default-devtools.timeline',
        'disabled-by-default-devtools.timeline.frame',
        'disabled-by-default-devtools.timeline.stack',

        // Network and loading
        'netlog',
        'loading',
        'navigation',

        // Rendering
        'cc',
        'gpu',
        'viz',
        'blink',
        'renderer.scheduler',

        // JavaScript-specific categories that show in Performance tab
        'disabled-by-default-v8.cpu_profiler',
        'disabled-by-default-v8.runtime_stats',
        'disabled-by-default-devtools.timeline.invalidationTracking',
      ],
      recordMode: 'recordContinuously',
    },
  });

  // Start Chrome DevTools performance profiling
  await cdp().send('Runtime.enable');

  // Mark the start of benchmark
  await cdp().send('Runtime.evaluate', {
    expression: `performance.mark('${name}-start');`,
  });
}

export async function endBenchmark(name: string) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

  // Mark the end of benchmark
  await cdp().send('Runtime.evaluate', {
    expression: `
      performance.mark('${name}-end');
      performance.measure('${name}', '${name}-start', '${name}-end');
      `,
  });

  // Stop tracing and save
  const { promise: tracingCompletePromise, resolve } = Promise.withResolvers<void>();
  const onTracingComplete = async (event: Protocol.Tracing.tracingCompletePayload) => {
    const tracePath = `${baseDir}/${name}-${timestamp}.json`;

    if (event.stream !== undefined) {
      const { data } = await cdp().send('IO.read', { handle: event.stream });
      await cdp().send('IO.close', { handle: event.stream });
      await server.commands.writeFile(tracePath, data);
    } else {
      console.warn(`No trace stream available for ${name}.`);
    }

    cdp().off('Tracing.tracingComplete', onTracingComplete);
    resolve();
  };
  cdp().on('Tracing.tracingComplete', onTracingComplete);
  await cdp().send('Tracing.end');

  await tracingCompletePromise;
}
