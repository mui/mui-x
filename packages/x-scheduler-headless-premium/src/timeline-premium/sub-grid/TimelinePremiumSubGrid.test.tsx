import { Timeline } from '@mui/x-scheduler-headless-premium/timeline-premium';
import { TimelinePremiumProvider } from '@mui/x-scheduler-headless-premium/timeline-premium-provider';
import { createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';

describe('<Timeline.SubGrid />', () => {
  const { render } = createSchedulerRenderer();

  describeConformance(<Timeline.SubGrid />, () => ({
    refInstanceof: window.HTMLDivElement,
    render(node) {
      return render(
        <TimelinePremiumProvider events={[]}>
          <Timeline.Root>{node}</Timeline.Root>
        </TimelinePremiumProvider>,
      );
    },
  }));
});
