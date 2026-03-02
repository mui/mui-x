import { TimelineGrid } from '@mui/x-scheduler-headless-premium/timeline-grid';
import { EventTimelinePremiumProvider } from '@mui/x-scheduler-headless-premium/event-timeline-premium-provider';
import { createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';

describe('<TimelineGrid.Root />', () => {
  const { render } = createSchedulerRenderer();

  describeConformance(<TimelineGrid.Root />, () => ({
    refInstanceof: window.HTMLDivElement,
    render(node) {
      return render(
        <EventTimelinePremiumProvider events={[]}>{node}</EventTimelinePremiumProvider>,
      );
    },
  }));
});
