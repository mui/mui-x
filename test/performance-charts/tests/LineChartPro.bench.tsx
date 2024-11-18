import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { render, cleanup } from '@testing-library/react';
import { afterEach, bench, describe } from 'vitest';
import { LineChartPro, LineChartProProps } from '@mui/x-charts-pro/LineChartPro';
import { LicenseInfo, generateLicense } from '@mui/x-license';
import { options } from '../utils/options';

describe('LineChartPro', () => {
  afterEach(() => {
    cleanup();
  });

  const dataLength = 600;
  const data = Array.from({ length: dataLength }).map((_, i) => ({
    x: i,
    y: 50 + Math.sin(i / 5) * 25,
  }));

  const xData = data.map((d) => d.x);
  const yData = data.map((d) => d.y);

  const props: LineChartProProps = {
    xAxis: [{ id: 'x', data: xData, zoom: { filterMode: 'discard' } }],
    series: [{ data: yData }],
    width: 500,
    height: 300,
    experimentalMarkRendering: true,
  };

  const licenseKey = generateLicense({
    expiryDate: new Date(3001, 0, 0, 0, 0, 0, 0),
    orderNumber: 'MUI-123',
    planScope: 'pro',
    licenseModel: 'subscription',
    planVersion: 'Q3-2024',
  });

  bench(
    'LineChartPro with big data amount',
    async () => {
      LicenseInfo.setLicenseKey(licenseKey);

      const { findByText } = render(<LineChartPro {...props} />);

      await findByText('60', { ignore: 'span' });
    },
    options,
  );

  bench(
    'LineChartPro with big data amount zoomed',
    async () => {
      LicenseInfo.setLicenseKey(licenseKey);

      const { findByText } = render(
        <LineChartPro {...props} zoom={[{ axisId: 'x', start: 2, end: 7 }]} />,
      );

      await findByText('60', { ignore: 'span' });
    },
    options,
  );
});
