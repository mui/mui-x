import { CalendarGrid } from '@mui/x-scheduler-internals/calendar-grid';
import { createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';
import { EventCalendarProvider } from '@mui/x-scheduler-internals/event-calendar-provider';
import { toZonedDateTime } from '@mui/x-scheduler-internals/internals';
import { describe } from 'vitest';

describe('<CalendarGrid.DayEventPlaceholder />', () => {
  const { render } = createSchedulerRenderer();

  const eventStart = toZonedDateTime(Date.now(), 'default');
  const eventEnd = toZonedDateTime(eventStart.epochMilliseconds + 3_600_000, 'default');
  const cellDate = eventStart.toPlainDate();

  describeConformance(
    <CalendarGrid.DayEventPlaceholder start={eventStart} end={eventEnd} />,
    () => ({
      refInstanceof: window.HTMLDivElement,
      render(node) {
        return render(
          <EventCalendarProvider events={[]}>
            <CalendarGrid.Root>
              <CalendarGrid.DayRow
                start={eventStart.epochMilliseconds}
                end={eventEnd.epochMilliseconds}
                days={[cellDate]}
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
