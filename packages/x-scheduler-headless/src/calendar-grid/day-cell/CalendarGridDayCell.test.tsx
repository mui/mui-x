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

describe('<CalendarGrid.DayCell />', () => {
  const { render } = createSchedulerRenderer();

  const day = adapter.now('default');

  describeConformance(<CalendarGrid.DayCell value={day} />, () => ({
    refInstanceof: window.HTMLDivElement,
    render(node) {
      return render(
        <EventCalendarProvider events={[]}>
          <CalendarGrid.Root>
            <CalendarGrid.DayRow start={adapter.startOfDay(day)} end={adapter.endOfDay(day)}>
              {node}
            </CalendarGrid.DayRow>
          </CalendarGrid.Root>
        </EventCalendarProvider>,
      );
    },
  }));

  describe('keyboard interactions', () => {
    it('should have tabIndex="0" by default for keyboard focusability', () => {
      render(
        <EventCalendarProvider events={[]}>
          <CalendarGrid.Root>
            <CalendarGrid.DayRow start={adapter.startOfDay(day)} end={adapter.endOfDay(day)}>
              <CalendarGrid.DayCell value={day} />
            </CalendarGrid.DayRow>
          </CalendarGrid.Root>
        </EventCalendarProvider>,
      );
      const cell = screen.getByRole('gridcell');
      expect(cell).to.have.attribute('tabindex', '0');
    });

    it('should create an all-day event placeholder on Enter keypress', () => {
      let store: AnyEventCalendarStore | null = null;

      render(
        <EventCalendarProvider events={[]}>
          <CalendarGrid.Root>
            <CalendarGrid.DayRow start={adapter.startOfDay(day)} end={adapter.endOfDay(day)}>
              <CalendarGrid.DayCell value={day} />
            </CalendarGrid.DayRow>
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
      expect(store!.state.occurrencePlaceholder?.surfaceType).to.equal('day-grid');
    });

    it('should not create event on Enter when eventCreation is false', () => {
      let store: AnyEventCalendarStore | null = null;

      render(
        <EventCalendarProvider events={[]} eventCreation={false}>
          <CalendarGrid.Root>
            <CalendarGrid.DayRow start={adapter.startOfDay(day)} end={adapter.endOfDay(day)}>
              <CalendarGrid.DayCell value={day} />
            </CalendarGrid.DayRow>
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
