import { Timeline } from '@mui/x-scheduler-headless/timeline';
import { TimelineProvider } from '@mui/x-scheduler-headless/timeline-provider';
import { adapter, createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';
import { processDate } from '@mui/x-scheduler-headless/process-date';

describe('<Timeline.EventResizeHandler />', () => {
  const { render } = createSchedulerRenderer();

  const start = processDate(adapter.startOfDay(adapter.now('default')), adapter);
  const end = processDate(adapter.endOfDay(adapter.now('default')), adapter);

  describeConformance(<Timeline.EventResizeHandler side="start" />, () => ({
    refInstanceof: window.HTMLDivElement,
    render(node) {
      return render(
        <TimelineProvider events={[]}>
          <Timeline.Root>
            <Timeline.EventRow resourceId="r1">
              {() => (
                <Timeline.Event
                  eventId="fake-id"
                  occurrenceKey="fake-key"
                  start={start}
                  end={end}
                  renderDragPreview={() => null}
                >
                  {node}
                </Timeline.Event>
              )}
            </Timeline.EventRow>
          </Timeline.Root>
        </TimelineProvider>,
      );
    },
  }));
});
