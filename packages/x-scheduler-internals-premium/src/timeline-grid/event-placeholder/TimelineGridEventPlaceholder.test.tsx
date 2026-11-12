import { TimelineGrid } from '@mui/x-scheduler-internals-premium/timeline-grid';
import { EventTimelinePremiumProvider } from '@mui/x-scheduler-internals-premium/event-timeline-premium-provider';
import {
  createSchedulerRenderer,
  describeConformance,
  endOfDay,
  ResourceBuilder,
  startOfDay,
} from 'test/utils/scheduler';
import { processDate } from '@mui/x-scheduler-internals/process-date';
import { describe } from 'vitest';

describe('<TimelineGrid.EventPlaceholder />', () => {
  const { render } = createSchedulerRenderer();

  const start = processDate(startOfDay(new Date()), 'default');
  const end = processDate(endOfDay(new Date()), 'default');

  describeConformance(<TimelineGrid.EventPlaceholder start={start} end={end} />, () => ({
    refInstanceof: window.HTMLDivElement,
    render(node) {
      return render(
        <EventTimelinePremiumProvider events={[]} resources={[ResourceBuilder.new().build()]}>
          <TimelineGrid.Root>
            <TimelineGrid.BodyRow index={0}>
              <TimelineGrid.EventRow resourceId="r1">{() => node}</TimelineGrid.EventRow>
            </TimelineGrid.BodyRow>
          </TimelineGrid.Root>
        </EventTimelinePremiumProvider>,
      );
    },
  }));
});
