import { CalendarGrid } from '@mui/x-scheduler-internals/calendar-grid';
import { adapter, createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';
import { EventCalendarProvider } from '@mui/x-scheduler-internals/event-calendar-provider';
import { processDate } from '@mui/x-scheduler-internals/process-date';
import { describe } from 'vitest';
import { buildTemporalPlainDate } from '../../internals/utils/plain-date-utils/date';

describe('<CalendarGrid.DayEventResizeHandler />', () => {
  const { render } = createSchedulerRenderer();

  describeConformance(<CalendarGrid.DayEventResizeHandler side="start" />, () => ({
    refInstanceof: window.HTMLDivElement,
    render(node) {
      const eventStart = processDate(adapter.now('default'), 'default');
      const eventEnd = processDate(adapter.addHours(eventStart.value, 1), 'default');
      const cellDate = buildTemporalPlainDate(eventStart.value, 'default');
      return render(
        <EventCalendarProvider events={[]}>
          <CalendarGrid.Root>
            <CalendarGrid.DayRow
              start={eventStart.timestamp}
              end={eventEnd.timestamp}
              days={[{ plainDate: cellDate }]}
            >
              <CalendarGrid.DayCell value={cellDate}>
                <CalendarGrid.DayEvent
                  eventId="fake-id"
                  occurrenceKey="fake-key"
                  dataTimezone={undefined}
                  start={eventStart}
                  end={eventEnd}
                  renderDragPreview={() => null}
                >
                  {node}
                </CalendarGrid.DayEvent>
              </CalendarGrid.DayCell>
            </CalendarGrid.DayRow>
          </CalendarGrid.Root>
        </EventCalendarProvider>,
      );
    },
  }));
});
