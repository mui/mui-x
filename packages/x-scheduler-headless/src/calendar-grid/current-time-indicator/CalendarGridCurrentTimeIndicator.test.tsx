import { CalendarGrid } from '@mui/x-scheduler-headless/calendar-grid';
import { EventCalendarProvider } from '@mui/x-scheduler-headless/event-calendar-provider';
import { adapter, createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';

describe('<CalendarGrid.CurrentTimeIndicator />', () => {
  const { render } = createSchedulerRenderer();

  const day = adapter.now('default');

  describeConformance(<CalendarGrid.CurrentTimeIndicator />, () => ({
    refInstanceof: window.HTMLDivElement,
    render(node) {
      return render(
        <EventCalendarProvider events={[]}>
          <CalendarGrid.Root>
            <CalendarGrid.TimeColumn start={adapter.startOfDay(day)} end={adapter.endOfDay(day)}>
              {node}
            </CalendarGrid.TimeColumn>
          </CalendarGrid.Root>
        </EventCalendarProvider>,
      );
    },
  }));
});
