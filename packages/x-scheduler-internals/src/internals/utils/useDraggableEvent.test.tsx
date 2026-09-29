import * as React from 'react';
import { act, screen } from '@mui/internal-test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  adapter,
  createSchedulerRenderer,
  EventBuilder,
  startDrag,
  moveDrag,
  dropDrag,
  cancelDrag,
} from 'test/utils/scheduler';
import { EventCalendarProvider } from '../../event-calendar-provider';
import type { CalendarGridDayEvent } from '../../calendar-grid/day-event/CalendarGridDayEvent';
import { useDraggableEvent } from './useDraggableEvent';
import { SchedulerDraggable } from './SchedulerDraggable';
import { SchedulerDropTarget } from './SchedulerDropTarget';
import { schedulerDayEventMoveKind } from './schedulerDrag';

const builder = EventBuilder.new().fullDay('2025-07-03').draggable(true);
const occurrence = builder.toOccurrence();
const accept = [schedulerDayEventMoveKind];

function Source() {
  const { draggableProps } = useDraggableEvent<CalendarGridDayEvent.DragData>({
    source: 'CalendarGridDayEvent',
    kind: schedulerDayEventMoveKind,
    eventId: occurrence.id,
    occurrenceKey: occurrence.key,
    start: occurrence.displayTimezone.start,
    end: occurrence.displayTimezone.end,
    position: { position: 0, duration: 1, startingBeforeEdge: false, endingAfterEdge: false },
    isDraggable: true,
    renderDragPreview: () => null,
    getDragData: () => ({
      source: 'CalendarGridDayEvent',
      eventId: occurrence.id,
      occurrenceKey: occurrence.key,
      originalOccurrence: occurrence,
      start: occurrence.displayTimezone.start.value,
      end: occurrence.displayTimezone.end.value,
      draggedDay: occurrence.displayTimezone.start.value,
    }),
  });
  return <SchedulerDraggable {...draggableProps} render={<div data-testid="source" />} />;
}

describe('useDraggableEvent', () => {
  const { render } = createSchedulerRenderer();
  afterEach(cancelDrag);

  it('should commit the last preview when the drop position returns no data', async () => {
    const onEventsChange = vi.fn();
    const start = adapter.addDays(occurrence.displayTimezone.start.value, 1);
    const end = adapter.addDays(occurrence.displayTimezone.end.value, 1);
    const getEventDropData = vi.fn<SchedulerDropTarget.GetEventDropData>(
      ({ source, getDataFromInside }) => getDataFromInside(source.dragData!, start, end),
    );
    render(
      <EventCalendarProvider
        events={[builder.build()]}
        resources={[]}
        onEventsChange={onEventsChange}
      >
        <Source />
        <SchedulerDropTarget
          surfaceType="day-grid"
          accept={accept}
          getEventDropData={getEventDropData}
          render={<div data-testid="target" />}
        />
      </EventCalendarProvider>,
    );
    startDrag(screen.getByTestId('source'));
    await act(async () => {
      moveDrag(screen.getByTestId('target'), { clientX: 100 });
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => resolve());
      });
    });
    expect(getEventDropData).toHaveBeenCalled();
    expect(onEventsChange).not.toHaveBeenCalled();
    getEventDropData.mockReturnValue(undefined);
    dropDrag(screen.getByTestId('target'), { clientX: 110 });
    expect(onEventsChange).toHaveBeenCalledTimes(1);
    expect(
      adapter.isEqual(adapter.date(onEventsChange.mock.calls[0][0][0].start, 'default'), start),
    ).toBe(true);
  });
});
