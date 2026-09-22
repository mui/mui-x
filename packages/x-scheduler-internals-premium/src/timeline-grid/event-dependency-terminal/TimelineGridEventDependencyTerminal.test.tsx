import { cancelDrag, startDrag } from 'test/utils/scheduler/dnd';
import * as React from 'react';
import { waitFor } from '@mui/internal-test-utils';
import { Draggable } from '@base-ui/react/draggable';
import { TimelineGrid } from '@mui/x-scheduler-internals-premium/timeline-grid';
import { EventTimelinePremiumProvider } from '@mui/x-scheduler-internals-premium/event-timeline-premium-provider';
import {
  createSchedulerRenderer,
  describeConformance,
  ResourceBuilder,
} from 'test/utils/scheduler';
import { vi, describe, it, expect } from 'vitest';

describe('<TimelineGrid.EventDependencyTerminal />', () => {
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
    <TimelineGrid.EventDependencyTerminal
      eventId="fake-id"
      occurrenceKey="fake-key"
      resourceId="fake-resource"
    />,
    () => ({
      refInstanceof: window.HTMLDivElement,
      render(node) {
        return render(<Wrapper>{node}</Wrapper>);
      },
    }),
  );

  it('should stamp its side into the drag data', async () => {
    const onDragStart = vi.fn();
    function Monitor() {
      Draggable.useDragMonitor({ onMoveStart: onDragStart });
      return null;
    }
    render(
      <Wrapper>
        <Monitor />
        <TimelineGrid.EventDependencyTerminal
          eventId="fake-id"
          occurrenceKey="fake-key"
          resourceId="fake-resource"
          side="start"
        />
      </Wrapper>,
    );

    startDrag(document.querySelector('[data-dependency-terminal]')!, {});
    await waitFor(() => {
      expect(onDragStart.mock.calls.length).to.equal(1);
    });
    const { payload: data } = onDragStart.mock.calls[0][0].source;
    expect(data.sourceSide).to.equal('start');
    expect(data.eventId).to.equal('fake-id');
    cancelDrag();
  });

  it('should expose its occurrence key, resource and side through its data attributes', () => {
    render(
      <Wrapper>
        <TimelineGrid.EventDependencyTerminal
          eventId="fake-id"
          occurrenceKey="fake-key"
          resourceId="fake-resource"
        />
      </Wrapper>,
    );

    expect(
      document.querySelector(
        '[data-dependency-terminal="fake-key"][data-resource-id="fake-resource"][data-side="end"]',
      ),
    ).not.to.equal(null);
  });
});
