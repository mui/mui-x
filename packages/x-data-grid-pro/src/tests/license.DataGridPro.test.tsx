import * as React from 'react';
import { expect } from 'chai';
import { createRenderer, screen, waitFor } from '@mui/internal-test-utils';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { LicenseInfo } from '@mui/x-license';

describe('<DataGridPro /> - License', () => {
  const { render } = createRenderer();

  it('should render watermark when the license is missing', async () => {
    LicenseInfo.setLicenseKey('');

    expect(() => render(<DataGridPro columns={[]} rows={[]} autoHeight />)).toErrorDev([
      'MUI X: Missing license key.',
    ]);

    await waitFor(() => {
      expect(screen.getByText('MUI X Missing license key')).not.to.equal(null);
    });
  });
});
