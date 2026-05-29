import { screen } from '@mui/internal-test-utils';
import { StandaloneAgendaViewPremium } from '@mui/x-scheduler-premium/agenda-view-premium';
import { LicenseInfo } from '@mui/x-license';
import { clearLicenseStatusCache } from '@mui/x-license/internals';
import { TEST_LICENSE_KEY_PRO } from '@mui/x-license/test-keys';
import {
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE,
  DEFAULT_TESTING_VISIBLE_DATE_STR,
} from 'test/utils/scheduler';

describe('<StandaloneAgendaViewPremium /> - License', () => {
  const { render } = createSchedulerRenderer({
    clockConfig: new Date(DEFAULT_TESTING_VISIBLE_DATE_STR),
  });

  it('should throw out of scope error when using StandaloneAgendaViewPremium with a pro license', () => {
    LicenseInfo.setLicenseKey(TEST_LICENSE_KEY_PRO);
    expect(() =>
      render(
        <StandaloneAgendaViewPremium
          events={[]}
          visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
          view="agenda"
          views={['agenda']}
        />,
      ),
    ).toErrorDev(['MUI X: License key plan mismatch']);
  });

  it('should render watermark when the license is missing', () => {
    clearLicenseStatusCache();
    LicenseInfo.setLicenseKey('');

    expect(() =>
      render(
        <StandaloneAgendaViewPremium
          events={[]}
          visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
          view="agenda"
          views={['agenda']}
        />,
      ),
    ).toErrorDev(['MUI X: Missing license key.']);

    expect(screen.getByText('MUI X Missing license key')).not.to.equal(null);
  });
});
