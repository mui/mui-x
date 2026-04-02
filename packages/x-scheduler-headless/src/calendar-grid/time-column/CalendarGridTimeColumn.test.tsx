import * as React from 'react';
import { screen } from '@mui/internal-test-utils';
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
  const start = adapter.startOfDay(day);
  const end = adapter.endOfDay(day);

  function TimeColumnWrapper({
    children,
    ...providerProps
  }: { children: React.ReactNode } & Partial<React.ComponentProps<typeof EventCalendarProvider>>) {
    return (
      <EventCalendarProvider events={[]} {...providerProps}>
        <CalendarGrid.Root>{children}</CalendarGrid.Root>
      </EventCalendarProvider>
    );
  }

  describeConformance(<CalendarGrid.TimeColumn start={start} end={end} />, () => ({
    refInstanceof: window.HTMLDivElement,
    render: (node) => render(<TimeColumnWrapper>{node}</TimeColumnWrapper>),
  }));

  describe('keyboard interactions', () => {
    it('should create a timed event placeholder on Enter keypress', async () => {
      let store: AnyEventCalendarStore | null = null;

      const { user } = render(
        <TimeColumnWrapper>
          <CalendarGrid.TimeColumn start={start} end={end} />
          <SchedulerStoreRunner<AnyEventCalendarStore>
            context={SchedulerStoreContext as any}
            onMount={(s) => {
              store = s;
            }}
          />
        </TimeColumnWrapper>,
      );

      const cell = screen.getByRole('gridcell');
      await user.click(cell);
      await user.keyboard('{Enter}');

      expect(store!.state.occurrencePlaceholder).not.to.equal(null);
      expect(store!.state.occurrencePlaceholder?.type).to.equal('creation');
      expect(store!.state.occurrencePlaceholder?.surfaceType).to.equal('time-grid');
    });

    it('should not create event on Enter when eventCreation is false', async () => {
      let store: AnyEventCalendarStore | null = null;

      const { user } = render(
        <TimeColumnWrapper eventCreation={false}>
          <CalendarGrid.TimeColumn start={start} end={end} />
          <SchedulerStoreRunner<AnyEventCalendarStore>
            context={SchedulerStoreContext as any}
            onMount={(s) => {
              store = s;
            }}
          />
        </TimeColumnWrapper>,
      );

      const cell = screen.getByRole('gridcell');
      await user.click(cell);
      await user.keyboard('{Enter}');

      expect(store!.state.occurrencePlaceholder).to.equal(null);
    });
  });
});
