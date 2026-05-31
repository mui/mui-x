import { TimelineGrid } from '@mui/x-scheduler-internals-premium/timeline-grid';
import { EventTimelinePremiumProvider } from '@mui/x-scheduler-internals-premium/event-timeline-premium-provider';
import {
  createSchedulerRenderer,
  describeConformance,
  ResourceBuilder,
} from 'test/utils/scheduler';

describe('<TimelineGrid.Row />', () => {
  const { render } = createSchedulerRenderer();

  describeConformance(<TimelineGrid.Row />, () => ({
    refInstanceof: window.HTMLDivElement,
    render(node) {
      return render(
        <EventTimelinePremiumProvider events={[]} resources={[ResourceBuilder.new().build()]}>
          <TimelineGrid.Root>{node}</TimelineGrid.Root>
        </EventTimelinePremiumProvider>,
      );
    },
  }));
});
