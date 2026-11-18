import { TimelineGrid } from '@mui/x-scheduler-internals-premium/timeline-grid';
import { EventTimelinePremiumProvider } from '@mui/x-scheduler-internals-premium/event-timeline-premium-provider';
import {
  createSchedulerRenderer,
  describeConformance,
  ResourceBuilder,
} from 'test/utils/scheduler';
import { screen } from '@mui/internal-test-utils';
import { describe, expect, it } from 'vitest';

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

  it('should render a row header', async () => {
    await render(
      <EventTimelinePremiumProvider events={[]} resources={[ResourceBuilder.new().build()]}>
        <TimelineGrid.Root>
          <TimelineGrid.BodyRow index={0}>
            <TimelineGrid.TitleRow>Title</TimelineGrid.TitleRow>
          </TimelineGrid.BodyRow>
        </TimelineGrid.Root>
      </EventTimelinePremiumProvider>,
    );

    expect(screen.getByRole('rowheader').textContent).to.equal('Title');
  });
});
