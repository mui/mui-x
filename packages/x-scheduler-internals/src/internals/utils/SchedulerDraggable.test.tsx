import * as React from 'react';
import { Draggable } from '@base-ui/react/draggable';
import { act, screen } from '@mui/internal-test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  cancelDrag,
  createSchedulerRenderer,
  EventBuilder,
  moveDrag,
  startDrag,
} from 'test/utils/scheduler';
import { SchedulerDraggable } from './SchedulerDraggable';
import { schedulerEventMoveKind } from './schedulerDrag';
import type { SchedulerEventMoveData } from './schedulerDrag';
import type { CalendarGridDayEvent } from '../../calendar-grid/day-event/CalendarGridDayEvent';

const occurrence = EventBuilder.new().fullDay('2025-07-03').toOccurrence();
const payload = {
  source: 'CalendarGridDayEvent' as const,
  eventId: occurrence.id,
  occurrenceKey: occurrence.key,
};
const snapshot: CalendarGridDayEvent.DragData = {
  ...payload,
  originalOccurrence: occurrence,
  start: occurrence.displayTimezone.start.value,
  end: occurrence.displayTimezone.end.value,
  draggedDay: occurrence.displayTimezone.start.value,
};

function Fixture({
  getDragData,
  onMove,
}: {
  getDragData: SchedulerDraggable.Props<CalendarGridDayEvent.DragData>['getDragData'];
  onMove: SchedulerDraggable.Props<SchedulerEventMoveData>['onMove'];
}) {
  return (
    <Draggable.Provider>
      <SchedulerDraggable
        kind={schedulerEventMoveKind}
        payload={payload}
        getDragData={getDragData}
        onMove={onMove}
        render={<div data-testid="source">Event</div>}
      />
    </Draggable.Provider>
  );
}

describe('Scheduler drag snapshots', () => {
  const { render } = createSchedulerRenderer();
  afterEach(cancelDrag);

  it('captures once per gesture and keeps the snapshot across source rerenders', async () => {
    const getDragData = vi.fn(() => snapshot);
    const onMove = vi.fn();
    const view = render(<Fixture getDragData={getDragData} onMove={onMove} />);
    expect(getDragData).not.toHaveBeenCalled();
    startDrag(screen.getByTestId('source'));
    expect(getDragData).toHaveBeenCalledTimes(1);

    const nextSnapshot = { ...snapshot };
    const nextGetDragData = vi.fn(() => nextSnapshot);
    view.setProps({ getDragData: nextGetDragData });
    await act(async () => {
      moveDrag(document.body, { clientX: 100 });
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => resolve());
      });
    });
    expect(onMove.mock.lastCall![0].source.payload).toBe(payload);
    expect(onMove.mock.lastCall![0].source.dragData).toBe(snapshot);
    expect(nextGetDragData).not.toHaveBeenCalled();

    cancelDrag();
    startDrag(screen.getByTestId('source'));
    expect(nextGetDragData).toHaveBeenCalledTimes(1);
  });
});
