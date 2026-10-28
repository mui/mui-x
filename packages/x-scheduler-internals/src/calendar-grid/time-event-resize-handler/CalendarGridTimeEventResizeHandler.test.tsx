import { CalendarGrid } from '@mui/x-scheduler-internals/calendar-grid';
import { adapter, createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';
import { EventCalendarProvider } from '@mui/x-scheduler-internals/event-calendar-provider';
import { processDate } from '@mui/x-scheduler-internals/process-date';
import { describe } from 'vitest';
import { buildTemporalPlainDate } from '@mui/x-scheduler-internals/internals';

describe('<CalendarGrid.TimeEventResizeHandler />', () => {
  const { render } = createSchedulerRenderer();

  const eventStart = processDate(adapter.now('default'), adapter, 'default');
  const eventEnd = processDate(adapter.addHours(eventStart.value, 1), adapter, 'default');

  describeConformance(<CalendarGrid.TimeEventResizeHandler side="start" />, () => ({
    refInstanceof: window.HTMLDivElement,
    render(node) {
      return render(
        <EventCalendarProvider events={[]}>
          <CalendarGrid.Root>
            <CalendarGrid.TimeColumn
              value={buildTemporalPlainDate(adapter, eventStart.value, 'default')}
            >
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
