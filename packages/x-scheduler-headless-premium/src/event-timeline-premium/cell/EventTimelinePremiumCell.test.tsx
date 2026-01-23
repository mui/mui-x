import { EventTimelinePremium } from '@mui/x-scheduler-headless-premium/event-timeline-premium';
import { createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';
import { EventTimelinePremiumProvider } from '@mui/x-scheduler-headless-premium/event-timeline-premium-provider';

describe('<EventTimelinePremium.Cell />', () => {
  const { render } = createSchedulerRenderer();

  describeConformance(<EventTimelinePremium.Cell />, () => ({
    refInstanceof: window.HTMLDivElement,
    render(node) {
      return render(
        <EventTimelinePremiumProvider events={[]}>
          <EventTimelinePremium.Root>
            <EventTimelinePremium.Row>{node}</EventTimelinePremium.Row>
          </EventTimelinePremium.Root>
        </EventTimelinePremiumProvider>,
      );
    },
  }));
});
