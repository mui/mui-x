import { screen } from '@mui/internal-test-utils';
import { CalendarGrid } from '@mui/x-scheduler-internals/calendar-grid';
import { EventCalendarProvider } from '@mui/x-scheduler-internals/event-calendar-provider';
import {
  addHours,
  createDate,
  createSchedulerRenderer,
  describeConformance,
  endOfDay,
} from 'test/utils/scheduler';
import { processDate } from '@mui/x-scheduler-internals/process-date';
import type { TemporalSupportedObject } from '@mui/x-scheduler-internals/models';
import { describe, it, expect } from 'vitest';
import { toPlainDate } from '../../internals/utils/plain-date-utils/timeZone';

describe('<CalendarGrid.DayEvent />', () => {
  const { render } = createSchedulerRenderer();

  const eventStart = processDate(new Date(), 'default');
  const eventEnd = processDate(addHours(eventStart.value, 1), 'default');

  type ProviderProps = React.ComponentProps<typeof EventCalendarProvider>;

  // Mounts the event in the row and cell contexts it needs. The cell is the first day of the row.
  function renderEvent(
    node: React.ReactElement,
    options: Partial<Pick<ProviderProps, 'events' | 'resources'>> & {
      rowStart?: TemporalSupportedObject;
      rowEnd?: TemporalSupportedObject;
    } = {},
  ) {
    const {
      events = [],
      resources = [],
      rowStart = eventStart.value,
      rowEnd = eventEnd.value,
    } = options;
    const cellDate = toPlainDate(rowStart.getTime(), 'default');
    return render(
      <EventCalendarProvider events={events} resources={resources}>
        <CalendarGrid.Root>
          <CalendarGrid.DayRow
            start={rowStart.getTime()}
            end={rowEnd.getTime()}
            days={[{ plainDate: cellDate }]}
          >
            <CalendarGrid.DayCell value={cellDate}>{node}</CalendarGrid.DayCell>
          </CalendarGrid.DayRow>
        </CalendarGrid.Root>
      </EventCalendarProvider>,
    );
  }

  describeConformance(
    <CalendarGrid.DayEvent
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

  describe('edge flags', () => {
    // Week row Jul 7 → Jul 13 2025.
    const rowStart = createDate('2025-07-07T00:00:00Z');
    const rowEnd = endOfDay(createDate('2025-07-13T00:00:00Z'));

    function renderDayEvent(start: string, end: string) {
      return renderEvent(
        <CalendarGrid.DayEvent
          eventId="fake-id"
          occurrenceKey="fake-key"
          dataTimezone={undefined}
          start={processDate(createDate(start), 'default')}
          end={processDate(createDate(end), 'default')}
          renderDragPreview={() => null}
          data-testid="event"
        />,
        { rowStart, rowEnd },
      );
    }

    it('should not flag an event ending exactly at midnight after the row as continuing', () => {
      // The rendered right edge is the real end: nothing is hidden behind it, so a
      // continuation arrow would lie and the end resize handle is safe to expose.
      renderDayEvent('2025-07-12T20:00:00Z', '2025-07-14T00:00:00Z');
      expect(screen.getByTestId('event')).not.to.have.attribute('data-ending-after-edge');
    });

    it('should flag an event continuing into the next row', () => {
      renderDayEvent('2025-07-12T20:00:00Z', '2025-07-14T10:00:00Z');
      expect(screen.getByTestId('event')).to.have.attribute('data-ending-after-edge');
    });
  });

  it('should leave the accessible name to the consumer', () => {
    renderEvent(
      <CalendarGrid.DayEvent
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
