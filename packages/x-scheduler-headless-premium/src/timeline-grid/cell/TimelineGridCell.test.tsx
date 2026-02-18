import { TimelineGrid } from '@mui/x-scheduler-headless-premium/timeline-grid';
import { createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';
import { EventTimelinePremiumProvider } from '@mui/x-scheduler-headless-premium/event-timeline-premium-provider';

describe('<TimelineGrid.Cell />', () => {
  const { render } = createSchedulerRenderer();

  describeConformance(<TimelineGrid.Cell />, () => ({
    refInstanceof: window.HTMLDivElement,
    render(node) {
      return render(
        <EventTimelinePremiumProvider events={[]}>
          <TimelineGrid.Root>
            <TimelineGrid.Row>{node}</TimelineGrid.Row>
          </TimelineGrid.Root>
        </EventTimelinePremiumProvider>,
      );
    },
  }));
});
