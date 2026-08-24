import { spy } from 'sinon';
import type { AnyEventCalendarStore } from 'test/utils/scheduler';
import { createSchedulerRenderer, SchedulerStoreRunner } from 'test/utils/scheduler';
import { act, screen } from '@mui/internal-test-utils';
import { SchedulerStoreContext } from '@mui/x-scheduler-internals/use-scheduler-store-context';
import { WeekView } from '@mui/x-scheduler/week-view';
import { describe, it, expect } from 'vitest';
import { EventCalendarProvider } from '../../internals/components/EventCalendarProvider';
import { eventCalendarClasses } from '../../event-calendar';
import { EventDialogProvider } from '../../internals/components/event-dialog';

describe('<WeekView /> event creation', () => {
  const { render } = createSchedulerRenderer({ clockConfig: new Date('2025-05-26') });

  it('should fire `onEventEditingStart` once with the initiating keydown and drop the draft when canceling a keyboard creation', async () => {
    let store: AnyEventCalendarStore | null = null;
    const onEventEditingStart = spy((_occurrence: any, eventDetails: any) => eventDetails.cancel());
    const { user } = render(
      <EventCalendarProvider events={[]} resources={[]} onEventEditingStart={onEventEditingStart}>
        <EventDialogProvider>
          <WeekView />
        </EventDialogProvider>
        <SchedulerStoreRunner<AnyEventCalendarStore>
          context={SchedulerStoreContext as any}
          onMount={(s) => {
            store = s;
          }}
        />
      </EventCalendarProvider>,
    );

    // Focus a timed column without clicking, so the Enter keydown is the only creation trigger.
    const column = document.querySelector<HTMLElement>(
      `.${eventCalendarClasses.dayTimeGridColumn}`,
    )!;
    act(() => {
      column.focus();
    });
    await user.keyboard('{Enter}');

    expect(onEventEditingStart.calledOnce).to.equal(true);
    expect(onEventEditingStart.lastCall.args[1].reason).to.equal('creation');
    expect(onEventEditingStart.lastCall.args[1].event.type).to.equal('keydown');
    // The trigger is the built-in dialog's anchor for this path, i.e. the column's interactive layer.
    expect(onEventEditingStart.lastCall.args[1].trigger).to.equal(
      column.querySelector(`.${eventCalendarClasses.dayTimeGridColumnInteractiveLayer}`),
    );
    expect(screen.queryByRole('dialog')).to.equal(null);
    // Canceling a creation drops the draft placeholder.
    expect(store!.state.occurrencePlaceholder).to.equal(null);
  });
});
