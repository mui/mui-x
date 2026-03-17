import { createRenderer, screen } from '@mui/internal-test-utils';
import { clearLicenseStatusCache, LicenseInfo } from '@mui/x-license';
import { BarChartPro } from './BarChartPro';

describe('<BarChartPro /> - License', () => {
  const { render } = createRenderer();

  beforeEach(() => {
    // Clear any previous license status cache to ensure a clean test environment
    // Needed, because we run test with "isolate: false"
    clearLicenseStatusCache();
    LicenseInfo.setLicenseKey('');
  });

  it('should render watermark when the license is missing', async () => {
    expect(() => render(<BarChartPro series={[]} width={100} height={100} />)).toErrorDev([
      'MUI X: Missing license key.',
    ]);

    expect(await screen.findAllByText('MUI X Missing license key')).not.to.equal(null);
  });
});
