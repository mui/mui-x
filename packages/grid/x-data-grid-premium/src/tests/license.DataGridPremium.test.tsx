import * as React from 'react';
import addYears from 'date-fns/addYears';
import { expect } from 'chai';
// @ts-ignore Remove once the test utils are typed
import { createRenderer } from '@mui/monorepo/test/utils';
import { DataGridPremium } from '@mui/x-data-grid-premium';
import { generateLicense, LicenseInfo } from '@mui/x-license-pro';

describe('<DataGridPremium /> - License', () => {
  const { render } = createRenderer();

  it('should throw out of scope error when using DataGridPremium with a pro license', () => {
    LicenseInfo.setLicenseKey(
      generateLicense({
        expiryDate: addYears(new Date(), 1),
        orderNumber: 'Test',
        scope: 'pro',
      }),
    );
    expect(() => render(<DataGridPremium columns={[]} rows={[]} autoHeight />)).toErrorDev([
      'MUI: License key plan mismatch',
    ]);
  });
});
