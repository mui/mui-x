import type { Draggable } from '@base-ui/react/draggable';
import { adapter, EventBuilder } from 'test/utils/scheduler';
import { describe, it, expect } from 'vitest';
import { getLinearEventDropDates, getLinearPointerDate } from './getLinearEventDropDates';
import type { LinearDropSurface } from './getLinearEventDropDates';
import type { SchedulerDropTarget } from './SchedulerDropTarget';
import {
  schedulerExternalEventKind,
  schedulerTimeEventMoveKind,
  schedulerTimeEventResizeKind,
} from './schedulerDrag';
import type { SchedulerAxisEventDragData } from './schedulerDrag';

const HOUR_MS = 60 * 60 * 1000;
const DAY_START = adapter.date('2025-07-03T00:00:00', 'default');
const at = (hours: number) => adapter.addMilliseconds(DAY_START, hours * HOUR_MS);

/** A whole day, with a window the events have to stay in. */
const daySurface: LinearDropSurface = {
  axis: 'y',
  durationMs: 24 * HOUR_MS,
  offsetToDate: (offsetMs) => adapter.addMilliseconds(DAY_START, offsetMs),
  dateToOffset: (date) => adapter.getTime(date) - adapter.getTime(DAY_START),
  bounds: { start: at(0), end: at(24) },
};

/** 8:00 to 20:00 of the day: the hours around it take no space on the axis. */
const trimmedSurface: LinearDropSurface = {
  axis: 'x',
  durationMs: 12 * HOUR_MS,
  offsetToDate: (offsetMs) => adapter.addMilliseconds(at(8), offsetMs),
  dateToOffset: (date) =>
    Math.min(Math.max(adapter.getTime(date) - adapter.getTime(at(8)), 0), 12 * HOUR_MS),
};

const occurrence = EventBuilder.new().toOccurrence();

function createTarget(fraction: number, axis: 'x' | 'y') {
  // Only what the helper reads. The other axis holds a different value, so reading it shows.
  return {
    getSnappedLocalPoint: () => ({
      x: axis === 'x' ? fraction : 0.123,
      y: axis === 'y' ? fraction : 0.987,
    }),
  } as unknown as Draggable.Target.Record;
}

function createSource(
  kind: { id: symbol },
  dragData: Partial<SchedulerAxisEventDragData & { side: 'start' | 'end' }>,
) {
  return { kind: kind.id, dragData, payload: {} } as unknown as SchedulerDropTarget.Source;
}

function getDragData(
  startHours: number,
  endHours: number,
  initialCursorMinutes: number,
  side?: 'start' | 'end',
) {
  return {
    originalOccurrence: occurrence,
    start: at(startHours),
    end: at(endHours),
    initialCursorPositionInEventMs: initialCursorMinutes * 60 * 1000,
    ...(side ? { side } : null),
  };
}

function move(surface: LinearDropSurface, source: SchedulerDropTarget.Source, fraction: number) {
  return getLinearEventDropDates({
    adapter,
    source,
    target: createTarget(fraction, surface.axis),
    surface,
    moveKind: schedulerTimeEventMoveKind,
    resizeKind: schedulerTimeEventResizeKind,
  });
}

