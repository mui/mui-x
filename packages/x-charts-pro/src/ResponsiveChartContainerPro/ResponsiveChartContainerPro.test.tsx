import * as React from 'react';
import { expect } from 'chai';
import { createRenderer, screen, waitFor } from '@mui/internal-test-utils';
import { LicenseInfo } from '@mui/x-license';
import { ResponsiveChartContainerPro } from './ResponsiveChartContainerPro';

describe('<ResponsiveChartContainerPro /> - License', () => {
  const { render } = createRenderer();

  it('should render watermark when the license is missing', async () => {
    LicenseInfo.setLicenseKey('');

    expect(() =>
      render(<ResponsiveChartContainerPro series={[]} width={100} height={100} />),
    ).toErrorDev(['MUI X: Missing license key.']);

    await waitFor(() => {
      expect(screen.getByText('MUI X Missing license key')).to.not.equal(null);
    });
  });
});
