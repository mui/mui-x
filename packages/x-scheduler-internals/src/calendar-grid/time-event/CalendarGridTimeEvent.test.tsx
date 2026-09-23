import { CalendarGrid } from '@mui/x-scheduler-internals/calendar-grid';
import { adapter, createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';
import { EventCalendarProvider } from '@mui/x-scheduler-internals/event-calendar-provider';
import { processDate } from '@mui/x-scheduler-internals/process-date';
import type { TemporalSupportedObject } from '@mui/x-scheduler-internals/models';
import { describe } from 'vitest';

describe('<CalendarGrid.TimeEvent />', () => {
  const { render } = createSchedulerRenderer();

  const eventStart = processDate(adapter.now('default'), adapter);
  const eventEnd = processDate(adapter.addHours(eventStart.value, 1), adapter);

  type ProviderProps = React.ComponentProps<typeof EventCalendarProvider>;

  // Mounts the event in the column context it needs.
  function renderEvent(
    node: React.ReactElement,
    options: Partial<Pick<ProviderProps, 'events' | 'resources'>> & {
      columnStart?: TemporalSupportedObject;
      columnEnd?: TemporalSupportedObject;
    } = {},
  ) {
    const {
      events = [],
      resources = [],
      columnStart = eventStart.value,
      columnEnd = eventEnd.value,
    } = options;
    return render(
      <EventCalendarProvider events={events} resources={resources}>
        <CalendarGrid.Root>
          <CalendarGrid.TimeColumn start={columnStart} end={columnEnd}>
            {node}
          </CalendarGrid.TimeColumn>
        </CalendarGrid.Root>
      </EventCalendarProvider>,
    );
  }

  describeConformance(
    <CalendarGrid.TimeEvent
      eventId="fake-id"
      occurrenceKey="fake-key"
      dataTimezone={undefined}
      start={eventStart}
      end={eventEnd}
      renderDragPreview={() => null}
    />,
    () => ({
      refInstanceof: window.HTMLDivElement,
      render(node) {
        return renderEvent(node);
      },
    }),
  );
});
