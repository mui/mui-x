import { CalendarGrid } from '@mui/x-scheduler-headless/calendar-grid';
import { EventCalendarProvider } from '@mui/x-scheduler-headless/event-calendar-provider';
import { adapter, createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';

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
});
