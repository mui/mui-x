import { TimelineGrid } from '@mui/x-scheduler-internals-premium/timeline-grid';
import { EventTimelinePremiumProvider } from '@mui/x-scheduler-internals-premium/event-timeline-premium-provider';
import { createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';

describe('<TimelineGrid.SubGrid />', () => {
  const { render } = createSchedulerRenderer();

  describeConformance(<TimelineGrid.SubGrid />, () => ({
    refInstanceof: window.HTMLDivElement,
    render(node) {
      return render(
        <EventTimelinePremiumProvider events={[]}>
          <TimelineGrid.Root>{node}</TimelineGrid.Root>
        </EventTimelinePremiumProvider>,
      );
    },
  }));
});
