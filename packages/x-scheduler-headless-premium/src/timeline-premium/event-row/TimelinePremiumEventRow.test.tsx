import { TimelinePremium } from '@mui/x-scheduler-headless-premium/timeline-premium';
import { TimelinePremiumProvider } from '@mui/x-scheduler-headless-premium/timeline-premium-provider';
import { createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';

describe('<TimelinePremium.EventRow />', () => {
  const { render } = createSchedulerRenderer();

  describeConformance(
    <TimelinePremium.EventRow resourceId="r1">{() => null}</TimelinePremium.EventRow>,
    () => ({
      refInstanceof: window.HTMLDivElement,
      render(node) {
        return render(
          <TimelinePremiumProvider events={[]}>
            <TimelinePremium.Root>{node}</TimelinePremium.Root>
          </TimelinePremiumProvider>,
        );
      },
    }),
  );
});
