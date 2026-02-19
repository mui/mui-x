import { TimelineGrid } from '@mui/x-scheduler-headless-premium/timeline-grid';
import { EventTimelinePremiumProvider } from '@mui/x-scheduler-headless-premium/event-timeline-premium-provider';
import { createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';

describe('<TimelineGrid.Row />', () => {
  const { render } = createSchedulerRenderer();

  describeConformance(<TimelineGrid.Row />, () => ({
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
