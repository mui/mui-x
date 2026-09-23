import { screen } from '@mui/internal-test-utils';
import { CalendarGrid } from '@mui/x-scheduler-internals/calendar-grid';
import { EventCalendarProvider } from '@mui/x-scheduler-internals/event-calendar-provider';
import {
  adapter,
  createSchedulerRenderer,
  describeConformance,
  EventBuilder,
  ResourceBuilder,
} from 'test/utils/scheduler';
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
  describe('accessible name', () => {
    const sport = ResourceBuilder.new().id('sport').title('Sport').build();
    const running = EventBuilder.new()
      .id('running')
      .title('Running')
      .startAt('2025-07-03T07:30:00')
      .endAt('2025-07-03T08:30:00')
      .resource(sport)
      .build();
    const rowStart = adapter.date('2025-06-30T00:00:00', 'default');
    const rowEnd = adapter.endOfDay(adapter.date('2025-07-06T00:00:00', 'default'));

    function renderRunning(
      props: Partial<React.ComponentProps<typeof CalendarGrid.DayEvent>> = {},
    ) {
      return render(
        <EventCalendarProvider events={[running]} resources={[sport]}>
          <CalendarGrid.Root>
            <CalendarGrid.DayRow start={rowStart} end={rowEnd}>
              <CalendarGrid.DayCell value={rowStart}>
                <CalendarGrid.DayEvent
                  eventId="running"
                  occurrenceKey="running"
                  start={processDate(adapter.date(running.start as string, 'default'), adapter)}
                  end={processDate(adapter.date(running.end as string, 'default'), adapter)}
                  renderDragPreview={() => null}
                  data-testid="event"
                  {...props}
                />
              </CalendarGrid.DayCell>
            </CalendarGrid.DayRow>
          </CalendarGrid.Root>
        </EventCalendarProvider>,
      );
    }

    it('should name the event with its title, time range, date and resource', () => {
      renderRunning();
      expect(
        screen.getByRole('button', {
          name: 'Running, 7:30 AM to 8:30 AM, Thursday 3 July, Resource: Sport',
        }),
      ).not.to.equal(null);
    });

    it('should let a consumer aria-label win over the default name', () => {
      renderRunning({ 'aria-label': 'Custom' });
      expect(screen.getByRole('button', { name: 'Custom' })).not.to.equal(null);
    });

    it('should not add a default name when the consumer passes aria-labelledby', () => {
      renderRunning({ 'aria-labelledby': 'some-id' });
      expect(screen.getByTestId('event')).not.to.have.attribute('aria-label');
    });
  });
});
