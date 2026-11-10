import { CalendarGrid } from '@mui/x-scheduler-internals/calendar-grid';
import { adapter, createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';
import { EventCalendarProvider } from '@mui/x-scheduler-internals/event-calendar-provider';
import { processDate } from '@mui/x-scheduler-internals/process-date';
import { describe } from 'vitest';
import { buildTemporalPlainDate } from '../../internals/utils/plain-date-utils/adapter';

describe('<CalendarGrid.DayEventPlaceholder />', () => {
  const { render } = createSchedulerRenderer();

  const eventStart = processDate(adapter.now('default'), adapter, 'default');
  const eventEnd = processDate(adapter.addHours(eventStart.value, 1), adapter, 'default');

  describeConformance(
    <CalendarGrid.DayEventPlaceholder start={eventStart} end={eventEnd} />,
    () => ({
      refInstanceof: window.HTMLDivElement,
      render(node) {
        return render(
          <EventCalendarProvider events={[]}>
            <CalendarGrid.Root>
              <CalendarGrid.DayRow start={eventStart.timestamp} end={eventEnd.timestamp}>
                <CalendarGrid.DayCell
                  value={buildTemporalPlainDate(adapter, eventStart.value, 'default')}
                >
                  {node}
                </CalendarGrid.DayCell>
              </CalendarGrid.DayRow>
            </CalendarGrid.Root>
          </EventCalendarProvider>,
        );
      },
    }),
  );
});
