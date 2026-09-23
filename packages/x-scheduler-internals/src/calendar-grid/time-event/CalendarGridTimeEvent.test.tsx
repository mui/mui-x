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
import type { TemporalSupportedObject } from '@mui/x-scheduler-internals/models';
import { describe, it, expect } from 'vitest';

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
      return renderEvent(
        <CalendarGrid.TimeEvent
          eventId="running"
          occurrenceKey="running"
          start={processDate(adapter.date(running.start as string, 'default'), adapter)}
          end={processDate(adapter.date(running.end as string, 'default'), adapter)}
          renderDragPreview={() => null}
          dataTimezone={undefined}
          data-testid="event"
          {...props}
        />,
        {
          events: [running],
          resources: [sport],
          columnStart: day,
          columnEnd: adapter.endOfDay(day),
        },
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

    it('should let a consumer aria-labelledby name the event', () => {
      renderRunning({
        'aria-labelledby': 'custom-label',
        children: <span id="custom-label">Custom label</span>,
      });
      expect(screen.getByRole('button', { name: 'Custom label' })).not.to.equal(null);
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
