// Worker entry for the ScatterAsyncProcessing demo. Bundled by Next.js when
// instantiated via `new Worker(new URL('./chartsWorker.ts', import.meta.url))`.

const moduleEvalStart = Date.now();
// eslint-disable-next-line no-console
console.log(`[chartsWorker][${moduleEvalStart}] module eval start`);

import { setupChartsAsyncWorker } from '@mui/x-charts-premium/setupChartsAsyncWorker';

// eslint-disable-next-line no-console
console.log(
  `[chartsWorker][${Date.now()}] booted (imports resolved in ${Date.now() - moduleEvalStart}ms)`,
);
setupChartsAsyncWorker();
