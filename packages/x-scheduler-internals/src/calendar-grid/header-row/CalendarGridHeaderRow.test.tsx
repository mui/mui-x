import { CalendarGrid } from '@mui/x-scheduler-internals/calendar-grid';
import { createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';
import { EventCalendarProvider } from '@mui/x-scheduler-internals/event-calendar-provider';

describe('<CalendarGrid.HeaderRow />', () => {
  const { render } = createSchedulerRenderer();

  describeConformance(<CalendarGrid.HeaderRow />, () => ({
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
