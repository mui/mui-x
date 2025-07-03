import * as React from 'react';
import { createRenderer, screen } from '@mui/internal-test-utils';
import { LicenseInfo } from '@mui/x-license';
import { LineChartPro } from './LineChartPro';

describe('<LineChartPro /> - License', () => {
  const { render } = createRenderer();

  beforeEach(() => {
    LicenseInfo.setLicenseKey('');
  });

  it('should render watermark when the license is missing', async () => {
    expect(() => render(<LineChartPro series={[]} width={100} height={100} />)).toErrorDev([
      'MUI X: Missing license key.',
    ]);

    expect(await screen.findAllByText('MUI X Missing license key')).not.to.equal(null);
  });
});
