import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { render, cleanup } from '@testing-library/react';
import { bench, describe } from 'vitest';
import { BarChartPro } from '@mui/x-charts-pro/BarChartPro';
import { LicenseInfo, generateLicense } from '@mui/x-license';
import { options } from '../utils/options';

describe('BarChartPro', () => {
  const dataLength = 500;
  const data = Array.from({ length: dataLength + 1 }).map((_, i) => ({
    x: i,
    y: 50 + Math.sin(i / 5) * 25,
  }));

  const xData = data.map((d) => d.x);
  const yData = data.map((d) => d.y);

  bench(
    'BarChartPro with big data amount',
    async () => {
      const licenseKey = generateLicense({
        expiryDate: new Date(3001, 0, 0, 0, 0, 0, 0),
        orderNumber: 'MUI-123',
        planScope: 'pro',
        licenseModel: 'subscription',
        planVersion: 'Q3-2024',
      });

      LicenseInfo.setLicenseKey(licenseKey);

      const { findByText } = render(
        <BarChartPro
          xAxis={[{ id: 'x', scaleType: 'band', data: xData, zoom: { filterMode: 'discard' } }]}
          zoom={[{ axisId: 'x', start: 0.25, end: 0.75 }]}
          series={[
            {
              data: yData,
            },
          ]}
          width={500}
          height={300}
        />,
      );

      await findByText('60', { ignore: 'span' });

      cleanup();
    },
    options,
  );
});
