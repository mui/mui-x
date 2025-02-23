import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { render, cleanup } from '@testing-library/react';
import { bench, describe } from 'vitest';
import { FunnelChart } from '@mui/x-charts-pro/FunnelChart';
import { LicenseInfo, generateLicense } from '@mui/x-license';
import { options } from '../utils/options';

describe('FunnelChart', () => {
  const dataLength = 100;
  const series = [
    {
      data: Array.from({ length: dataLength }, (_, i) => ({ value: dataLength / (i + 1) })),
    },
  ];

  bench(
    'FunnelChart with big data amount',
    async () => {
      const licenseKey = generateLicense({
        expiryDate: new Date(3001, 0, 0, 0, 0, 0, 0),
        orderNumber: 'MUI-123',
        planScope: 'pro',
        licenseModel: 'subscription',
        planVersion: 'Q3-2024',
      });

      LicenseInfo.setLicenseKey(licenseKey);

      const { findByText } = render(<FunnelChart series={series} width={500} height={300} />);

      await findByText(dataLength.toLocaleString(), { ignore: 'span' });

      cleanup();
    },
    options,
  );
});
