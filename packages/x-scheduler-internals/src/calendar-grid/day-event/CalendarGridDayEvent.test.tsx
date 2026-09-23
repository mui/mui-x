import { screen } from '@mui/internal-test-utils';
import { CalendarGrid } from '@mui/x-scheduler-internals/calendar-grid';
import { EventCalendarProvider } from '@mui/x-scheduler-internals/event-calendar-provider';
import { adapter, createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';
import { processDate } from '@mui/x-scheduler-internals/process-date';
import { describe, it, expect } from 'vitest';

describe('<CalendarGrid.DayEvent />', () => {
  const { render } = createSchedulerRenderer();

  const eventStart = processDate(adapter.now('default'), adapter);
  const eventEnd = processDate(adapter.addHours(eventStart.value, 1), adapter);

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
        return render(
          <EventCalendarProvider events={[]}>
            <CalendarGrid.Root>
              <CalendarGrid.DayRow start={eventStart.value} end={eventEnd.value}>
                <CalendarGrid.DayCell value={eventStart.value}>{node}</CalendarGrid.DayCell>
              </CalendarGrid.DayRow>
            </CalendarGrid.Root>
          </EventCalendarProvider>,
        );
      },
    }),
  );

  describe('edge flags', () => {
    // Week row Jul 7 → Jul 13 2025.
    const rowStart = adapter.date('2025-07-07T00:00:00Z', 'default');
    const rowEnd = adapter.endOfDay(adapter.date('2025-07-13T00:00:00Z', 'default'));

    function renderDayEvent(start: string, end: string) {
      return render(
        <EventCalendarProvider events={[]}>
          <CalendarGrid.Root>
            <CalendarGrid.DayRow start={rowStart} end={rowEnd}>
              <CalendarGrid.DayCell value={rowStart}>
                <CalendarGrid.DayEvent
                  eventId="fake-id"
                  occurrenceKey="fake-key"
                  dataTimezone={undefined}
                  start={processDate(adapter.date(start, 'default'), adapter)}
                  end={processDate(adapter.date(end, 'default'), adapter)}
                  renderDragPreview={() => null}
                  data-testid="event"
                />
              </CalendarGrid.DayCell>
            </CalendarGrid.DayRow>
          </CalendarGrid.Root>
        </EventCalendarProvider>,
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
});
