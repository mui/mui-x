import { TimelinePremium } from '@mui/x-scheduler-headless-premium/timeline-premium';
import { TimelinePremiumProvider } from '@mui/x-scheduler-headless-premium/timeline-premium-provider';
import { createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';

describe('<TimelinePremium.Row />', () => {
  const { render } = createSchedulerRenderer();

  describeConformance(<TimelinePremium.Row />, () => ({
    refInstanceof: window.HTMLDivElement,
    render(node) {
      return render(
        <TimelinePremiumProvider events={[]}>
          <TimelinePremium.Root>{node}</TimelinePremium.Root>
        </TimelinePremiumProvider>,
      );
    },
  }));
});
