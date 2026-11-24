import { CalendarGrid } from '@mui/x-scheduler-internals/calendar-grid';
import {
  createSchedulerRenderer,
  describeConformance,
  endOfDay,
  startOfDay,
} from 'test/utils/scheduler';
import { EventCalendarProvider } from '@mui/x-scheduler-internals/event-calendar-provider';
import { describe } from 'vitest';

describe('<CalendarGrid.DayRow />', () => {
  const { render } = createSchedulerRenderer();

  const day = new Date();

  describeConformance(
    <CalendarGrid.DayRow
      start={startOfDay(day).getTime()}
      end={endOfDay(day).getTime()}
      days={[]}
    />,
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
