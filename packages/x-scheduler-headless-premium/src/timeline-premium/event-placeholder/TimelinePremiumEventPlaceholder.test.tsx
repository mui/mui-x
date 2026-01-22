import { TimelinePremium } from '@mui/x-scheduler-headless-premium/timeline-premium';
import { TimelinePremiumProvider } from '@mui/x-scheduler-headless-premium/timeline-premium-provider';
import { adapter, createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';
import { processDate } from '@mui/x-scheduler-headless/process-date';

describe('<TimelinePremium.EventPlaceholder />', () => {
  const { render } = createSchedulerRenderer();

  const start = processDate(adapter.startOfDay(adapter.now('default')), adapter);
  const end = processDate(adapter.endOfDay(adapter.now('default')), adapter);

  describeConformance(<TimelinePremium.EventPlaceholder start={start} end={end} />, () => ({
    refInstanceof: window.HTMLDivElement,
    render(node) {
      return render(
        <TimelinePremiumProvider events={[]}>
          <TimelinePremium.Root>
            <TimelinePremium.EventRow resourceId="r1">{() => node}</TimelinePremium.EventRow>
          </TimelinePremium.Root>
        </TimelinePremiumProvider>,
      );
    },
  }));
});
