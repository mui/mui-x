import { screen } from '@mui/internal-test-utils';
import { TimelineGrid } from '@mui/x-scheduler-internals-premium/timeline-grid';
import { EventTimelinePremiumProvider } from '@mui/x-scheduler-internals-premium/event-timeline-premium-provider';
import {
  adapter,
  createSchedulerRenderer,
  describeConformance,
  EventBuilder,
  ResourceBuilder,
} from 'test/utils/scheduler';
import { processDate } from '@mui/x-scheduler-internals/process-date';
import { describe, it, expect } from 'vitest';

describe('<TimelineGrid.Event />', () => {
  const { render } = createSchedulerRenderer();

  const start = processDate(adapter.startOfDay(adapter.now('default')), adapter);
  const end = processDate(adapter.endOfDay(adapter.now('default')), adapter);

  type ProviderProps = React.ComponentProps<typeof EventTimelinePremiumProvider>;

  // Mounts the event in the row context it needs. `resourceId` is the row it renders in.
  function renderEvent(
    node: React.ReactElement,
    options: Partial<Pick<ProviderProps, 'events' | 'resources'>> & { resourceId?: string } = {},
  ) {
    const { events = [], resources = [ResourceBuilder.new().build()], resourceId = 'r1' } = options;
    return render(
      <EventTimelinePremiumProvider events={events} resources={resources}>
        <TimelineGrid.Root>
          <TimelineGrid.BodyRow index={0}>
            <TimelineGrid.EventRow resourceId={resourceId}>{() => node}</TimelineGrid.EventRow>
          </TimelineGrid.BodyRow>
        </TimelineGrid.Root>
      </EventTimelinePremiumProvider>,
    );
  }

  describeConformance(
    <TimelineGrid.Event
      eventId="fake-id"
      occurrenceKey="fake-key"
      dataTimezone={undefined}
      start={start}
      end={end}
      renderDragPreview={() => null}
    />,
    () => ({
      refInstanceof: window.HTMLDivElement,
      render(node) {
        return renderEvent(node);
      },
    }),
  );

  it('should use a precomputed timeline position', () => {
    renderEvent(
      <TimelineGrid.Event
        eventId="fake-id"
        occurrenceKey="fake-key"
        dataTimezone={undefined}
        start={start}
        end={end}
        elementPosition={{
          position: 0.25,
          duration: 0.5,
          startingBeforeEdge: true,
          endingAfterEdge: false,
        }}
        renderDragPreview={() => null}
        data-testid="event"
      />,
    );

    const event = screen.getByTestId('event');
    expect(event.style.getPropertyValue('--x-position')).to.equal('25%');
    expect(event.style.getPropertyValue('--width')).to.equal('50%');
    expect(event).to.have.attribute('data-starting-before-edge');
    expect(event).not.to.have.attribute('data-ending-after-edge');
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

    function renderRunning(
      props: Partial<React.ComponentProps<typeof TimelineGrid.Event>> = {},
      options: Parameters<typeof renderEvent>[1] = {
        events: [running],
        resources: [sport],
        resourceId: 'sport',
      },
    ) {
      return renderEvent(
        <TimelineGrid.Event
          eventId="running"
          occurrenceKey="running"
          start={processDate(adapter.date(running.start as string, 'default'), adapter)}
          end={processDate(adapter.date(running.end as string, 'default'), adapter)}
          renderDragPreview={() => null}
          dataTimezone={undefined}
          data-testid="event"
          {...props}
        />,
        options,
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

    it('should announce the resource of the row for a multi-resource event', () => {
      const work = ResourceBuilder.new().id('work').title('Work').build();
      const shared = EventBuilder.new()
        .id('shared')
        .title('Shared')
        .startAt('2025-07-03T07:30:00')
        .endAt('2025-07-03T08:30:00')
        .resources([sport, work])
        .build();

      renderRunning(
        { eventId: 'shared', occurrenceKey: 'shared' },
        { events: [shared], resources: [sport, work], resourceId: 'work' },
      );

      expect(
        screen.getByRole('button', {
          name: 'Shared, 7:30 AM to 8:30 AM, Thursday, July 3rd, 2025, Resource: Work',
        }),
      ).not.to.equal(null);
    });
  });
});
