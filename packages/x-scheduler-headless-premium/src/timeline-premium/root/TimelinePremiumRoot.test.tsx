import { TimelinePremium } from '@mui/x-scheduler-headless-premium/timeline-premium';
import { TimelinePremiumProvider } from '@mui/x-scheduler-headless-premium/timeline-premium-provider';
import { createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';

describe('<TimelinePremium.Root />', () => {
  const { render } = createSchedulerRenderer();

  describeConformance(<TimelinePremium.Root />, () => ({
    refInstanceof: window.HTMLDivElement,
    render(node) {
      return render(<TimelinePremiumProvider events={[]}>{node}</TimelinePremiumProvider>);
    },
  }));
});
