import { EventTimelinePremium } from '@mui/x-scheduler-headless-premium/event-timeline-premium';
import { EventTimelinePremiumProvider } from '@mui/x-scheduler-headless-premium/event-timeline-premium-provider';
import { createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';

describe('<EventTimelinePremium.SubGrid />', () => {
  const { render } = createSchedulerRenderer();

  describeConformance(<EventTimelinePremium.SubGrid />, () => ({
    refInstanceof: window.HTMLDivElement,
    render(node) {
      return render(
        <EventTimelinePremiumProvider events={[]}>
          <EventTimelinePremium.Root>{node}</EventTimelinePremium.Root>
        </EventTimelinePremiumProvider>,
      );
    },
  }));
});
