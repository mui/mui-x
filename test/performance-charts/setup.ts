import { afterAll, beforeAll } from 'vitest';
import { generateLicense, LicenseInfo } from '@mui/x-license';
import { reportMemoryUsage } from './utils/memory-utils';

beforeAll(() => {
  const licenseKey = generateLicense({
    expiryDate: new Date(3001, 0, 0, 0, 0, 0, 0),
    orderNumber: 'MUI-123',
    planScope: 'pro',
    licenseModel: 'subscription',
    planVersion: 'Q3-2024',
  });

  LicenseInfo.setLicenseKey(licenseKey);
});

afterAll(() => {
  reportMemoryUsage();
});
