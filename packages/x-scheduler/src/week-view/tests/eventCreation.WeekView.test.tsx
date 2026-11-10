import type { AnyEventCalendarStore } from 'test/utils/scheduler';
import { createSchedulerRenderer, SchedulerStoreRunner } from 'test/utils/scheduler';
import { act, screen } from '@mui/internal-test-utils';
import { SchedulerStoreContext } from '@mui/x-scheduler-internals/use-scheduler-store-context';
import { WeekView } from '@mui/x-scheduler/week-view';
import { vi, describe, it, expect } from 'vitest';
import { EventCalendarProvider } from '../../internals/components/EventCalendarProvider';
import { eventCalendarClasses } from '../../event-calendar';
import { EventDialogProvider } from '../../internals/components/event-dialog';

describe('<WeekView /> event creation', () => {
  const { render } = createSchedulerRenderer({ clockConfig: new Date('2025-05-26') });

  it('should fire `onEventEditingStart` once with the initiating keydown and drop the draft when canceling a keyboard creation', async () => {
    let store: AnyEventCalendarStore | null = null;
    const onEventEditingStart = vi.fn((_occurrence: any, eventDetails: any) =>
      eventDetails.cancel(),
    );
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

    expect(onEventEditingStart.mock.calls.length).to.equal(1);
    expect(onEventEditingStart.mock.lastCall?.[1].reason).to.equal('creation');
    expect(onEventEditingStart.mock.lastCall?.[1].event.type).to.equal('keydown');
    // The trigger is the built-in dialog's anchor for this path, i.e. the column's interactive layer.
    expect(onEventEditingStart.mock.lastCall?.[1].trigger).to.equal(
      column.querySelector(`.${eventCalendarClasses.dayTimeGridColumnInteractiveLayer}`),
    );
    expect(screen.queryByRole('dialog')).to.equal(null);
    // Canceling a creation drops the draft placeholder.
    expect(store!.state.occurrencePlaceholder).to.equal(null);
  });

  describe.each([
    // Without a display timezone, the creations keep the `'default'` timezone of the occurrences.
    { displayTimezone: undefined, timezone: 'default' },
    { displayTimezone: 'America/New_York', timezone: 'America/New_York' },
  ])('in the $timezone display timezone', ({ displayTimezone, timezone }) => {
    async function createWithKeyboard(className: string) {
      const onEventEditingStart = vi.fn((_occurrence: any, eventDetails: any) =>
        eventDetails.cancel(),
      );
      const { user } = render(
        <EventCalendarProvider
          events={[]}
          resources={[]}
          displayTimezone={displayTimezone}
          onEventEditingStart={onEventEditingStart}
        >
          <EventDialogProvider>
            <WeekView />
          </EventDialogProvider>
        </EventCalendarProvider>,
      );

      act(() => {
        document.querySelector<HTMLElement>(`[role="gridcell"].${className}`)!.focus();
      });
      await user.keyboard('{Enter}');

      expect(onEventEditingStart.mock.calls.length).to.equal(1);
      return onEventEditingStart.mock.lastCall![0];
    }

    it('should pass a creation in the time grid to `onEventEditingStart` in the display timezone', async () => {
      const occurrence = await createWithKeyboard(eventCalendarClasses.dayTimeGridColumn);

      expect(occurrence.displayTimezone.timezone).to.equal(timezone);
      // The creation starts at noon.
      expect(occurrence.displayTimezone.start.minutesInDay).to.equal(12 * 60);
    });

    it('should pass a creation in the day grid to `onEventEditingStart` in the display timezone', async () => {
      const occurrence = await createWithKeyboard(eventCalendarClasses.dayTimeGridAllDayEventsCell);

      expect(occurrence.displayTimezone.timezone).to.equal(timezone);
      // The creation ends on the last minute of its day.
      expect(occurrence.displayTimezone.end.minutesInDay).to.equal(24 * 60 - 1);
    });
  });
});
