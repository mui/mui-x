import * as React from 'react';
import { act, fireEvent, screen } from '@mui/internal-test-utils';
import { CalendarGrid } from '@mui/x-scheduler-headless/calendar-grid';
import { EventCalendarProvider } from '@mui/x-scheduler-headless/event-calendar-provider';
import { SchedulerStoreContext } from '@mui/x-scheduler-headless/use-scheduler-store-context';
import {
  adapter,
  createSchedulerRenderer,
  describeConformance,
  SchedulerStoreRunner,
  AnyEventCalendarStore,
} from 'test/utils/scheduler';

describe('<CalendarGrid.TimeColumn />', () => {
  const { render } = createSchedulerRenderer();

  const day = adapter.now('default');

  describeConformance(
    <CalendarGrid.TimeColumn start={adapter.startOfDay(day)} end={adapter.endOfDay(day)} />,
    () => ({
      refInstanceof: window.HTMLDivElement,
      render(node) {
        return render(
          <EventCalendarProvider events={[]}>
            <CalendarGrid.Root>{node}</CalendarGrid.Root>
          </EventCalendarProvider>,
        );
      },
    }),
  );

  describe('keyboard interactions', () => {
    it('should create a timed event placeholder on Enter keypress', () => {
      let store: AnyEventCalendarStore | null = null;

      render(
        <EventCalendarProvider events={[]}>
          <CalendarGrid.Root>
            <CalendarGrid.TimeColumn start={adapter.startOfDay(day)} end={adapter.endOfDay(day)} />
          </CalendarGrid.Root>
          <SchedulerStoreRunner<AnyEventCalendarStore>
            context={SchedulerStoreContext as unknown as React.Context<AnyEventCalendarStore>}
            onMount={(s) => {
              store = s;
            }}
          />
        </EventCalendarProvider>,
      );

      const cell = screen.getByRole('gridcell');
      act(() => {
        cell.focus();
      });
      fireEvent.keyDown(cell, { key: 'Enter' });

      expect(store!.state.occurrencePlaceholder).not.to.equal(null);
      expect(store!.state.occurrencePlaceholder?.type).to.equal('creation');
      expect(store!.state.occurrencePlaceholder?.surfaceType).to.equal('time-grid');
    });

    it('should not create event on Enter when eventCreation is false', () => {
      let store: AnyEventCalendarStore | null = null;

      render(
        <EventCalendarProvider events={[]} eventCreation={false}>
          <CalendarGrid.Root>
            <CalendarGrid.TimeColumn start={adapter.startOfDay(day)} end={adapter.endOfDay(day)} />
          </CalendarGrid.Root>
          <SchedulerStoreRunner<AnyEventCalendarStore>
            context={SchedulerStoreContext as unknown as React.Context<AnyEventCalendarStore>}
            onMount={(s) => {
              store = s;
            }}
          />
        </EventCalendarProvider>,
      );

      const cell = screen.getByRole('gridcell');
      act(() => {
        cell.focus();
      });
      fireEvent.keyDown(cell, { key: 'Enter' });

      expect(store!.state.occurrencePlaceholder).to.equal(null);
    });
  });
});
