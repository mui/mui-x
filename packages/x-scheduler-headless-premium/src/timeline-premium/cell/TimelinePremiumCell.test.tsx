import { Timeline } from '@mui/x-scheduler-headless-premium/timeline-premium';
import { createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';
import { TimelinePremiumProvider } from '@mui/x-scheduler-headless-premium/timeline-premium-provider';

describe('<TimelinePremium.Cell />', () => {
  const { render } = createSchedulerRenderer();

  describeConformance(<Timeline.Cell />, () => ({
    refInstanceof: window.HTMLDivElement,
    render(node) {
      return render(
        <TimelinePremiumProvider events={[]}>
          <Timeline.Root>
            <Timeline.Row>{node}</Timeline.Row>
          </Timeline.Root>
        </TimelinePremiumProvider>,
      );
    },
  }));
});
