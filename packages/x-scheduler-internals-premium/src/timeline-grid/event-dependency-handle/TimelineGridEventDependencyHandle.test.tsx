import * as React from 'react';
import { TimelineGrid } from '@mui/x-scheduler-internals-premium/timeline-grid';
import { EventTimelinePremiumProvider } from '@mui/x-scheduler-internals-premium/event-timeline-premium-provider';
import type { EventTimelinePremiumStoreParameters } from '@mui/x-scheduler-internals-premium/use-event-timeline-premium';
import {
  adapter,
  createSchedulerRenderer,
  describeConformance,
  ResourceBuilder,
} from 'test/utils/scheduler';
import { processDate } from '@mui/x-scheduler-internals/process-date';

describe('<TimelineGrid.EventDependencyHandle />', () => {
  const { render } = createSchedulerRenderer();

  const start = processDate(adapter.startOfDay(adapter.now('default')), adapter);
  const end = processDate(adapter.endOfDay(adapter.now('default')), adapter);

  // `dependencies` is not a public prop yet: the provider receives the internal store
  // parameters through a typed spread.
  const enabledParameters: EventTimelinePremiumStoreParameters<any, any> = {
    events: [],
    resources: [ResourceBuilder.new().build()],
    dependencies: [],
  };

  function Wrapper({
    parameters,
    children,
  }: {
    parameters: EventTimelinePremiumStoreParameters<any, any>;
    children: React.ReactNode;
  }) {
    return (
      <EventTimelinePremiumProvider {...parameters}>
        <TimelineGrid.Root>
          <TimelineGrid.BodyRow index={0}>
            <TimelineGrid.EventRow resourceId="r1">
              {() => (
                <TimelineGrid.Event
                  eventId="fake-id"
                  occurrenceKey="fake-key"
                  start={start}
                  end={end}
                  renderDragPreview={() => null}
                >
                  {children}
                </TimelineGrid.Event>
              )}
            </TimelineGrid.EventRow>
          </TimelineGrid.BodyRow>
        </TimelineGrid.Root>
      </EventTimelinePremiumProvider>
    );
  }

  describeConformance(<TimelineGrid.EventDependencyHandle />, () => ({
    refInstanceof: window.HTMLDivElement,
    render(node) {
      return render(<Wrapper parameters={enabledParameters}>{node}</Wrapper>);
    },
  }));

  it('should render with the data-dependency-handle attribute when the feature is enabled', () => {
    render(
      <Wrapper parameters={enabledParameters}>
        <TimelineGrid.EventDependencyHandle />
      </Wrapper>,
    );

    expect(document.querySelector('[data-dependency-handle]')).not.to.equal(null);
  });

  it('should not render when the dependencies feature is not enabled', () => {
    render(
      <Wrapper parameters={{ events: [], resources: [ResourceBuilder.new().build()] }}>
        <TimelineGrid.EventDependencyHandle />
      </Wrapper>,
    );

    expect(document.querySelector('[data-dependency-handle]')).to.equal(null);
  });
});
