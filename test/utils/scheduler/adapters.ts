import {
  createTestAdapterEn,
  createTestAdapterFr,
  testDateLocaleFr,
} from '@mui/x-scheduler-headless/use-adapter';

// TODO: Replace with Base UI adapter when available.
export const adapter = createTestAdapterEn();

export const adapterFr = createTestAdapterFr();

export const dateLocaleFr = testDateLocaleFr;
