import * as React from 'react';
import { screen, waitFor } from '@mui/internal-test-utils';
import { describe, expect, it } from 'vitest';
import {
  createSchedulerRenderer,
  ExternalEventSource,
  ResourceBuilder,
  startDrag,
  moveDrag,
  cancelDrag,
} from 'test/utils/scheduler';
import { absorbObserverFrames } from 'test/utils/scheduler/absorb-observer-frames';
import { isJSDOM } from 'test/utils/skipIf';
import { EventTimelinePremiumProvider } from '../../event-timeline-premium-provider';
import { useTimelineDragAutoScroll } from './useTimelineDragAutoScroll';

const eventData = { id: 'event', title: 'Event' };

function Timeline() {
  const scrollerRef = React.useRef<HTMLDivElement>(null);
  useTimelineDragAutoScroll({ scrollerRef, pinnedLeftWidth: 80 });
  return (
    <React.Fragment>
      <ExternalEventSource eventData={eventData} data-testid="source" />
      <div
        ref={scrollerRef}
        data-testid="timeline"
        style={{ position: 'fixed', left: 0, top: 100, width: 300, height: 200, overflow: 'auto' }}
      >
        <div style={{ width: 1200, height: 1200 }} />
      </div>
    </React.Fragment>
  );
}

describe.skipIf(isJSDOM)('timeline drag auto-scroll', () => {
  const { render } = createSchedulerRenderer();

  it('should scroll at the events edge and exclude the pinned title column', async () => {
    const view = render(
      <EventTimelinePremiumProvider events={[]} resources={[ResourceBuilder.new().build()]}>
        <Timeline />
      </EventTimelinePremiumProvider>,
    );
    const grid = screen.getByTestId('timeline');
    expect(grid.getBoundingClientRect().left).toBe(80);
    expect(grid.getBoundingClientRect().width).toBe(220);
    grid.scrollLeft = 400;
    startDrag(screen.getByTestId('source'), { clientX: 350, clientY: 20, mockHitTest: false });
    moveDrag(grid, { clientX: 85, clientY: 200, mockHitTest: false });
    await waitFor(() => expect(grid.scrollLeft).toBeLessThan(400));
    moveDrag(grid, { clientX: 20, clientY: 200, mockHitTest: false });
    await absorbObserverFrames();
    const stoppedAt = grid.scrollLeft;
    await absorbObserverFrames();
    expect(grid.scrollLeft).toBe(stoppedAt);
    cancelDrag();
    view.unmount();
    expect(Object.hasOwn(grid, 'getBoundingClientRect')).toBe(false);
  });
});
