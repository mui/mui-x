import * as React from 'react';
import { screen, fireEvent } from '@mui/internal-test-utils';
import { adapter, createSchedulerRenderer, EventBuilder, StoreSpy } from 'test/utils/scheduler';
import { SchedulerStoreContext } from '@mui/x-scheduler-internals/use-scheduler-store-context';
import { ExtendableEventCalendarStore } from '@mui/x-scheduler-internals/use-event-calendar';
import { schedulerRecurringEventsPlugin } from '@mui/x-scheduler-internals-premium/internals';
import {
  EventCalendarProvider,
  EventEditingProvider,
  EventContextMenuProvider,
  EventContextMenuTrigger,
} from '@mui/x-scheduler/internals';
import { describe, it, expect, type Mock } from 'vitest';
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

    let deleteEventSpy: Mock | undefined;
    let deleteRecurringEventSpy: Mock | undefined;

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
});
