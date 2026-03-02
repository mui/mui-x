import { addYears } from 'date-fns/addYears';
import { screen } from '@mui/internal-test-utils';
import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';
import { clearLicenseStatusCache, generateLicense, LicenseInfo } from '@mui/x-license';
import {
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE,
  DEFAULT_TESTING_VISIBLE_DATE_STR,
} from 'test/utils/scheduler';

describe('<EventTimelinePremium /> - License', () => {
  const { render } = createSchedulerRenderer({
    clockConfig: new Date(DEFAULT_TESTING_VISIBLE_DATE_STR),
  });

  it('should throw out of scope error when using EventTimelinePremium with a pro license', () => {
    LicenseInfo.setLicenseKey(
      generateLicense({
        expiryDate: addYears(new Date(), 1),
        orderNumber: '123',
        licenseModel: 'subscription',
        planScope: 'pro',
        planVersion: 'initial',
      }),
    );
    expect(() =>
      render(
        <EventTimelinePremium
          resources={[]}
          events={[]}
          visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
          view="days"
          views={['days']}
        />,
      ),
    ).toErrorDev(['MUI X: License key plan mismatch']);
  });

  it('should render watermark when the license is missing', () => {
    clearLicenseStatusCache();
    LicenseInfo.setLicenseKey('');

    expect(() =>
      render(
        <EventTimelinePremium
          resources={[]}
          events={[]}
          visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
          view="days"
          views={['days']}
        />,
      ),
    ).toErrorDev(['MUI X: Missing license key.']);

    expect(screen.getByText('MUI X Missing license key')).not.to.equal(null);
  });
});
