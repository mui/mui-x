import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { render, cleanup } from '@testing-library/react';
import { afterEach, bench, describe } from 'vitest';
import { ScatterChartPro, ScatterChartProProps } from '@mui/x-charts-pro/ScatterChartPro';
import { LicenseInfo, generateLicense } from '@mui/x-license';
import { options } from '../utils/options';

describe('ScatterChartPro', () => {
  afterEach(() => {
    cleanup();
  });

  const dataLength = 1_000;
  const data = Array.from({ length: dataLength }).map((_, i) => ({
    id: i,
    x: i,
    y: 50 + Math.sin(i / 5) * 25,
  }));

  const xData = data.map((d) => d.x);

  const props: ScatterChartProProps = {
    xAxis: [
      {
        id: 'x',
        data: xData,
        zoom: { filterMode: 'discard' },
        valueFormatter: (v) => `n${v}`,
      },
    ],
    series: [{ data }],
    width: 500,
    height: 300,
  };

  const licenseKey = generateLicense({
    expiryDate: new Date(3001, 0, 0, 0, 0, 0, 0),
    orderNumber: 'MUI-123',
    planScope: 'pro',
    licenseModel: 'subscription',
    planVersion: 'Q3-2024',
  });

  bench(
    'ScatterChartPro with big data amount',
    async () => {
      LicenseInfo.setLicenseKey(licenseKey);

      const { findByText } = render(<ScatterChartPro {...props} />);

      await findByText('60', { ignore: 'span' });
    },
    options,
  );

  bench(
    'ScatterChartPro with big data amount zoomed',
    async () => {
      LicenseInfo.setLicenseKey(licenseKey);

      const { findByText } = render(
        <ScatterChartPro {...props} zoom={[{ axisId: 'x', start: 2, end: 7 }]} />,
      );

      await findByText('60', { ignore: 'span' });
    },
    options,
  );
});
