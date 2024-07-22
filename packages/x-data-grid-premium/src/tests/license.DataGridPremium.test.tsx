import * as React from 'react';
import addYears from 'date-fns/addYears';
import { expect } from 'chai';
import { createRenderer, screen, waitFor } from '@mui/internal-test-utils';
import { DataGridPremium } from '@mui/x-data-grid-premium';
import { generateLicense, LicenseInfo } from '@mui/x-license';

describe('<DataGridPremium /> - License', () => {
  const { render } = createRenderer();

  it('should throw out of scope error when using DataGridPremium with a pro license', () => {
    LicenseInfo.setLicenseKey(
      generateLicense({
        expiryDate: addYears(new Date(), 1),
        orderNumber: 'Test',
        licensingModel: 'subscription',
        scope: 'pro',
        planVersion: 'initial',
      }),
    );
    expect(() => render(<DataGridPremium columns={[]} rows={[]} autoHeight />)).toErrorDev([
      'MUI X: License key plan mismatch',
    ]);
  });

  it('should render watermark when the license is missing', async () => {
    LicenseInfo.setLicenseKey('');

    expect(() => render(<DataGridPremium columns={[]} rows={[]} autoHeight />)).toErrorDev([
      'MUI X: Missing license key.',
    ]);

    await waitFor(() => {
      expect(screen.getByText('MUI X Missing license key')).not.to.equal(null);
    });
  });
});
