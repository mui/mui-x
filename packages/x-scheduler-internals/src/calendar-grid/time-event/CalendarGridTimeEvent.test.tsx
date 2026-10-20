import { screen } from '@mui/internal-test-utils';
import { CalendarGrid } from '@mui/x-scheduler-internals/calendar-grid';
import { adapter, createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';
import { EventCalendarProvider } from '@mui/x-scheduler-internals/event-calendar-provider';
import { processDate } from '@mui/x-scheduler-internals/process-date';
import { describe, it, expect } from 'vitest';

describe('<CalendarGrid.TimeEvent />', () => {
  const { render } = createSchedulerRenderer();

  const eventStart = processDate(adapter.now('default'), adapter);
  const eventEnd = processDate(adapter.addHours(eventStart.value, 1), adapter);

  // Mounts the event in the column context it needs.
  function renderEvent(node: React.ReactElement) {
    return render(
      <EventCalendarProvider events={[]}>
        <CalendarGrid.Root>
          <CalendarGrid.TimeColumn start={eventStart.value} end={eventEnd.value}>
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

  it('should use a precomputed position', () => {
    renderEvent(
      <CalendarGrid.TimeEvent
        eventId="fake-id"
        occurrenceKey="fake-key"
        dataTimezone={undefined}
        start={eventStart}
        end={eventEnd}
        elementPosition={{
          position: 0.25,
          duration: 0.5,
          startingBeforeEdge: true,
          endingAfterEdge: false,
        }}
        renderDragPreview={() => null}
        data-testid="event"
      >
        <CalendarGrid.TimeEventResizeHandler side="start" data-testid="start-handle" />
        <CalendarGrid.TimeEventResizeHandler side="end" data-testid="end-handle" />
      </CalendarGrid.TimeEvent>,
    );

    const event = screen.getByTestId('event');
    expect(event.style.getPropertyValue('--y-position')).to.equal('25%');
    expect(event.style.getPropertyValue('--height')).to.equal('50%');
    expect(screen.queryByTestId('start-handle')).to.equal(null);
    expect(screen.queryByTestId('end-handle')).not.to.equal(null);
  });

  it('should leave the accessible name to the consumer', () => {
    renderEvent(
      <CalendarGrid.TimeEvent
        eventId="fake-id"
        occurrenceKey="fake-key"
        dataTimezone={undefined}
        start={eventStart}
        end={eventEnd}
        renderDragPreview={() => null}
        data-testid="event"
      />,
    );

    const event = screen.getByTestId('event');
    expect(event).not.to.have.attribute('aria-label');
    expect(event).not.to.have.attribute('aria-labelledby');
  });
});
