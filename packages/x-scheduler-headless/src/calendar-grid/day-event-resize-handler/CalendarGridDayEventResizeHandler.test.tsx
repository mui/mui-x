import { CalendarGrid } from '@mui/x-scheduler-headless/calendar-grid';
import { adapter, createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';
import { EventCalendarProvider } from '@mui/x-scheduler-headless/event-calendar-provider';

describe('<CalendarGrid.DayEventResizeHandler />', () => {
  const { render } = createSchedulerRenderer();

  const eventStart = adapter.date();
  const eventEnd = adapter.addHours(eventStart, 1);

  describeConformance(<CalendarGrid.DayEventResizeHandler side="start" />, () => ({
    refInstanceof: window.HTMLDivElement,
    render(node) {
      return render(
        <EventCalendarProvider events={[]}>
          <CalendarGrid.Root>
            <CalendarGrid.DayRow start={eventStart} end={eventEnd}>
              <CalendarGrid.DayCell value={eventStart}>
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
