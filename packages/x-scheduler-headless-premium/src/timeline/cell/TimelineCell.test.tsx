import { Timeline } from '@mui/x-scheduler-headless-premium/timeline';
import { createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';
import { TimelineProvider } from '@mui/x-scheduler-headless-premium/timeline-provider';

describe('<Timeline.Cell />', () => {
  const { render } = createSchedulerRenderer();

  describeConformance(<Timeline.Cell />, () => ({
    refInstanceof: window.HTMLDivElement,
    render(node) {
      return render(
        <TimelineProvider events={[]}>
          <Timeline.Root>
            <Timeline.Row>{node}</Timeline.Row>
          </Timeline.Root>
        </TimelineProvider>,
      );
    },
  }));
});
