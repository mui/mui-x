import * as React from 'react';
import { Draggable } from '@base-ui/react/draggable';
import { screen, waitFor } from '@mui/internal-test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import { createSchedulerRenderer, startDrag, moveDrag, cancelDrag } from 'test/utils/scheduler';
import { absorbObserverFrames } from 'test/utils/scheduler/absorb-observer-frames';
import { isJSDOM } from 'test/utils/skipIf';
import { schedulerExternalEventKind } from './schedulerDrag';
import { useTimelineDragAutoScroll } from './useTimelineDragAutoScroll';

function Timeline() {
  const scrollerRef = React.useRef<HTMLDivElement>(null);
  const viewportProps = useTimelineDragAutoScroll({ scrollerRef, pinnedLeftWidth: 80 });
  return (
    <React.Fragment>
      <Draggable.Root
        kind={schedulerExternalEventKind}
        payload={{ eventData: { id: 'event', title: 'Event' } }}
        data-testid="source"
      >
        <Draggable.Preview disabled />
      </Draggable.Root>
      <Draggable.Viewport
        {...viewportProps}
        ref={scrollerRef}
        data-testid="timeline"
        style={{ position: 'fixed', left: 0, top: 100, width: 300, height: 200, overflow: 'auto' }}
      >
        <div style={{ width: 1200, height: 1200 }} />
      </Draggable.Viewport>
    </React.Fragment>
  );
}

describe.skipIf(isJSDOM)('timeline drag auto-scroll', () => {
  const { render } = createSchedulerRenderer();
  afterEach(cancelDrag);

  it('should scroll at the events edge and exclude the pinned title column', async () => {
    const view = render(
      <Draggable.Provider>
        <Timeline />
      </Draggable.Provider>,
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
