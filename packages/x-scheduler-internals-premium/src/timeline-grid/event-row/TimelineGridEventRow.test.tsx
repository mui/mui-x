import { fireEvent, screen } from '@mui/internal-test-utils';
import { TimelineGrid } from '@mui/x-scheduler-internals-premium/timeline-grid';
import { EventTimelinePremiumProvider } from '@mui/x-scheduler-internals-premium/event-timeline-premium-provider';
import { SchedulerStoreContext } from '@mui/x-scheduler-internals/use-scheduler-store-context';
import type { AnyEventCalendarStore } from 'test/utils/scheduler';
import {
  adapter,
  createSchedulerRenderer,
  describeConformance,
  mockElementBounds,
  ResourceBuilder,
  SchedulerStoreRunner,
} from 'test/utils/scheduler';
import { describe, it, expect } from 'vitest';

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

  it('should start a creation on the previous half hour of the wall clock of the display timezone', () => {
    let store: AnyEventCalendarStore | null = null;
    const resource = ResourceBuilder.new().id('r1').build();
    // Asia/Kathmandu is 5:45 ahead of UTC, so its half hours aren't the half hours of UTC.
    const timezone = 'Asia/Kathmandu';

    render(
      <EventTimelinePremiumProvider
        events={[]}
        resources={[resource]}
        displayTimezone={timezone}
        visibleDate={adapter.date('2025-07-03T06:15:00Z', timezone)} // noon in Kathmandu
        preset="dayAndHour"
      >
        <TimelineGrid.Root>
          <TimelineGrid.BodyRow index={0}>
            <TimelineGrid.EventRow resourceId={resource.id} data-testid="events-row">
              {() => null}
            </TimelineGrid.EventRow>
          </TimelineGrid.BodyRow>
        </TimelineGrid.Root>
        <SchedulerStoreRunner<AnyEventCalendarStore>
          context={SchedulerStoreContext as any}
          onMount={(s) => {
            store = s;
          }}
        />
      </EventTimelinePremiumProvider>,
    );

    const row = screen.getByTestId('events-row');
    // 1px per minute of the 4 days of the preset.
    mockElementBounds(row, { left: 0, width: 4 * 24 * 60, height: 40 });
    fireEvent.click(row, { clientX: 10 * 60 + 47 });

    expect(store!.state.occurrencePlaceholder?.type).to.equal('creation');
    expect(new Date(store!.state.occurrencePlaceholder!.start).toISOString()).to.equal(
      '2025-07-03T04:45:00.000Z', // 10:30 in Kathmandu
    );
  });
});
