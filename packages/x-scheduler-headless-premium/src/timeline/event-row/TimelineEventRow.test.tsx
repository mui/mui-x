import { Timeline } from '@mui/x-scheduler-headless-premium/timeline';
import { TimelineProvider } from '@mui/x-scheduler-headless-premium/timeline-provider';
import { createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';

describe('<Timeline.EventRow />', () => {
  const { render } = createSchedulerRenderer();

  describeConformance(<Timeline.EventRow resourceId="r1">{() => null}</Timeline.EventRow>, () => ({
    refInstanceof: window.HTMLDivElement,
    render(node) {
      return render(
        <TimelineProvider events={[]}>
          <Timeline.Root>{node}</Timeline.Root>
        </TimelineProvider>,
      );
    },
  }));
});
