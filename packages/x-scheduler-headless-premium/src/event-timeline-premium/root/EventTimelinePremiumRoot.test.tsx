import { EventTimelinePremium } from '@mui/x-scheduler-headless-premium/event-timeline-premium';
import { EventTimelinePremiumProvider } from '@mui/x-scheduler-headless-premium/event-timeline-premium-provider';
import { createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';

describe('<EventTimelinePremium.Root />', () => {
  const { render } = createSchedulerRenderer();

  describeConformance(<EventTimelinePremium.Root />, () => ({
    refInstanceof: window.HTMLDivElement,
    render(node) {
      return render(
        <EventTimelinePremiumProvider events={[]}>{node}</EventTimelinePremiumProvider>,
      );
    },
  }));
});
