import * as React from 'react';
import addYears from 'date-fns/addYears';
import { expect } from 'chai';
// @ts-ignore Remove once the test utils are typed
import { createRenderer } from '@mui/monorepo/test/utils';
import { DataGridPremium, LicenseInfo } from '@mui/x-data-grid-premium';
import { generateLicense } from '@mui/x-license-pro';

describe('<DataGridPro /> - Layout', () => {
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
      'Your MUI X license key isn\'t valid. You are rendering a DataGridPremium component that requires a license key with the "premium" feature scope but your license key has the "pro" feature scope',
    ]);
  });
});
