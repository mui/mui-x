import * as React from 'react';
import { TimelineGrid } from '@mui/x-scheduler-internals-premium/timeline-grid';
import { EventTimelinePremiumProvider } from '@mui/x-scheduler-internals-premium/event-timeline-premium-provider';
import {
  createSchedulerRenderer,
  describeConformance,
  ResourceBuilder,
} from 'test/utils/scheduler';

describe('<TimelineGrid.EventDependencyHandler />', () => {
  const { render } = createSchedulerRenderer();

  // The terminal reads the store context to stamp the drag data with its timeline.
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <EventTimelinePremiumProvider events={[]} resources={[ResourceBuilder.new().build()]}>
        {children}
      </EventTimelinePremiumProvider>
    );
  }

  describeConformance(
    <TimelineGrid.EventDependencyHandler eventId="fake-id" occurrenceKey="fake-key" />,
    () => ({
      refInstanceof: window.HTMLDivElement,
      render(node) {
        return render(<Wrapper>{node}</Wrapper>);
      },
    }),
  );

  it('should expose its occurrence key through the data-dependency-handle attribute', () => {
    render(
      <Wrapper>
        <TimelineGrid.EventDependencyHandler eventId="fake-id" occurrenceKey="fake-key" />
      </Wrapper>,
    );

    expect(document.querySelector('[data-dependency-handle="fake-key"]')).not.to.equal(null);
  });
});
