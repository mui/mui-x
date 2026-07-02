import { spy } from 'sinon';
import { screen, fireEvent } from '@mui/internal-test-utils';
import { LicenseInfo } from '@mui/x-license';
import { clearLicenseStatusCache } from '@mui/x-license/internals';
import { TEST_LICENSE_KEY_PREMIUM } from 'test/utils/licenseKeys';
import type { SchedulerEvent } from '@mui/x-scheduler/models';
import {
  createSchedulerRenderer,
  EventBuilder,
  DEFAULT_TESTING_VISIBLE_DATE,
  DEFAULT_TESTING_VISIBLE_DATE_STR,
} from 'test/utils/scheduler';
import { StandaloneCompactDayViewPremium } from '@mui/x-scheduler-premium/compact-day-view-premium';

/**
 * Deleting a recurring event from the armed-event toolbar must route through the recurring scope
 * dialog (mirroring the form's delete), rather than removing the whole series silently.
 */
describe('CompactDayViewPremium - event toolbar (recurring)', () => {
  const { render } = createSchedulerRenderer({
    clockConfig: new Date(DEFAULT_TESTING_VISIBLE_DATE_STR),
  });

  beforeEach(() => {
    clearLicenseStatusCache();
    LicenseInfo.setLicenseKey(TEST_LICENSE_KEY_PREMIUM);
  });

  it('opens the recurring scope dialog when deleting a recurring event from the toolbar', () => {
    const event = EventBuilder.new()
      .id('event-1')
      .title('Daily Standup')
      .recurrent('DAILY')
      .build();

    render(
      <StandaloneCompactDayViewPremium
        events={[event]}
        visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
        onEventsChange={spy()}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /Daily Standup/i }));
    fireEvent.click(screen.getByRole('button', { name: 'Delete event' }));

    // The scope dialog is shown instead of deleting the whole series outright.
    expect(screen.getByText(/All events/i)).not.to.equal(null);
  });

  it('deletes only the chosen occurrence, keeping the rest of the series', async () => {
    const onEventsChange = spy();
    const event = EventBuilder.new()
      .id('event-1')
      .title('Daily Standup')
      .recurrent('DAILY')
      .build();

    const { user } = render(
      <StandaloneCompactDayViewPremium
        events={[event]}
        visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
        onEventsChange={onEventsChange}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /Daily Standup/i }));
    fireEvent.click(screen.getByRole('button', { name: 'Delete event' }));

    // Confirm the default, non-destructive scope ("Only this event") rather than "All events".
    // `user.click` awaits the `stopEditing` microtask the delete's `onSubmit` schedules.
    await user.click(screen.getByRole('button', { name: /Confirm/i }));

    // The series survives: `onEventsChange` still carries the recurring event, not a wiped series.
    expect(onEventsChange.callCount).to.equal(1);
    const updatedEvents = onEventsChange.lastCall.args[0];
    expect(updatedEvents.some((item: SchedulerEvent) => item.id === 'event-1')).to.equal(true);
  });
});
