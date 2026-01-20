import { Timeline } from '@mui/x-scheduler-headless/timeline';
import { TimelineProvider } from '@mui/x-scheduler-headless/timeline-provider';
import { createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';

describe('<Timeline.SubGrid />', () => {
  const { render } = createSchedulerRenderer();

  describeConformance(<Timeline.SubGrid />, () => ({
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
