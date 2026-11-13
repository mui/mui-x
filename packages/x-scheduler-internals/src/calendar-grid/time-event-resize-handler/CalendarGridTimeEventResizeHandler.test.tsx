import { CalendarGrid } from '@mui/x-scheduler-internals/calendar-grid';
import { createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';
import { EventCalendarProvider } from '@mui/x-scheduler-internals/event-calendar-provider';
import { createProcessedDate } from '@mui/x-scheduler-internals/process-date';
import { describe } from 'vitest';

describe('<CalendarGrid.TimeEventResizeHandler />', () => {
  const { render } = createSchedulerRenderer();

  const eventStart = createProcessedDate(Date.now(), 'default');
  const eventEnd = createProcessedDate(eventStart.timestamp + 3_600_000, 'default');

  describeConformance(<CalendarGrid.TimeEventResizeHandler side="start" />, () => ({
    refInstanceof: window.HTMLDivElement,
    render(node) {
      return render(
        <EventCalendarProvider events={[]}>
          <CalendarGrid.Root>
            <CalendarGrid.TimeColumn value={eventStart.value.toPlainDate()}>
              <CalendarGrid.TimeEvent
                eventId="fake-id"
                occurrenceKey="fake-key"
                internalInfos={undefined}
                start={eventStart}
                end={eventEnd}
                renderDragPreview={() => null}
              >
                {node}
              </CalendarGrid.TimeEvent>
            </CalendarGrid.TimeColumn>
          </CalendarGrid.Root>
        </EventCalendarProvider>,
      );
    },
  }));
});
