import { createRenderer, screen } from '@mui/internal-test-utils';
import { DataGridPremium } from '@mui/x-data-grid-premium';
import { LicenseInfo } from '@mui/x-license';
import { TEST_LICENSE_KEY_PRO, clearLicenseStatusCache } from '@mui/x-license/internals';

describe('<DataGridPremium /> - License', () => {
  const { render } = createRenderer();

  it('should throw out of scope error when using DataGridPremium with a pro license', () => {
    LicenseInfo.setLicenseKey(TEST_LICENSE_KEY_PRO);
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
