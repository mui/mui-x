import { CalendarGrid } from '@mui/x-scheduler-headless/calendar-grid';
import { adapter, createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';
import { EventCalendarProvider } from '@mui/x-scheduler-headless/event-calendar-provider';
import { processDate } from '@mui/x-scheduler-headless/process-date';

describe('<CalendarGrid.DayEventPlaceholder />', () => {
  const { render } = createSchedulerRenderer();

  const eventStart = processDate(adapter.date(), adapter);
  const eventEnd = processDate(adapter.addHours(eventStart.value, 1), adapter);

  describeConformance(
    <CalendarGrid.DayEventPlaceholder start={eventStart} end={eventEnd} />,
    () => ({
      refInstanceof: window.HTMLDivElement,
      render(node) {
        return render(
          <EventCalendarProvider events={[]}>
            <CalendarGrid.Root>
              <CalendarGrid.DayRow start={eventStart.value} end={eventEnd.value}>
                <CalendarGrid.DayCell value={eventStart.value}>{node}</CalendarGrid.DayCell>
              </CalendarGrid.DayRow>
            </CalendarGrid.Root>
          </EventCalendarProvider>,
        );
      },
    }),
  );
});
