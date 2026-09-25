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
import { schedulerDayEventMoveKind } from './schedulerDrag';
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
  onBeforeMoveStart,
}: {
  getDragData: SchedulerDraggable.Props<CalendarGridDayEvent.DragData>['getDragData'];
  onMove?: SchedulerDraggable.Props<CalendarGridDayEvent.DragData>['onMove'];
  onBeforeMoveStart?: SchedulerDraggable.Props<CalendarGridDayEvent.DragData>['onBeforeMoveStart'];
}) {
  return (
    <Draggable.Provider>
      <SchedulerDraggable
        kind={schedulerDayEventMoveKind}
        payload={payload}
        getDragData={getDragData}
        onMove={onMove}
        onBeforeMoveStart={onBeforeMoveStart}
        render={<div data-testid="source">Event</div>}
      />
    </Draggable.Provider>
  );
}

describe('Scheduler drag snapshots', () => {
  const { render } = createSchedulerRenderer();
  afterEach(cancelDrag);

  it('does not capture a snapshot when the pickup is canceled', () => {
    const getDragData = vi.fn(() => snapshot);
    const onBeforeMoveStart = vi.fn<
      NonNullable<SchedulerDraggable.Props<CalendarGridDayEvent.DragData>['onBeforeMoveStart']>
    >((_, details) => details.cancel());
    const view = render(
      <Fixture getDragData={getDragData} onBeforeMoveStart={onBeforeMoveStart} />,
    );
    startDrag(screen.getByTestId('source'));
    expect(onBeforeMoveStart).toHaveBeenCalledTimes(1);
    expect(getDragData).not.toHaveBeenCalled();

    cancelDrag();
    view.setProps({ onBeforeMoveStart: undefined });
    startDrag(screen.getByTestId('source'));
    expect(getDragData).toHaveBeenCalledTimes(1);
  });

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
