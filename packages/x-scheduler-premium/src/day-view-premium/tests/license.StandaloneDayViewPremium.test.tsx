import { screen } from '@mui/internal-test-utils';
import { StandaloneDayViewPremium } from '@mui/x-scheduler-premium/day-view-premium';
import { LicenseInfo } from '@mui/x-license';
import { clearLicenseStatusCache } from '@mui/x-license/internals';
import { TEST_LICENSE_KEY_PREMIUM, TEST_LICENSE_KEY_PRO } from '@mui/x-license/test-keys';
import {
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE,
  DEFAULT_TESTING_VISIBLE_DATE_STR,
} from 'test/utils/scheduler';

describe('<StandaloneDayViewPremium /> - License', () => {
  const { render } = createSchedulerRenderer({
    clockConfig: new Date(DEFAULT_TESTING_VISIBLE_DATE_STR),
  });

  beforeEach(() => {
    clearLicenseStatusCache();
  });

  it('should render without watermark when a valid premium license is set', () => {
    LicenseInfo.setLicenseKey(TEST_LICENSE_KEY_PREMIUM);
    render(
      <StandaloneDayViewPremium
        events={[]}
        visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
        view="day"
        views={['day']}
      />,
    );

    expect(screen.queryByText('MUI X Missing license key')).to.equal(null);
  });

  it('should throw out of scope error when using StandaloneDayViewPremium with a pro license', () => {
    LicenseInfo.setLicenseKey(TEST_LICENSE_KEY_PRO);
    expect(() =>
      render(
        <StandaloneDayViewPremium
          events={[]}
          visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
          view="day"
          views={['day']}
        />,
      ),
    ).toErrorDev(['MUI X: License key plan mismatch']);
  });

  it('should render watermark when the license is missing', () => {
    LicenseInfo.setLicenseKey('');

    expect(() =>
      render(
        <StandaloneDayViewPremium
          events={[]}
          visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
          view="day"
          views={['day']}
        />,
      ),
    ).toErrorDev(['MUI X: Missing license key.']);

    expect(screen.getByText('MUI X Missing license key')).not.to.equal(null);
  });
});
