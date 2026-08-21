import { screen } from '@mui/internal-test-utils';
import { TimelineGrid } from '@mui/x-scheduler-internals-premium/timeline-grid';
import { EventTimelinePremiumProvider } from '@mui/x-scheduler-internals-premium/event-timeline-premium-provider';
import {
  adapter,
  createSchedulerRenderer,
  describeConformance,
  ResourceBuilder,
} from 'test/utils/scheduler';
import { processDate } from '@mui/x-scheduler-internals/process-date';

describe('<TimelineGrid.Event />', () => {
  const { render } = createSchedulerRenderer();

  const start = processDate(adapter.startOfDay(adapter.now('default')), adapter);
  const end = processDate(adapter.endOfDay(adapter.now('default')), adapter);

  describeConformance(
    <TimelineGrid.Event
      eventId="fake-id"
      occurrenceKey="fake-key"
      start={start}
      end={end}
      renderDragPreview={() => null}
    />,
    () => ({
      refInstanceof: window.HTMLDivElement,
      render(node) {
        return render(
          <EventTimelinePremiumProvider events={[]} resources={[ResourceBuilder.new().build()]}>
            <TimelineGrid.Root>
              <TimelineGrid.BodyRow index={0}>
                <TimelineGrid.EventRow resourceId="r1">{() => node}</TimelineGrid.EventRow>
              </TimelineGrid.BodyRow>
            </TimelineGrid.Root>
          </EventTimelinePremiumProvider>,
        );
      },
    }),
  );

  it('should use a precomputed timeline position', () => {
    render(
      <EventTimelinePremiumProvider events={[]} resources={[ResourceBuilder.new().build()]}>
        <TimelineGrid.Root>
          <TimelineGrid.BodyRow index={0}>
            <TimelineGrid.EventRow resourceId="r1">
              {() => (
                <TimelineGrid.Event
                  eventId="fake-id"
                  occurrenceKey="fake-key"
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
                />
              )}
            </TimelineGrid.EventRow>
          </TimelineGrid.BodyRow>
        </TimelineGrid.Root>
      </EventTimelinePremiumProvider>,
    );

    const event = screen.getByTestId('event');
    expect(event.style.getPropertyValue('--x-position')).to.equal('25%');
    expect(event.style.getPropertyValue('--width')).to.equal('50%');
    expect(event).to.have.attribute('data-starting-before-edge');
    expect(event).not.to.have.attribute('data-ending-after-edge');
  });
});
