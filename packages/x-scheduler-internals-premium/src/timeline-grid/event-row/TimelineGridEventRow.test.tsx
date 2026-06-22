import { TimelineGrid } from '@mui/x-scheduler-internals-premium/timeline-grid';
import { EventTimelinePremiumProvider } from '@mui/x-scheduler-internals-premium/event-timeline-premium-provider';
import {
  createSchedulerRenderer,
  describeConformance,
  ResourceBuilder,
} from 'test/utils/scheduler';

describe('<TimelineGrid.EventRow />', () => {
  const { render } = createSchedulerRenderer();

  describeConformance(
    <TimelineGrid.EventRow resourceId="r1">{() => null}</TimelineGrid.EventRow>,
    () => ({
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
    }),
  );
});
