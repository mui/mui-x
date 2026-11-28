import { toPlainDate } from '@mui/x-scheduler-internals/internals';
import * as React from 'react';
import { screen, fireEvent, waitFor, within } from '@mui/internal-test-utils';
import { LicenseInfo } from '@mui/x-license';
import { clearLicenseStatusCache } from '@mui/x-license/internals';
import { TEST_LICENSE_KEY_PREMIUM } from 'test/utils/licenseKeys';
import type { SchedulerEvent } from '@mui/x-scheduler/models';
import {
  createDate,
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE,
  DEFAULT_TESTING_VISIBLE_DATE_STR,
  EventBuilder,
  utcJuly4AllDayBuilder,
} from 'test/utils/scheduler';
import { StandaloneCompactDayViewPremium } from '@mui/x-scheduler-premium/compact-day-view-premium';
import { recurringEventsFeature } from '@mui/x-scheduler-premium/recurring-events';
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

  it('should use the plain delete confirmation without the recurring events feature', () => {
    const onEventsChange = vi.fn();
    const event = EventBuilder.new()
      .id('event-1')
      .title('Daily Standup')
      .recurrent('DAILY')
      .build();

    expect(() => {
      render(
        <StandaloneCompactDayViewPremium
          events={[event]}
          visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
          onEventsChange={onEventsChange}
        />,
      );
    }).toWarnDev('Recurring events are not enabled');

    fireEvent.click(screen.getByRole('button', { name: /Daily Standup/i }));
    fireEvent.click(screen.getByRole('button', { name: 'Delete event' }));

    // The plain delete confirmation is shown, not the recurring scope dialog.
    expect(screen.queryByText(/All events/i)).to.equal(null);
    const dialog = screen.getByRole('dialog', { name: /delete this event/i });
    fireEvent.click(within(dialog).getByRole('button', { name: 'Delete event' }));

    expect(onEventsChange.mock.calls.length).to.equal(1);
    expect(onEventsChange.mock.lastCall?.[0]).to.deep.equal([]);
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
        features={{ recurringEvents: recurringEventsFeature }}
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

  it('should exclude the displayed day of the occurrence when deleted from another timezone', async () => {
    const onEventsChange = vi.fn();
    // An all-day series on July 4th, displayed on July 4th in New York too.
    const event = utcJuly4AllDayBuilder()
      .id('event-1')
      .title('Weekly sync')
      .recurrent('WEEKLY')
      .build();

    const { user } = render(
      <StandaloneCompactDayViewPremium
        features={{ recurringEvents: recurringEventsFeature }}
        events={[event]}
        visibleDate={createDate('2025-07-04T00:00:00', 'America/New_York')}
        displayTimezone="America/New_York"
        onEventsChange={onEventsChange}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /Weekly sync/i }));
    fireEvent.click(screen.getByRole('button', { name: 'Delete event' }));
    await user.click(screen.getByRole('button', { name: /Confirm/i }));

    // The exception lands on July 4th.
    const updatedEvents = onEventsChange.mock.lastCall?.[0];
    const series = updatedEvents.find((item: SchedulerEvent) => item.id === 'event-1')!;
    expect(series.exDates).to.have.length(1);
    expect(
      toPlainDate(createDate(String(series.exDates![0]), 'UTC').getTime(), 'UTC'),
    ).toEqualPlainDate('2025-07-04');
  });

  it('should move focus to the column of the event once an edit with "Only this event" moves it out of the series', async () => {
    const initialEvent = EventBuilder.new()
      .id('event-1')
      .title('Daily Standup')
      .recurrent('DAILY')
      .build();
    function StatefulCompactDayView() {
      const [events, setEvents] = React.useState<SchedulerEvent[]>([initialEvent]);
      return (
        <StandaloneCompactDayViewPremium
          features={{ recurringEvents: recurringEventsFeature }}
          events={events}
          visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
          onEventsChange={setEvents}
        />
      );
    }
    const { user } = render(<StatefulCompactDayView />);
    const event = screen.getByRole('button', { name: /Daily Standup/i });
    const column = event.closest('[role="gridcell"]');

    await user.click(event);
    await user.click(screen.getByRole('button', { name: 'Edit event' }));
    await user.type(screen.getByRole('textbox', { name: /Event title/i }), ' (moved)');
    await user.click(screen.getByRole('button', { name: 'Save' }));
    await user.click(screen.getByRole('radio', { name: 'Only this event' }));
    await user.click(screen.getByRole('button', { name: 'Confirm' }));

    expect(event.isConnected).to.equal(false);
    await waitFor(() => {
      expect(document.activeElement).to.equal(column);
    });
  });
});
