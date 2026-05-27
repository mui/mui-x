import { CalendarGrid } from '@mui/x-scheduler-internals/calendar-grid';
import { createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';
import { EventCalendarProvider } from '@mui/x-scheduler-internals/event-calendar-provider';

describe('<CalendarGrid.Root />', () => {
  const { render } = createSchedulerRenderer();

  describeConformance(<CalendarGrid.Root />, () => ({
    refInstanceof: window.HTMLDivElement,
    render(node) {
      return render(<EventCalendarProvider events={[]}>{node}</EventCalendarProvider>);
    },
  }));
});
