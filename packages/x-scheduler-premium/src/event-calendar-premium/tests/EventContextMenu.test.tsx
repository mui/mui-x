import * as React from 'react';
import { act, screen, fireEvent, waitFor, within } from '@mui/internal-test-utils';
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
import type { SchedulerEvent } from '@mui/x-scheduler/models';
import { recurringEventsFeature } from '@mui/x-scheduler-premium/recurring-events';
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
          features={{ recurringEvents: recurringEventsFeature }}
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

    // Feeds `onEventsChange` back into `events`, so a delete actually removes the event.
    function StatefulCalendar(props: { initialEvents: SchedulerEvent[] }) {
      const [events, setEvents] = React.useState(props.initialEvents);
      return (
        <EventCalendarPremium
          features={{ recurringEvents: recurringEventsFeature }}
          events={events}
          onEventsChange={setEvents}
          resources={[]}
          defaultView="month"
          defaultVisibleDate={DEFAULT_TESTING_VISIBLE_DATE}
        />
      );
    }

    async function deleteWithScope(
      user: ReturnType<typeof render>['user'],
      eventButton: HTMLElement,
      scope: RegExp,
    ) {
      await act(async () => {
        eventButton.focus();
      });
      await user.keyboard(' ');
      await user.click(await screen.findByRole('menuitem', { name: /delete/i }));
      const dialog = await screen.findByRole('dialog', { name: /apply this change to/i });
      await user.click(within(dialog).getByRole('radio', { name: scope }));
      await user.click(within(dialog).getByRole('button', { name: /confirm/i }));
      await waitFor(() => {
        expect(screen.queryByRole('dialog', { name: /apply this change to/i })).to.equal(null);
      });
    }

    it('should move focus to the day cell once the scope dialog deletes the event in the month view', async () => {
      const weeklyEvent = EventBuilder.new(adapter)
        .title('Weekly sync')
        .singleDay('2025-07-03T09:00:00Z', 30)
        .recurrent('WEEKLY')
        .build();
      const { user } = render(<StatefulCalendar initialEvents={[weeklyEvent]} />);

      const [eventButton] = screen.getAllByRole('button', { name: /^Weekly sync,/ });
      const cell = eventButton.closest<HTMLElement>('[role="gridcell"]')!;
      await deleteWithScope(user, eventButton, /all events/i);

      expect(screen.queryAllByRole('button', { name: /^Weekly sync,/ })).to.have.length(0);
      await waitFor(() => {
        expect(document.activeElement).to.equal(cell);
      });
    });

    it('should move focus to the next event of the "+N more" popover once the scope dialog deletes the event', async () => {
      const otherEvents = [8, 10, 11, 12, 13].map((hour) =>
        EventBuilder.new(adapter)
          .title(`Event ${hour}`)
          .singleDay(`2025-07-03T${String(hour).padStart(2, '0')}:00:00Z`, 30)
          .build(),
      );
      const weeklyEvent = EventBuilder.new(adapter)
        .title('Weekly sync')
        .singleDay('2025-07-03T09:00:00Z', 30)
        .recurrent('WEEKLY')
        .build();
      const { user } = render(<StatefulCalendar initialEvents={[...otherEvents, weeklyEvent]} />);

      const [moreButton] = await screen.findAllByRole('button', { name: /more/i });
      await user.click(moreButton);
      const popover = await screen.findByRole('presentation');
      await deleteWithScope(
        user,
        within(popover).getByRole('button', { name: /^Weekly sync,/ }),
        /only this event/i,
      );

      await waitFor(() => {
        expect(document.activeElement).to.equal(
          within(popover).getByRole('button', { name: /^Event 10,/ }),
        );
      });
    });
  });

  describe('eventDeletion={false}', () => {
    const originalMatchMedia = window.matchMedia;
    afterEach(() => {
      window.matchMedia = originalMatchMedia;
    });

    function renderRecurringEvent() {
      const weeklyEvent = EventBuilder.new(adapter)
        .title('Weekly sync')
        .singleDay('2025-07-03T09:00:00Z', 30)
        .recurrent('WEEKLY')
        .build();
      render(
        <EventCalendarPremium
          features={{ recurringEvents: recurringEventsFeature }}
          events={[weeklyEvent]}
          resources={[]}
          defaultView="day"
          defaultVisibleDate={DEFAULT_TESTING_VISIBLE_DATE}
          eventDeletion={false}
        />,
      );
    }

    function getEvent() {
      return screen.getByRole('button', { name: /^Weekly sync,/ });
    }

    it('should not offer Delete in the context menu of a recurring occurrence', () => {
      window.matchMedia = createMatchMedia(false);
      renderRecurringEvent();

      fireEvent.contextMenu(getEvent());

      expect(screen.getByRole('menuitem', { name: /edit/i })).not.to.equal(null);
      expect(screen.queryByRole('menuitem', { name: /delete/i })).to.equal(null);
    });

    it('should not render the Delete event button in the editing dialog of a recurring occurrence', async () => {
      window.matchMedia = createMatchMedia(false);
      renderRecurringEvent();

      fireEvent.click(getEvent());

      expect(await screen.findByRole('button', { name: 'Save' })).not.to.equal(null);
      expect(screen.queryByRole('button', { name: 'Delete event' })).to.equal(null);
    });

    it('should not render the toolbar Delete button for a recurring occurrence', () => {
      window.matchMedia = createMatchMedia(true);
      renderRecurringEvent();

      fireEvent.click(getEvent());

      expect(screen.getByRole('button', { name: 'Edit event' })).not.to.equal(null);
      expect(screen.queryByRole('button', { name: 'Delete event' })).to.equal(null);
    });
  });
});
