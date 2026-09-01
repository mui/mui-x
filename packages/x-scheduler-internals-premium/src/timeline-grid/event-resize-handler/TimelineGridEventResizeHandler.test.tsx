import { screen } from '@mui/internal-test-utils';
import { TimelineGrid } from '@mui/x-scheduler-internals-premium/timeline-grid';
import { EventTimelinePremiumProvider } from '@mui/x-scheduler-internals-premium/event-timeline-premium-provider';
import {
  adapter,
  createSchedulerRenderer,
  describeConformance,
  DEFAULT_TESTING_VISIBLE_DATE,
  ResourceBuilder,
} from 'test/utils/scheduler';
import { processDate } from '@mui/x-scheduler-internals/process-date';
import { describe, it, expect } from 'vitest';

describe('<TimelineGrid.EventResizeHandler />', () => {
  const { render } = createSchedulerRenderer();

  const start = processDate(adapter.startOfDay(adapter.now('default')), adapter);
  const end = processDate(adapter.endOfDay(adapter.now('default')), adapter);

  describeConformance(<TimelineGrid.EventResizeHandler side="start" />, () => ({
    refInstanceof: window.HTMLDivElement,
    render(node) {
      return render(
        <EventTimelinePremiumProvider events={[]} resources={[ResourceBuilder.new().build()]}>
          <TimelineGrid.Root>
            <TimelineGrid.BodyRow index={0}>
              <TimelineGrid.EventRow resourceId="r1">
                {() => (
                  <TimelineGrid.Event
                    eventId="fake-id"
                    occurrenceKey="fake-key"
                    dataBounds={undefined}
                    start={start}
                    end={end}
                    renderDragPreview={() => null}
                  >
                    {node}
                  </TimelineGrid.Event>
                )}
              </TimelineGrid.EventRow>
            </TimelineGrid.BodyRow>
          </TimelineGrid.Root>
        </EventTimelinePremiumProvider>,
      );
    },
  }));

  describe('clipped bound gating', () => {
    // dayAndHour collection: Jul 3 → Jul 6 2025.
    const at = (hours: number) => adapter.addHours(DEFAULT_TESTING_VISIBLE_DATE, hours);

    function renderEvent(eventStart: ReturnType<typeof at>, eventEnd: ReturnType<typeof at>) {
      return render(
        <EventTimelinePremiumProvider
          events={[]}
          resources={[ResourceBuilder.new().id('r1').build()]}
          visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
        >
          <TimelineGrid.Root>
            <TimelineGrid.BodyRow index={0}>
              <TimelineGrid.EventRow resourceId="r1">
                {() => (
                  <TimelineGrid.Event
                    eventId="fake-id"
                    occurrenceKey="fake-key"
                    dataBounds={undefined}
                    start={processDate(eventStart, adapter)}
                    end={processDate(eventEnd, adapter)}
                    renderDragPreview={() => null}
                  >
                    <TimelineGrid.EventResizeHandler side="end" data-testid="resize-end" />
                  </TimelineGrid.Event>
                )}
              </TimelineGrid.EventRow>
            </TimelineGrid.BodyRow>
          </TimelineGrid.Root>
        </EventTimelinePremiumProvider>,
      );
    }

    it('should keep the end resize handle for an event ending exactly at midnight after the collection', () => {
      // Jul 7 00:00 renders exactly on the collection's right edge: the rendered edge
      // is the real end, so resizing from it reconstructs the correct dates.
      renderEvent(at(3 * 24 + 22), at(4 * 24));
      expect(screen.getByTestId('resize-end')).not.to.equal(null);
    });

    it('should hide the end resize handle for an event continuing past the collection', () => {
      renderEvent(at(3 * 24 + 22), at(4 * 24 + 10));
      expect(screen.queryByTestId('resize-end')).to.equal(null);
    });
  });
});
