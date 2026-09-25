import * as React from 'react';
import { Draggable } from '@base-ui/react/draggable';
import { screen, waitFor } from '@mui/internal-test-utils';
import { describe, it, expect, afterEach } from 'vitest';
import { createSchedulerRenderer, startDrag, moveDrag, cancelDrag } from 'test/utils/scheduler';
import { absorbObserverFrames } from 'test/utils/scheduler/absorb-observer-frames';
import { isJSDOM } from 'test/utils/skipIf';
import {
  schedulerTimeEventMoveKind,
  schedulerDayEventMoveKind,
} from '../internals/utils/schedulerDrag';
import { useAutoScrollForTimeGrid } from './useAutoScrollForTimeGrid';

function TimeGrid() {
  const ref = React.useRef<HTMLDivElement>(null);
  useAutoScrollForTimeGrid(ref);
  return (
    <React.Fragment>
      <Draggable.Root
        kind={schedulerTimeEventMoveKind}
        payload={{ source: 'CalendarGridTimeEvent', eventId: 'event', occurrenceKey: 'event' }}
        data-testid="event"
        style={{ position: 'fixed', left: 300, top: 0, width: 100, height: 40 }}
      >
        Event
        <Draggable.Preview disabled />
      </Draggable.Root>
      <Draggable.Root
        kind={schedulerDayEventMoveKind}
        payload={{ source: 'CalendarGridDayEvent', eventId: 'day', occurrenceKey: 'day' }}
        data-testid="day-event"
      >
        Day event
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
  afterEach(cancelDrag);

  it('does not scroll for day-grid drags', async () => {
    render(
      <Draggable.Provider>
        <TimeGrid />
      </Draggable.Provider>,
    );
    const grid = screen.getByTestId('time-grid');
    grid.scrollTop = 400;
    startDrag(screen.getByTestId('day-event'), { clientX: 350, clientY: 20, mockHitTest: false });
    moveDrag(document.body, { clientX: 100, clientY: 500, mockHitTest: false });
    await absorbObserverFrames();
    expect(grid.scrollTop).toBe(400);
  });

  it.each([
    { edge: 'top', insideMargin: 100, beyondMargin: 39, direction: -1 },
    { edge: 'bottom', insideMargin: 500, beyondMargin: 561, direction: 1 },
  ])(
    'scrolls within the 160px $edge margin and stops beyond it',
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
