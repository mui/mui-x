import * as React from 'react';
import { screen } from '@mui/internal-test-utils';
import { CalendarGrid } from '@mui/x-scheduler-headless/calendar-grid';
import { EventCalendarProvider } from '@mui/x-scheduler-headless/event-calendar-provider';
import { GridRowType } from '@mui/x-scheduler-headless/models';
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
    rowTypes,
    rowsPerType,
    ...providerProps
  }: {
    children: React.ReactNode;
    rowTypes?: GridRowType[];
    rowsPerType?: Partial<Record<GridRowType, number>>;
  } & Partial<React.ComponentProps<typeof EventCalendarProvider>>) {
    return (
      <EventCalendarProvider events={[]} {...providerProps}>
        <CalendarGrid.Root rowTypes={rowTypes} rowsPerType={rowsPerType}>
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
    it('should create an all-day event placeholder on Enter keypress', async () => {
      let store: AnyEventCalendarStore | null = null;

      const { user } = render(
        <DayCellWrapper>
          <CalendarGrid.DayCell value={day} />
          <SchedulerStoreRunner<AnyEventCalendarStore>
            context={SchedulerStoreContext as any}
            onMount={(s) => {
              store = s;
            }}
          />
        </DayCellWrapper>,
      );

      const cell = screen.getByRole('gridcell');
      await user.click(cell);
      await user.keyboard('{Enter}');

      expect(store!.state.occurrencePlaceholder).not.to.equal(null);
      expect(store!.state.occurrencePlaceholder?.type).to.equal('creation');
      expect(store!.state.occurrencePlaceholder?.surfaceType).to.equal('day-grid');
    });

    it('should not create event on Enter when pressed on a child element', async () => {
      let store: AnyEventCalendarStore | null = null;

      const { user } = render(
        <DayCellWrapper>
          <CalendarGrid.DayCell value={day}>
            <button type="button">child</button>
          </CalendarGrid.DayCell>
          <SchedulerStoreRunner<AnyEventCalendarStore>
            context={SchedulerStoreContext as any}
            onMount={(s) => {
              store = s;
            }}
          />
        </DayCellWrapper>,
      );

      const button = screen.getByRole('button', { name: 'child' });
      await user.click(button);
      await user.keyboard('{Enter}');

      expect(store!.state.occurrencePlaceholder).to.equal(null);
    });

    it('should not create event on Enter when eventCreation is false', async () => {
      let store: AnyEventCalendarStore | null = null;

      const { user } = render(
        <DayCellWrapper eventCreation={false}>
          <CalendarGrid.DayCell value={day} />
          <SchedulerStoreRunner<AnyEventCalendarStore>
            context={SchedulerStoreContext as any}
            onMount={(s) => {
              store = s;
            }}
          />
        </DayCellWrapper>,
      );

      const cell = screen.getByRole('gridcell');
      await user.click(cell);
      await user.keyboard('{Enter}');

      expect(store!.state.occurrencePlaceholder).to.equal(null);
    });
  });

  describe('arrow key navigation', () => {
    it('should move focus to the next cell on ArrowRight', async () => {
      const day2 = adapter.addDays(day, 1);
      const { user } = render(
        <DayCellWrapper rowTypes={['day-grid']} rowsPerType={{}}>
          <CalendarGrid.DayCell value={day} />
          <CalendarGrid.DayCell value={day2} />
        </DayCellWrapper>,
      );

      const cells = screen.getAllByRole('gridcell');
      await user.click(cells[0]);
      await user.keyboard('{ArrowRight}');

      expect(cells[1]).toHaveFocus();
    });

    it('should move focus to the previous cell on ArrowLeft', async () => {
      const day2 = adapter.addDays(day, 1);
      const { user } = render(
        <DayCellWrapper rowTypes={['day-grid']} rowsPerType={{}}>
          <CalendarGrid.DayCell value={day} />
          <CalendarGrid.DayCell value={day2} />
        </DayCellWrapper>,
      );

      const cells = screen.getAllByRole('gridcell');
      await user.click(cells[1]);
      await user.keyboard('{ArrowLeft}');

      expect(cells[0]).toHaveFocus();
    });

    it('should not move focus on ArrowRight at the last column', async () => {
      const { user } = render(
        <DayCellWrapper rowTypes={['day-grid']} rowsPerType={{}}>
          <CalendarGrid.DayCell value={day} />
        </DayCellWrapper>,
      );

      const cell = screen.getByRole('gridcell');
      await user.click(cell);
      await user.keyboard('{ArrowRight}');

      expect(cell).toHaveFocus();
    });

    it('should not move focus on ArrowLeft at the first column', async () => {
      const { user } = render(
        <DayCellWrapper rowTypes={['day-grid']} rowsPerType={{}}>
          <CalendarGrid.DayCell value={day} />
        </DayCellWrapper>,
      );

      const cell = screen.getByRole('gridcell');
      await user.click(cell);
      await user.keyboard('{ArrowLeft}');

      expect(cell).toHaveFocus();
    });

    it('should keep all cells tabbable so Tab flows through the grid', async () => {
      const day2 = adapter.addDays(day, 1);
      const { user } = render(
        <DayCellWrapper rowTypes={['day-grid']} rowsPerType={{}}>
          <CalendarGrid.DayCell value={day} />
          <CalendarGrid.DayCell value={day2} />
        </DayCellWrapper>,
      );

      const cells = screen.getAllByRole('gridcell');

      // All cells are always tabbable
      await user.click(cells[0]);
      expect(cells[0]).to.have.attribute('tabindex', '0');
      expect(cells[1]).to.have.attribute('tabindex', '0');

      // After navigating, all cells remain tabbable
      await user.keyboard('{ArrowRight}');
      expect(cells[0]).to.have.attribute('tabindex', '0');
      expect(cells[1]).to.have.attribute('tabindex', '0');
    });
  });
});
