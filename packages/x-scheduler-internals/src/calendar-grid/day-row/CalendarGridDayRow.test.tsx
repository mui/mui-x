import { CalendarGrid } from '@mui/x-scheduler-internals/calendar-grid';
import { adapter, createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';
import { EventCalendarProvider } from '@mui/x-scheduler-internals/event-calendar-provider';

describe('<CalendarGrid.DayRow />', () => {
  const { render } = createSchedulerRenderer();

  const day = adapter.now('default');

  describeConformance(
    <CalendarGrid.DayRow start={adapter.startOfDay(day)} end={adapter.endOfDay(day)} />,
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
