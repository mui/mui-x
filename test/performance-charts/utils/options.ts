import { BenchOptions } from 'vitest';
import { LicenseInfo, generateLicense } from '@mui/x-license';

const licenseKey = generateLicense({
  expiryDate: new Date(3001, 0, 0, 0, 0, 0, 0),
  orderNumber: 'MUI-123',
  planScope: 'pro',
  licenseModel: 'subscription',
  planVersion: 'Q3-2024',
});

const iterations = globalThis.process?.env?.BENCHMARK_ITERATIONS
  ? parseInt(globalThis.process.env.BENCHMARK_ITERATIONS, 10)
  : 1;

export const options: BenchOptions = {
  iterations,
  setup: () => {
    LicenseInfo.setLicenseKey(licenseKey);
  },
};
