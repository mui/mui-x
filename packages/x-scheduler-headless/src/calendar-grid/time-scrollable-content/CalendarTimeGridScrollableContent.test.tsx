import { CalendarGrid } from '@mui/x-scheduler-headless/calendar-grid';
import { EventCalendarProvider } from '@mui/x-scheduler-headless/event-calendar-provider';
import { createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';

describe('<CalendarGrid.TimeScrollableContent />', () => {
  const { render } = createSchedulerRenderer();

  describeConformance(<CalendarGrid.TimeScrollableContent />, () => ({
    refInstanceof: window.HTMLDivElement,
    render(node) {
      return render(
        <EventCalendarProvider events={[]}>
          <CalendarGrid.Root>{node}</CalendarGrid.Root>
        </EventCalendarProvider>,
      );
    },
  }));
});
