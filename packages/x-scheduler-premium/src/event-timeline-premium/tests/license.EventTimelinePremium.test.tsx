import { screen } from '@mui/internal-test-utils';
import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';
import { LicenseInfo } from '@mui/x-license';
import { clearLicenseStatusCache } from '@mui/x-license/internals';
import { TEST_LICENSE_KEY_PRO } from 'test/utils/licenseKeys';
import {
  absorbObserverFrames,
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE,
  DEFAULT_TESTING_VISIBLE_DATE_STR,
} from 'test/utils/scheduler';
import { describe, it, expect } from 'vitest';

describe('<EventTimelinePremium /> - License', () => {
  const { render } = createSchedulerRenderer({
    clockConfig: new Date(DEFAULT_TESTING_VISIBLE_DATE_STR),
  });

  it('should throw out of scope error when using EventTimelinePremium with a pro license', async () => {
    LicenseInfo.setLicenseKey(TEST_LICENSE_KEY_PRO);
    expect(() =>
      render(
        <EventTimelinePremium
          resources={[]}
          shouldEventRequireResource={false}
          events={[]}
          visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
          preset="dayAndMonth"
          presets={['dayAndMonth']}
        />,
      ),
    ).toErrorDev(['MUI X: License key plan mismatch']);
    // Absorb the post-render ResizeObserver deliveries so they land as acted updates.
    await absorbObserverFrames();
  });

  it('should render watermark when the license is missing', async () => {
    clearLicenseStatusCache();
    LicenseInfo.setLicenseKey('');

    expect(() =>
      render(
        <EventTimelinePremium
          resources={[]}
          shouldEventRequireResource={false}
          events={[]}
          visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
          preset="dayAndMonth"
          presets={['dayAndMonth']}
        />,
      ),
    ).toErrorDev(['MUI X: Missing license key.']);
    await absorbObserverFrames();

    expect(screen.getByText('MUI X Missing license key')).not.to.equal(null);
  });
});
