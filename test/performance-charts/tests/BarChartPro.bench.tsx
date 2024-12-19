import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { render, cleanup } from '@testing-library/react';
import { afterEach, bench, describe } from 'vitest';
import { BarChartPro, BarChartProProps } from '@mui/x-charts-pro/BarChartPro';
import { LicenseInfo, generateLicense } from '@mui/x-license';
import { options } from '../utils/options';

describe('BarChartPro', () => {
  afterEach(() => {
    cleanup();
  });

  const dataLength = 250;
  const data = Array.from({ length: dataLength + 1 }).map((_, i) => ({
    x: i,
    y: 50 + Math.sin(i / 5) * 25,
  }));

  const xData = data.map((d) => `n${d.x}`);
  const yData = data.map((d) => d.y);

  const props: BarChartProProps = {
    xAxis: [
      {
        id: 'x',
        scaleType: 'band',
        data: xData,
        zoom: { filterMode: 'discard' },
      },
    ],
    series: [
      {
        data: yData,
      },
    ],
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
    'BarChartPro with big data amount',
    async () => {
      LicenseInfo.setLicenseKey(licenseKey);

      const { findByText } = render(<BarChartPro {...props} />);

      await findByText('60', { ignore: 'span' });
    },
    options,
  );

  bench(
    'BarChartPro with big data amount zoomed',
    async () => {
      LicenseInfo.setLicenseKey(licenseKey);

      const { findByText } = render(
        <BarChartPro {...props} zoom={[{ axisId: 'x', start: 2, end: 7 }]} />,
      );

      await findByText('60', { ignore: 'span' });
    },
    options,
  );
});
