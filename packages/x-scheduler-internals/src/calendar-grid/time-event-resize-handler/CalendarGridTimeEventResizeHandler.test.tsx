import { CalendarGrid } from '@mui/x-scheduler-internals/calendar-grid';
import { addHours, createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';
import { EventCalendarProvider } from '@mui/x-scheduler-internals/event-calendar-provider';
import { processDate } from '@mui/x-scheduler-internals/process-date';
import { describe } from 'vitest';
import { toPlainDate } from '@mui/x-scheduler-internals/internals';

describe('<CalendarGrid.TimeEventResizeHandler />', () => {
  const { render } = createSchedulerRenderer();

  const eventStart = processDate(new Date(), 'default');
  const eventEnd = processDate(addHours(eventStart.value, 1), 'default');

  describeConformance(<CalendarGrid.TimeEventResizeHandler side="start" />, () => ({
    refInstanceof: window.HTMLDivElement,
    render(node) {
      return render(
        <EventCalendarProvider events={[]}>
          <CalendarGrid.Root>
            <CalendarGrid.TimeColumn value={toPlainDate(eventStart.value.getTime(), 'default')}>
              <CalendarGrid.TimeEvent
                eventId="fake-id"
                occurrenceKey="fake-key"
                dataTimezone={undefined}
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
