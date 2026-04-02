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

  function DayCellWrapper({
    children,
    ...providerProps
  }: { children: React.ReactNode } & Partial<React.ComponentProps<typeof EventCalendarProvider>>) {
    return (
      <EventCalendarProvider events={[]} {...providerProps}>
        <CalendarGrid.Root>
          <CalendarGrid.DayRow start={adapter.startOfDay(day)} end={adapter.endOfDay(day)}>
            {children}
          </CalendarGrid.DayRow>
        </CalendarGrid.Root>
      </EventCalendarProvider>
    );
  }

  describeConformance(<CalendarGrid.DayCell value={day} />, () => ({
    refInstanceof: window.HTMLDivElement,
    render: (node) => render(<DayCellWrapper>{node}</DayCellWrapper>),
  }));

  describe('keyboard interactions', () => {
    it('should create an all-day event placeholder on Enter keypress', () => {
      let store: AnyEventCalendarStore | null = null;

      render(
        <DayCellWrapper>
          <CalendarGrid.DayCell value={day} />
          <SchedulerStoreRunner<AnyEventCalendarStore>
            context={SchedulerStoreContext as unknown as React.Context<AnyEventCalendarStore>}
            onMount={(s) => {
              store = s;
            }}
          />
        </DayCellWrapper>,
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
        <DayCellWrapper eventCreation={false}>
          <CalendarGrid.DayCell value={day} />
          <SchedulerStoreRunner<AnyEventCalendarStore>
            context={SchedulerStoreContext as unknown as React.Context<AnyEventCalendarStore>}
            onMount={(s) => {
              store = s;
            }}
          />
        </DayCellWrapper>,
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
