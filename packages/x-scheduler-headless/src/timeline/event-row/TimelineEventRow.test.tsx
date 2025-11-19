import { Timeline } from '@mui/x-scheduler-headless/timeline';
import { TimelineProvider } from '@mui/x-scheduler-headless/timeline-provider';
import { adapter, createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';

describe('<Timeline.EventRow />', () => {
  const { render } = createSchedulerRenderer();

  const start = adapter.startOfDay(adapter.now('default'));
  const end = adapter.endOfDay(adapter.now('default'));

  describeConformance(<Timeline.EventRow start={start} end={end} resourceId={null} />, () => ({
    refInstanceof: window.HTMLDivElement,
    render(node) {
      return render(
        <TimelineProvider events={[]}>
          <Timeline.Root items={[]}>{node}</Timeline.Root>
        </TimelineProvider>,
      );
    },
  }));
});
