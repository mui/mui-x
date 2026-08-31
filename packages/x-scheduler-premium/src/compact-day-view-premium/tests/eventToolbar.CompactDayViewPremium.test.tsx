import { screen, fireEvent } from '@mui/internal-test-utils';
import { LicenseInfo } from '@mui/x-license';
import { clearLicenseStatusCache } from '@mui/x-license/internals';
import { TEST_LICENSE_KEY_PREMIUM } from 'test/utils/licenseKeys';
import type { SchedulerEvent } from '@mui/x-scheduler/models';
import {
  adapter,
  createSchedulerRenderer,
  EventBuilder,
  utcJuly4AllDayBuilder,
  DEFAULT_TESTING_VISIBLE_DATE,
  DEFAULT_TESTING_VISIBLE_DATE_STR,
} from 'test/utils/scheduler';
import { StandaloneCompactDayViewPremium } from '@mui/x-scheduler-premium/compact-day-view-premium';
import { vi, describe, it, expect, beforeEach } from 'vitest';

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

  it('should open the recurring scope dialog when deleting a recurring event from the toolbar', () => {
    const event = EventBuilder.new()
      .id('event-1')
      .title('Daily Standup')
      .recurrent('DAILY')
      .build();

    render(
      <StandaloneCompactDayViewPremium
        events={[event]}
        visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
        onEventsChange={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /Daily Standup/i }));
    fireEvent.click(screen.getByRole('button', { name: 'Delete event' }));

    // The scope dialog is shown instead of deleting the whole series outright.
    expect(screen.getByText(/All events/i)).not.to.equal(null);
  });

  it('should delete only the chosen occurrence, keeping the rest of the series', async () => {
    const onEventsChange = vi.fn();
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
    expect(onEventsChange.mock.calls.length).to.equal(1);
    const updatedEvents = onEventsChange.mock.lastCall?.[0];
    expect(updatedEvents.some((item: SchedulerEvent) => item.id === 'event-1')).to.equal(true);
  });

  it('should exclude the occurrence of its own day when deleted from another timezone', async () => {
    const onEventsChange = vi.fn();
    // A UTC all-day series whose display bounds normalize to New York July 3rd → 4th.
    const event = utcJuly4AllDayBuilder()
      .id('event-1')
      .title('Weekly sync')
      .recurrent('WEEKLY')
      .build();

    const { user } = render(
      <StandaloneCompactDayViewPremium
        events={[event]}
        visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
        displayTimezone="America/New_York"
        onEventsChange={onEventsChange}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /Weekly sync/i }));
    fireEvent.click(screen.getByRole('button', { name: 'Delete event' }));
    await user.click(screen.getByRole('button', { name: /Confirm/i }));

    // The exception lands on the event's own July 4th, not the displayed July 3rd.
    const updatedEvents = onEventsChange.mock.lastCall?.[0];
    const series = updatedEvents.find((item: SchedulerEvent) => item.id === 'event-1')!;
    expect(series.exDates).to.have.length(1);
    expect(
      adapter.formatByString(adapter.date(String(series.exDates![0]), 'UTC'), 'yyyy-MM-dd'),
    ).to.equal('2025-07-04');
  });
});
