import * as React from 'react';
import type { SinonSpy } from 'sinon';
import { screen, fireEvent } from '@mui/internal-test-utils';
import {
  adapter,
  createSchedulerRenderer,
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
import { describe, it, expect } from 'vitest';
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

    let deleteEventSpy: SinonSpy | undefined;
    let deleteRecurringEventSpy: SinonSpy | undefined;

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

    expect(deleteRecurringEventSpy?.calledOnce).to.equal(true);
    expect(deleteEventSpy?.called).to.equal(false);
    expect(screen.getByText(/Apply this change to:/i)).not.to.equal(null);
  });

  it('should identify the deleted occurrence by its data-timezone start from another timezone', () => {
    const weeklyEventBuilder = utcJuly4AllDayBuilder(adapter)
      .title('Weekly sync')
      .recurrent('WEEKLY')
      .withDisplayTimezone('America/New_York');
    const occurrence = weeklyEventBuilder.toOccurrence();

    let deleteRecurringEventSpy: SinonSpy | undefined;

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
    expect(deleteRecurringEventSpy?.calledOnce).to.equal(true);
    expect(adapter.getTime(deleteRecurringEventSpy!.lastCall.firstArg.occurrenceStart)).to.equal(
      adapter.getTime(adapter.date('2025-07-04T00:00:00', 'UTC')),
    );
  });
});
