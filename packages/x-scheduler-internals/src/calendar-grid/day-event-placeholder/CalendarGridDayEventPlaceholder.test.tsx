import { CalendarGrid } from '@mui/x-scheduler-internals/calendar-grid';
import { createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';
import { EventCalendarProvider } from '@mui/x-scheduler-internals/event-calendar-provider';
import { createProcessedDate } from '@mui/x-scheduler-internals/process-date';
import { describe } from 'vitest';

describe('<CalendarGrid.DayEventPlaceholder />', () => {
  const { render } = createSchedulerRenderer();

  const eventStart = createProcessedDate(Date.now(), 'default');
  const eventEnd = createProcessedDate(eventStart.timestamp + 3_600_000, 'default');
  const cellDate = eventStart.plainDateTime.toPlainDate();

  describeConformance(
    <CalendarGrid.DayEventPlaceholder start={eventStart} end={eventEnd} />,
    () => ({
      refInstanceof: window.HTMLDivElement,
      render(node) {
        return render(
          <EventCalendarProvider events={[]}>
            <CalendarGrid.Root>
              <CalendarGrid.DayRow
                start={eventStart.timestamp}
                end={eventEnd.timestamp}
                days={[{ plainDate: cellDate }]}
              >
                <CalendarGrid.DayCell value={cellDate}>{node}</CalendarGrid.DayCell>
              </CalendarGrid.DayRow>
            </CalendarGrid.Root>
          </EventCalendarProvider>,
        );
      },
    }),
  );
});
