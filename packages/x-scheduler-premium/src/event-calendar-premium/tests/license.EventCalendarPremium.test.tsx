import { screen } from '@mui/internal-test-utils';
import { EventCalendarPremium } from '@mui/x-scheduler-premium/event-calendar-premium';
import { LicenseInfo } from '@mui/x-license';
import { TEST_LICENSE_KEY_PRO, clearLicenseStatusCache } from '@mui/x-license/internals';
import {
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE,
  DEFAULT_TESTING_VISIBLE_DATE_STR,
} from 'test/utils/scheduler';

describe('<EventCalendarPremium /> - License', () => {
  const { render } = createSchedulerRenderer({
    clockConfig: new Date(DEFAULT_TESTING_VISIBLE_DATE_STR),
  });

  it('should throw out of scope error when using EventCalendarPremium with a pro license', () => {
    LicenseInfo.setLicenseKey(TEST_LICENSE_KEY_PRO);
    expect(() =>
      render(
        <EventCalendarPremium
          events={[]}
          visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
          view="week"
          views={['week']}
        />,
      ),
    ).toErrorDev(['MUI X: License key plan mismatch']);
  });

  it('should render watermark when the license is missing', () => {
    clearLicenseStatusCache();
    LicenseInfo.setLicenseKey('');

    expect(() =>
      render(
        <EventCalendarPremium
          events={[]}
          visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
          view="week"
          views={['week']}
        />,
      ),
    ).toErrorDev(['MUI X: Missing license key.']);

    expect(screen.getByText('MUI X Missing license key')).not.to.equal(null);
  });
});
