// Worker entry for the ScatterAsyncProcessing demo. Bundled by Next.js when
// instantiated via `new Worker(new URL('./chartsWorker.ts', import.meta.url))`.
import { setupChartsAsyncWorker } from '@mui/x-charts-premium/setupChartsAsyncWorker';

// eslint-disable-next-line no-console
console.log('[chartsWorker] booted');
setupChartsAsyncWorker();
