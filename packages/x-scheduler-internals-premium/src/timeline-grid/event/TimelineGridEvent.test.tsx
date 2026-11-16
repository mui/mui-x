import { screen } from '@mui/internal-test-utils';
import { TimelineGrid } from '@mui/x-scheduler-internals-premium/timeline-grid';
import { EventTimelinePremiumProvider } from '@mui/x-scheduler-internals-premium/event-timeline-premium-provider';
import {
  createSchedulerRenderer,
  describeConformance,
  endOfDay,
  ResourceBuilder,
  startOfDay,
} from 'test/utils/scheduler';
import { createProcessedDate } from '@mui/x-scheduler-internals/process-date';
import { describe, it, expect } from 'vitest';

describe('<TimelineGrid.Event />', () => {
  const { render } = createSchedulerRenderer();

  const start = createProcessedDate(startOfDay(new Date()).getTime(), 'default');
  const end = createProcessedDate(endOfDay(new Date()).getTime(), 'default');

  // Mounts the event in the row context it needs.
  function renderEvent(node: React.ReactElement) {
    return render(
      <EventTimelinePremiumProvider events={[]} resources={[ResourceBuilder.new().build()]}>
        <TimelineGrid.Root>
          <TimelineGrid.BodyRow index={0}>
            <TimelineGrid.EventRow resourceId="r1">{() => node}</TimelineGrid.EventRow>
          </TimelineGrid.BodyRow>
        </TimelineGrid.Root>
      </EventTimelinePremiumProvider>,
    );
  }

  describeConformance(
    <TimelineGrid.Event
      eventId="fake-id"
      occurrenceKey="fake-key"
      internalInfos={undefined}
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
        internalInfos={undefined}
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

  it('should leave the accessible name to the consumer', () => {
    renderEvent(
      <TimelineGrid.Event
        eventId="fake-id"
        occurrenceKey="fake-key"
        internalInfos={undefined}
        start={start}
        end={end}
        renderDragPreview={() => null}
        data-testid="event"
      />,
    );

    const event = screen.getByTestId('event');
    expect(event).not.to.have.attribute('aria-label');
    expect(event).not.to.have.attribute('aria-labelledby');
  });
});
