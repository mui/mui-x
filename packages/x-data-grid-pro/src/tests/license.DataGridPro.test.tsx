import { createRenderer, screen } from '@mui/internal-test-utils';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { LicenseInfo } from '@mui/x-license';

describe('<DataGridPro /> - License', () => {
  const { render } = createRenderer();

  beforeEach(() => {
    LicenseInfo.setLicenseKey('');
  });

  it('should render watermark when the license is missing', () => {
    expect(() => render(<DataGridPro columns={[]} rows={[]} autoHeight />)).toErrorDev([
      'MUI X: Missing license key.',
    ]);

    expect(screen.getByText('MUI X Missing license key')).not.to.equal(null);
  });
});
