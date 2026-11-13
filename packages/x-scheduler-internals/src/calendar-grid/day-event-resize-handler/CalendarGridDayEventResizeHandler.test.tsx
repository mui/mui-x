import { CalendarGrid } from '@mui/x-scheduler-internals/calendar-grid';
import { createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';
import { EventCalendarProvider } from '@mui/x-scheduler-internals/event-calendar-provider';
import { createProcessedDate } from '@mui/x-scheduler-internals/process-date';
import { describe } from 'vitest';

describe('<CalendarGrid.DayEventResizeHandler />', () => {
  const { render } = createSchedulerRenderer();

  describeConformance(<CalendarGrid.DayEventResizeHandler side="start" />, () => ({
    refInstanceof: window.HTMLDivElement,
    render(node) {
      const eventStart = createProcessedDate(Date.now(), 'default');
      const eventEnd = createProcessedDate(eventStart.timestamp + 3_600_000, 'default');
      const cellDate = eventStart.value.toPlainDate();
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
                  internalInfos={undefined}
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
