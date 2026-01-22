import { TimelinePremium } from '@mui/x-scheduler-headless-premium/timeline-premium';
import { createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';
import { TimelinePremiumProvider } from '@mui/x-scheduler-headless-premium/timeline-premium-provider';

describe('<TimelinePremium.Cell />', () => {
  const { render } = createSchedulerRenderer();

  describeConformance(<TimelinePremium.Cell />, () => ({
    refInstanceof: window.HTMLDivElement,
    render(node) {
      return render(
        <TimelinePremiumProvider events={[]}>
          <TimelinePremium.Root>
            <TimelinePremium.Row>{node}</TimelinePremium.Row>
          </TimelinePremium.Root>
        </TimelinePremiumProvider>,
      );
    },
  }));
});
