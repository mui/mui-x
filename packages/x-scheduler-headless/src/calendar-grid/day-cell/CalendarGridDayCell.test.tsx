import { CalendarGrid } from '@mui/x-scheduler-headless/calendar-grid';
import { adapter, createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';
import { EventCalendarProvider } from '@mui/x-scheduler-headless/event-calendar-provider';

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
});
