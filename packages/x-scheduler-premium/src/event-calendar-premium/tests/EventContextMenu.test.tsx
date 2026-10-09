import * as React from 'react';
import { screen, fireEvent, waitFor } from '@mui/internal-test-utils';
import {
  adapter,
  createMatchMedia,
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE,
  EventBuilder,
  StoreSpy,
  utcJuly4AllDayBuilder,
} from 'test/utils/scheduler';
import { SchedulerStoreContext } from '@mui/x-scheduler-internals/use-scheduler-store-context';
import { ExtendableEventCalendarStore } from '@mui/x-scheduler-internals/use-event-calendar';
import { schedulerRecurringEventsPlugin } from '@mui/x-scheduler-internals-premium/internals';
import {
  EventCalendarProvider,
  EventEditingProvider,
  EventContextMenuProvider,
  EventContextMenuTrigger,
} from '@mui/x-scheduler/internals';
import { EventCalendarPremium } from '@mui/x-scheduler-premium/event-calendar-premium';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import type { MockInstance } from 'vitest';
import { RecurringScopeDialog } from '../../internals/components/recurring-scope-dialog/RecurringScopeDialog';

/**
 * A test store that behaves like a premium store, enabling recurring event features. Mirrors the
 * one in `event-calendar-premium/tests/EventDialog.test.tsx`.
 */
class PremiumTestStore extends ExtendableEventCalendarStore<any, any> {
  public constructor(parameters: any, adapterParam: any) {
    super(parameters, adapterParam, 'EventCalendarPremiumStore', schedulerRecurringEventsPlugin);
  }
}

describe('EventContextMenu - recurring events (Premium)', () => {
  const { render } = createSchedulerRenderer();

  it('should open the recurring scope dialog instead of deleting immediately when Delete is clicked on a recurring occurrence', () => {
    const weeklyEventBuilder = EventBuilder.new(adapter)
      .title('Weekly sync')
      .singleDay('2025-05-26T09:00:00Z', 30)
      .recurrent('WEEKLY');
    const occurrence = weeklyEventBuilder.toOccurrence();

    let deleteEventSpy: MockInstance | undefined;
    let deleteRecurringEventSpy: MockInstance | undefined;

    render(
      <EventCalendarProvider
        events={[weeklyEventBuilder.build()]}
        resources={[]}
        storeClass={PremiumTestStore}
      >
        <StoreSpy
          Context={SchedulerStoreContext}
          method="deleteEvent"
          onSpyReady={(sp) => {
            deleteEventSpy = sp;
          }}
        />
        <StoreSpy
          Context={SchedulerStoreContext}
          method="deleteRecurringEvent"
          onSpyReady={(sp) => {
            deleteRecurringEventSpy = sp;
          }}
        />
        <EventEditingProvider surface="dialog">
          <EventContextMenuProvider>
            <EventContextMenuTrigger occurrence={occurrence}>
              <button type="button">Weekly sync</button>
            </EventContextMenuTrigger>
          </EventContextMenuProvider>
        </EventEditingProvider>
        <RecurringScopeDialog />
      </EventCalendarProvider>,
    );

    fireEvent.contextMenu(screen.getByRole('button', { name: 'Weekly sync' }));
    fireEvent.click(screen.getByRole('menuitem', { name: /delete/i }));

    expect(deleteRecurringEventSpy?.mock.calls.length).to.equal(1);
    expect(deleteEventSpy?.mock.calls.length).to.equal(0);
    expect(screen.getByText(/Apply this change to:/i)).not.to.equal(null);
  });

  it('should identify the deleted occurrence by its data-timezone start from another timezone', () => {
    const weeklyEventBuilder = utcJuly4AllDayBuilder()
      .title('Weekly sync')
      .recurrent('WEEKLY')
      .withDisplayTimezone('America/New_York');
    const occurrence = weeklyEventBuilder.toOccurrence();

    let deleteRecurringEventSpy: MockInstance | undefined;

    render(
      <EventCalendarProvider
        events={[weeklyEventBuilder.build()]}
        resources={[]}
        storeClass={PremiumTestStore}
        displayTimezone="America/New_York"
      >
        <StoreSpy
          Context={SchedulerStoreContext}
          method="deleteRecurringEvent"
          onSpyReady={(sp) => {
            deleteRecurringEventSpy = sp;
          }}
        />
        <EventEditingProvider surface="dialog">
          <EventContextMenuProvider>
            <EventContextMenuTrigger occurrence={occurrence}>
              <button type="button">Weekly sync</button>
            </EventContextMenuTrigger>
          </EventContextMenuProvider>
        </EventEditingProvider>
        <RecurringScopeDialog />
      </EventCalendarProvider>,
    );

    fireEvent.contextMenu(screen.getByRole('button', { name: 'Weekly sync' }));
    fireEvent.click(screen.getByRole('menuitem', { name: /delete/i }));

    // The display bounds of this occurrence normalize to New York July 3rd; the
    // exception must land on the event's own July 4th.
    expect(deleteRecurringEventSpy?.mock.calls.length).to.equal(1);
    expect(adapter.getTime(deleteRecurringEventSpy!.mock.lastCall![0].occurrenceStart)).to.equal(
      adapter.getTime(adapter.date('2025-07-04T00:00:00', 'UTC')),
    );
    // The recurring branch defers to the scope dialog instead of deleting right away.
    expect(screen.getByText(/Apply this change to:/i)).not.to.equal(null);
  });

  describe('focus', () => {
    const originalMatchMedia = window.matchMedia;
    beforeEach(() => {
      window.matchMedia = createMatchMedia(false);
    });
    afterEach(() => {
      window.matchMedia = originalMatchMedia;
    });

    it('should leave focus in the scope dialog once the menu has closed', async () => {
      const weeklyEvent = EventBuilder.new(adapter)
        .title('Weekly sync')
        .singleDay('2025-07-03T09:00:00Z', 30)
        .recurrent('WEEKLY')
        .build();
      render(
        <EventCalendarPremium
          events={[weeklyEvent]}
          resources={[]}
          defaultView="day"
          defaultVisibleDate={DEFAULT_TESTING_VISIBLE_DATE}
        />,
      );

      fireEvent.contextMenu(screen.getByRole('button', { name: /^Weekly sync,/ }));
      fireEvent.click(screen.getByRole('menuitem', { name: /delete/i }));
      const dialog = await screen.findByRole('dialog');

      await waitFor(() => {
        expect(screen.queryByRole('menu')).to.equal(null);
      });
      expect(dialog.contains(document.activeElement)).to.equal(true);
    });
  });
});
