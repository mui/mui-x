import { TimelineGrid } from '@mui/x-scheduler-internals-premium/timeline-grid';
import { EventTimelinePremiumProvider } from '@mui/x-scheduler-internals-premium/event-timeline-premium-provider';
import {
  createSchedulerRenderer,
  describeConformance,
  ResourceBuilder,
} from 'test/utils/scheduler';

describe('<TimelineGrid.TitleRow />', () => {
  const { render } = createSchedulerRenderer();

  describeConformance(<TimelineGrid.TitleRow />, () => ({
    refInstanceof: window.HTMLDivElement,
    render(node) {
      return render(
        <EventTimelinePremiumProvider events={[]} resources={[ResourceBuilder.new().build()]}>
          <TimelineGrid.Root>
            <TimelineGrid.BodyRow index={0}>{node}</TimelineGrid.BodyRow>
          </TimelineGrid.Root>
        </EventTimelinePremiumProvider>,
      );
    },
  }));
});