describe('getLinearEventDropDates', () => {
  describe('moving an event', () => {
    const source = createSource(schedulerTimeEventMoveKind, getDragData(10, 11, 30));

    it('should keep the grab position under the pointer and round to 15 minutes', () => {
      // 15:37 minus the 30 minutes grabbed into the event is 15:07, which rounds to 15:00.
      const dates = move(daySurface, source, (15 + 37 / 60) / 24)!;
      expect(dates.start).toEqualDateTime(at(15));
      expect(dates.end).toEqualDateTime(at(16));
    });

    it('should keep the event inside the window at the end of the day', () => {
      const dates = move(daySurface, source, 23.9 / 24)!;
      expect(dates.start).toEqualDateTime(at(23));
      expect(dates.end).toEqualDateTime(at(24));
    });

    it('should keep the event inside the window at the start of the day', () => {
      const dates = move(daySurface, source, 0.2 / 24)!;
      expect(dates.start).toEqualDateTime(at(0));
      expect(dates.end).toEqualDateTime(at(1));
    });

    it('should return nothing while the drag data is not captured yet', () => {
      const early = {
        kind: schedulerTimeEventMoveKind.id,
        payload: {},
      } as unknown as SchedulerDropTarget.Source;
      expect(move(daySurface, early, 0.5)).toBe(undefined);
    });

    it('should map an unmoved drag back to the exact dates of an event that starts in hidden hours', () => {
      // 7:00 to 9:00: its rendered start is the 8:00 edge of the window, and the pointer stays there.
      const hiddenStart = createSource(schedulerTimeEventMoveKind, getDragData(7, 9, 0));
      const dates = move(trimmedSurface, hiddenStart, 0)!;
      expect(dates.start).toEqualDateTime(at(7));
      expect(dates.end).toEqualDateTime(at(9));
    });
  });

  describe('resizing an event', () => {
    it('should follow the pointer with the end and keep the grab offset', () => {
      // Grabbed at the end of the 10:00 to 11:00 event, then moved to 16:00.
      const source = createSource(schedulerTimeEventResizeKind, getDragData(10, 11, 60, 'end'));
      const dates = move(daySurface, source, 16 / 24)!;
      expect(dates.start).toEqualDateTime(at(10));
      expect(dates.end).toEqualDateTime(at(16));
    });

    it('should keep 15 minutes between the start and a dragged end', () => {
      const source = createSource(schedulerTimeEventResizeKind, getDragData(10, 11, 60, 'end'));
      const dates = move(daySurface, source, 9 / 24)!;
      expect(dates.end).toEqualDateTime(at(10.25));
    });

    it('should clamp an end that the grab offset pushes past the window', () => {
      // Grabbed 15 minutes before the end and released at the edge of the day: the pointer
      // puts the end 15 minutes after midnight.
      const source = createSource(schedulerTimeEventResizeKind, getDragData(10, 11, 45, 'end'));
      const dates = move(daySurface, source, 1)!;
      expect(dates.end).toEqualDateTime(at(24));
    });

    it('should keep the end inside the window', () => {
      const source = createSource(schedulerTimeEventResizeKind, getDragData(10, 11, 60, 'end'));
      const dates = move(daySurface, source, 1)!;
      expect(dates.end).toEqualDateTime(at(24));
    });

    it('should keep 15 minutes between a dragged start and the end', () => {
      const source = createSource(schedulerTimeEventResizeKind, getDragData(10, 11, 0, 'start'));
      const dates = move(daySurface, source, 12 / 24)!;
      expect(dates.start).toEqualDateTime(at(10.75));
      expect(dates.end).toEqualDateTime(at(11));
    });

    it('should not let the start leave the window', () => {
      const source = createSource(schedulerTimeEventResizeKind, getDragData(10, 11, 0, 'start'));
      const dates = move(daySurface, source, -0.2)!;
      expect(dates.start).toEqualDateTime(at(0));
    });
  });

  describe('dropping an external event', () => {
    it('should start it under the pointer', () => {
      const source = createSource(schedulerExternalEventKind, {});
      const dates = getLinearEventDropDates({
        adapter,
        source,
        target: createTarget(9 / 24, 'y'),
        surface: daySurface,
        moveKind: schedulerTimeEventMoveKind,
        resizeKind: schedulerTimeEventResizeKind,
      })!;
      expect(dates.start).toEqualDateTime(at(9));
      expect(dates.end).toBe(undefined);
    });
  });

  describe('getLinearPointerDate', () => {
    it('should stop one slot before the end of the axis', () => {
      // Rounding alone would send the last minutes of the day to the midnight after it.
      expect(
        getLinearPointerDate({ target: createTarget(1, 'y'), surface: daySurface }),
      ).toEqualDateTime(at(23.75));
      expect(
        getLinearPointerDate({ target: createTarget(23.95 / 24, 'y'), surface: daySurface }),
      ).toEqualDateTime(at(23.75));
    });
  });
});
