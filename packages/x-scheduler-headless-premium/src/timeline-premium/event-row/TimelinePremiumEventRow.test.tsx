import { Timeline } from '@mui/x-scheduler-headless-premium/timeline-premium';
import { TimelinePremiumProvider } from '@mui/x-scheduler-headless-premium/timeline-premium-provider';
import { createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';

describe('<Timeline.EventRow />', () => {
  const { render } = createSchedulerRenderer();

  describeConformance(<Timeline.EventRow resourceId="r1">{() => null}</Timeline.EventRow>, () => ({
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
