import { CalendarGrid } from '@mui/x-scheduler-headless/calendar-grid';
import { adapter, createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';
import { EventCalendarProvider } from '@mui/x-scheduler-headless/event-calendar-provider';
import { processDate } from '@mui/x-scheduler-headless/process-date';

describe('<CalendarGrid.DayEventResizeHandler />', () => {
  const { render } = createSchedulerRenderer();

  describeConformance(<CalendarGrid.DayEventResizeHandler side="start" />, () => ({
    refInstanceof: window.HTMLDivElement,
    render(node) {
      const eventStart = processDate(adapter.now('default'), adapter);
      const eventEnd = processDate(adapter.addHours(eventStart.value, 1), adapter);
      return render(
        <EventCalendarProvider events={[]}>
          <CalendarGrid.Root>
            <CalendarGrid.DayRow start={eventStart.value} end={eventEnd.value}>
              <CalendarGrid.DayCell value={eventStart.value}>
                <CalendarGrid.DayEvent
                  eventId="fake-id"
                  occurrenceKey="fake-key"
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
