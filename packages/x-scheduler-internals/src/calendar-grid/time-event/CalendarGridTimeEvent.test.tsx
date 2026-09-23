import { CalendarGrid } from '@mui/x-scheduler-internals/calendar-grid';
import { screen } from '@mui/internal-test-utils';
import {
  adapter,
  createSchedulerRenderer,
  describeConformance,
  EventBuilder,
  ResourceBuilder,
} from 'test/utils/scheduler';
import { EventCalendarProvider } from '@mui/x-scheduler-internals/event-calendar-provider';
import { processDate } from '@mui/x-scheduler-internals/process-date';
import { describe, it, expect } from 'vitest';

describe('<CalendarGrid.TimeEvent />', () => {
  const { render } = createSchedulerRenderer();

  const eventStart = processDate(adapter.now('default'), adapter);
  const eventEnd = processDate(adapter.addHours(eventStart.value, 1), adapter);

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
        return render(
          <EventCalendarProvider events={[]}>
            <CalendarGrid.Root>
              <CalendarGrid.TimeColumn start={eventStart.value} end={eventEnd.value}>
                {node}
              </CalendarGrid.TimeColumn>
            </CalendarGrid.Root>
          </EventCalendarProvider>,
        );
      },
    }),
  );
  describe('accessible name', () => {
    const sport = ResourceBuilder.new().id('sport').title('Sport').build();
    const running = EventBuilder.new()
      .id('running')
      .title('Running')
      .startAt('2025-07-03T07:30:00')
      .endAt('2025-07-03T08:30:00')
      .resource(sport)
      .build();
    const day = adapter.date('2025-07-03T00:00:00', 'default');

    function renderRunning(
      props: Partial<React.ComponentProps<typeof CalendarGrid.TimeEvent>> = {},
    ) {
      return render(
        <EventCalendarProvider events={[running]} resources={[sport]}>
          <CalendarGrid.Root>
            <CalendarGrid.TimeColumn start={day} end={adapter.endOfDay(day)}>
              <CalendarGrid.TimeEvent
                eventId="running"
                occurrenceKey="running"
                start={processDate(adapter.date(running.start as string, 'default'), adapter)}
                end={processDate(adapter.date(running.end as string, 'default'), adapter)}
                renderDragPreview={() => null}
                dataTimezone={undefined}
                data-testid="event"
                {...props}
              />
            </CalendarGrid.TimeColumn>
          </CalendarGrid.Root>
        </EventCalendarProvider>,
      );
    }

    it('should name the event with its title, time range, date and resource', () => {
      renderRunning();
      expect(
        screen.getByRole('button', {
          name: 'Running, 7:30 AM to 8:30 AM, Thursday, July 3rd, 2025, Resource: Sport',
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

    it('should fall back to the default name when the consumer passes an empty aria-label', () => {
      renderRunning({ 'aria-label': '' });
      expect(
        screen.getByRole('button', {
          name: 'Running, 7:30 AM to 8:30 AM, Thursday, July 3rd, 2025, Resource: Sport',
        }),
      ).not.to.equal(null);
    });

    it('should not name a non-interactive event', () => {
      renderRunning({ interactive: false });
      expect(screen.getByTestId('event')).not.to.have.attribute('aria-label');
    });
  });
});
