import { Timeline } from '@mui/x-scheduler-headless/timeline';
import { TimelineProvider } from '@mui/x-scheduler-headless/timeline-provider';
import { adapter, createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';

describe('<Timeline.Event />', () => {
  const { render } = createSchedulerRenderer();

  const start = adapter.startOfDay(adapter.date());
  const end = adapter.endOfDay(adapter.date());

  describeConformance(<Timeline.Event start={start} end={end} />, () => ({
    refInstanceof: window.HTMLDivElement,
    render(node) {
      return render(
        <TimelineProvider events={[]}>
          <Timeline.Root items={[]}>
            <Timeline.EventRow start={start} end={end}>
              <Timeline.Event start={start} end={end}>
                {node}
              </Timeline.Event>
            </Timeline.EventRow>
          </Timeline.Root>
        </TimelineProvider>,
      );
    },
  }));
});
