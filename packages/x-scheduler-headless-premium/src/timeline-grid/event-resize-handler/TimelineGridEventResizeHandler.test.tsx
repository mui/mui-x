import { TimelineGrid } from '@mui/x-scheduler-headless-premium/timeline-grid';
import { EventTimelinePremiumProvider } from '@mui/x-scheduler-headless-premium/event-timeline-premium-provider';
import { adapter, createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';
import { processDate } from '@mui/x-scheduler-headless/process-date';

describe('<TimelineGrid.EventResizeHandler />', () => {
  const { render } = createSchedulerRenderer();

  const start = processDate(adapter.startOfDay(adapter.now('default')), adapter);
  const end = processDate(adapter.endOfDay(adapter.now('default')), adapter);

  describeConformance(<TimelineGrid.EventResizeHandler side="start" />, () => ({
    refInstanceof: window.HTMLDivElement,
    render(node) {
      return render(
        <EventTimelinePremiumProvider events={[]}>
          <TimelineGrid.Root>
            <TimelineGrid.EventRow resourceId="r1">
              {() => (
                <TimelineGrid.Event
                  eventId="fake-id"
                  occurrenceKey="fake-key"
                  start={start}
                  end={end}
                  renderDragPreview={() => null}
                >
                  {node}
                </TimelineGrid.Event>
              )}
            </TimelineGrid.EventRow>
          </TimelineGrid.Root>
        </EventTimelinePremiumProvider>,
      );
    },
  }));
});
