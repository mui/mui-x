import * as React from 'react';
import { createRenderer, screen } from '@mui/internal-test-utils';
import { LicenseInfo } from '@mui/x-license';
import { ChartContainerPro } from './ChartContainerPro';

describe('<ChartContainerPro /> - License', () => {
  const { render } = createRenderer();

  it('should render watermark when the license is missing', async () => {
    LicenseInfo.setLicenseKey('');

    expect(() => render(<ChartContainerPro series={[]} width={100} height={100} />)).toErrorDev([
      'MUI X: Missing license key.',
    ]);

    expect(await screen.findAllByText('MUI X Missing license key')).not.to.equal(null);
  });
});
