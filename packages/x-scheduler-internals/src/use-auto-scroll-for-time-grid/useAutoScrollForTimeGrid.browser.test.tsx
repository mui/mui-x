import * as React from 'react';
import { Draggable } from '@base-ui/react/draggable';
import { screen, waitFor } from '@mui/internal-test-utils';
import { describe, it, expect, vi } from 'vitest';
import {
  createSchedulerRenderer,
  startDrag,
  moveDrag,
  cancelDrag,
  ExternalEventSource,
} from 'test/utils/scheduler';
import { absorbObserverFrames } from 'test/utils/scheduler/absorb-observer-frames';
import { isJSDOM } from 'test/utils/skipIf';
import {
  schedulerTimeEventMoveKind,
  schedulerDayEventMoveKind,
  schedulerTimeEventResizeKind,
  schedulerDayEventResizeKind,
} from '../internals/utils/schedulerDrag';
import { useAutoScrollForTimeGrid } from './useAutoScrollForTimeGrid';

const dialogKind = Draggable.createKind('scheduler-dialog');
const payload = { scope: Symbol('scheduler') };
const externalEventData = { id: 'external', title: 'External' };

function TimeGrid() {
  const ref = React.useRef<HTMLDivElement>(null);
  useAutoScrollForTimeGrid(ref);
  return (
    <React.Fragment>
      <Draggable.Root
        kind={schedulerTimeEventMoveKind}
        payload={payload}
        data-testid="event"
        style={{ position: 'fixed', left: 300, top: 0, width: 100, height: 40 }}
      >
        Event
        <Draggable.Preview disabled />
      </Draggable.Root>
      <Draggable.Root kind={schedulerDayEventMoveKind} payload={payload} data-testid="day-event">
        Day event
        <Draggable.Preview disabled />
      </Draggable.Root>
      <Draggable.Root
        kind={schedulerTimeEventResizeKind}
        payload={payload}
        data-testid="time-resize"
      >
        <Draggable.Preview disabled />
      </Draggable.Root>
      <Draggable.Root kind={schedulerDayEventResizeKind} payload={payload} data-testid="day-resize">
        <Draggable.Preview disabled />
      </Draggable.Root>
      <ExternalEventSource eventData={externalEventData} data-testid="external" />
      <Draggable.Root kind={dialogKind} data-testid="dialog">
        <Draggable.Preview disabled />
      </Draggable.Root>
      <div
        ref={ref}
        data-testid="time-grid"
        style={{ position: 'fixed', left: 0, top: 200, width: 200, height: 200, overflow: 'auto' }}
      >
        <div style={{ height: 1200 }} />
      </div>
    </React.Fragment>
  );
}

describe.skipIf(isJSDOM)('time-grid overflow auto-scroll', () => {
  const { render } = createSchedulerRenderer();

  it.each(['day-event', 'day-resize', 'dialog'])(
    'should not scroll for %s drags',
    async (source) => {
      render(
        <Draggable.Provider>
          <TimeGrid />
        </Draggable.Provider>,
      );
      const grid = screen.getByTestId('time-grid');
      grid.scrollTop = 400;
      startDrag(screen.getByTestId(source), { clientX: 350, clientY: 20, mockHitTest: false });
      moveDrag(document.body, { clientX: 100, clientY: 500, mockHitTest: false });
      await absorbObserverFrames();
      expect(grid.scrollTop).toBe(400);
    },
  );

  it.each(['time-resize', 'external'])('should scroll for %s drags', async (source) => {
    render(
      <Draggable.Provider>
        <TimeGrid />
      </Draggable.Provider>,
    );
    const grid = screen.getByTestId('time-grid');
    grid.scrollTop = 400;
    startDrag(screen.getByTestId(source), { clientX: 350, clientY: 20, mockHitTest: false });
    moveDrag(document.body, { clientX: 100, clientY: 500, mockHitTest: false });
    await waitFor(() => expect(grid.scrollTop).toBeGreaterThan(400));
  });

  it.each([1, 199])('should park the frame loop at horizontal edge %s', async (clientX) => {
    render(
      <Draggable.Provider>
        <TimeGrid />
      </Draggable.Provider>,
    );
    const grid = screen.getByTestId('time-grid');
    grid.scrollTop = 400;
    startDrag(screen.getByTestId('event'), { clientX: 350, clientY: 20, mockHitTest: false });
    moveDrag(grid, { clientX, clientY: 300, mockHitTest: false });
    await absorbObserverFrames();
    const hitTest = vi.spyOn(document, 'elementFromPoint');
    try {
      await absorbObserverFrames();
      expect(hitTest).not.toHaveBeenCalled();
      expect(grid.scrollTop).toBe(400);
    } finally {
      hitTest.mockRestore();
    }
  });

  it.each([
    { edge: 'top', insideMargin: 100, beyondMargin: 39, direction: -1 },
    { edge: 'bottom', insideMargin: 500, beyondMargin: 561, direction: 1 },
  ])(
    'should scroll within the 160px $edge margin and stop beyond it',
    async ({ insideMargin, beyondMargin, direction }) => {
      render(
        <Draggable.Provider>
          <TimeGrid />
        </Draggable.Provider>,
      );
      const grid = screen.getByTestId('time-grid');
      grid.scrollTop = 400;
      startDrag(screen.getByTestId('event'), { clientX: 350, clientY: 20, mockHitTest: false });
      moveDrag(document.body, { clientX: 100, clientY: insideMargin, mockHitTest: false });
      await waitFor(() => expect((grid.scrollTop - 400) * direction).toBeGreaterThan(0));

      moveDrag(document.body, { clientX: 100, clientY: beyondMargin, mockHitTest: false });
      await absorbObserverFrames();
      const stoppedAt = grid.scrollTop;
      await absorbObserverFrames();
      expect(grid.scrollTop).toBe(stoppedAt);

      moveDrag(document.body, { clientX: 100, clientY: insideMargin, mockHitTest: false });
      await waitFor(() => expect((grid.scrollTop - stoppedAt) * direction).toBeGreaterThan(0));
      cancelDrag();
      const canceledAt = grid.scrollTop;
      await absorbObserverFrames();
      expect(grid.scrollTop).toBe(canceledAt);
    },
  );
});
