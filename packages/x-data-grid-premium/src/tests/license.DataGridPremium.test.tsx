import { addYears } from 'date-fns/addYears';
import { createRenderer, screen } from '@mui/internal-test-utils';
import { DataGridPremium } from '@mui/x-data-grid-premium';
import { clearLicenseStatusCache, generateLicense, LicenseInfo } from '@mui/x-license';

describe('<DataGridPremium /> - License', () => {
  const { render } = createRenderer();

  it('should throw out of scope error when using DataGridPremium with a pro license', () => {
    LicenseInfo.setLicenseKey(
      generateLicense({
        expiryDate: addYears(new Date(), 1),
        orderNumber: '123',
        licenseModel: 'subscription',
        planScope: 'pro',
        planVersion: 'initial',
      }),
    );
    expect(() => render(<DataGridPremium columns={[]} rows={[]} autoHeight />)).toErrorDev([
      'MUI X: License key plan mismatch',
    ]);
  });

  it('should render watermark when the license is missing', () => {
    // Clear any previous license status cache to ensure a clean test environment
    // Needed, because we run test with "isolate: false"
    clearLicenseStatusCache();
    LicenseInfo.setLicenseKey('');

    expect(() => render(<DataGridPremium columns={[]} rows={[]} autoHeight />)).toErrorDev([
      'MUI X: Missing license key.',
    ]);

    expect(screen.getByText('MUI X Missing license key')).not.to.equal(null);
  });
});
