import type { Draggable } from '@base-ui/react/draggable';
import { EVENT_DRAG_PRECISION_MINUTE, EVENT_DRAG_PRECISION_MS } from '../../constants';
import type { Adapter } from '../../use-adapter/useAdapter.types';
import type { TemporalSupportedObject } from '../../models';
import { schedulerExternalEventKind } from './schedulerDrag';
import type {
  SchedulerAxisEventDragData,
  SchedulerAxisEventResizeDragData,
  SchedulerEventDragPayload,
} from './schedulerDrag';
import { roundToDragPrecision } from './drag-utils';
import { clampResizedEventEdge } from './resize-utils';
import type { SchedulerDropTarget } from './SchedulerDropTarget';

/**
 * A drop target where the pointer maps to a date along one axis, such as a day column or a
 * timeline row.
 */
export interface LinearDropSurface {
  /**
   * The axis of the target that the date follows.
   */
  axis: 'x' | 'y';
  /**
   * How long the target is along its axis, in milliseconds of the axis.
   * The axis skips hidden hours, so it can be shorter than the dates it spans.
   */
  durationMs: number;
  /**
   * Maps an offset from the start of the axis, in milliseconds of the axis, to a date.
   */
  offsetToDate: (offsetMs: number) => TemporalSupportedObject;
  /**
   * Maps a date to an offset from the start of the axis. A date that falls in hidden hours maps
   * to the edge of the visible hours.
   */
  dateToOffset: (date: TemporalSupportedObject) => number;
  /**
   * The dates an event has to stay within, when the surface holds a single window such as a day.
   */
  bounds?: { start: TemporalSupportedObject; end: TemporalSupportedObject };
}

function getCursorOffsetMs(target: Draggable.Target.Record, surface: LinearDropSurface) {
  return Math.round(surface.durationMs * target.getSnappedLocalPoint()[surface.axis]);
}

/**
 * The date under the pointer, rounded to the drag precision.
 * It stops one slot before the end of the axis: a drop on the very edge would otherwise start an
 * event where the surface no longer renders it.
 */
export function getLinearPointerDate(parameters: {
  target: Draggable.Target.Record;
  surface: LinearDropSurface;
}): TemporalSupportedObject {
  const { target, surface } = parameters;
  const lastStartOffsetMs = surface.durationMs - EVENT_DRAG_PRECISION_MS;
  return surface.offsetToDate(
    roundToDragPrecision(Math.min(getCursorOffsetMs(target, surface), lastStartOffsetMs)),
  );
}

/**
 * The dates the pointer gives an event that moves or resizes on a linear surface, or the start
 * of an external event dropped on it.
 */
export function getLinearEventDropDates<
  TMoveData extends SchedulerAxisEventDragData,
  TResizeData extends SchedulerAxisEventResizeDragData,
>(parameters: {
  adapter: Adapter;
  source: SchedulerDropTarget.Source;
  target: Draggable.Target.Record;
  surface: LinearDropSurface;
  moveKind: Draggable.Kind<SchedulerEventDragPayload, TMoveData>;
  resizeKind: Draggable.Kind<SchedulerEventDragPayload, TResizeData>;
}): SchedulerDropTarget.DropDates | undefined {
  const { adapter, source, target, surface, moveKind, resizeKind } = parameters;
  const { bounds } = surface;

  const cursorOffsetMs = getCursorOffsetMs(target, surface);
  const toDate = (offsetMs: number) => surface.offsetToDate(roundToDragPrecision(offsetMs));

  if (moveKind.matches(source)) {
    const data = source.dragData;
    if (!data) {
      return undefined;
    }
    const eventDurationMs = adapter.getTime(data.end) - adapter.getTime(data.start);

    // `cursorOffsetMs - initialCursorPositionInEventMs` reconstructs the *rendered* start edge
    // plus the drag delta. When the real start hides inside the hidden hours, the rendered edge
    // is its window-clamped anchor: carry the hidden remainder over to the new anchor so an
    // unmoved drag maps back to the exact original dates instead of silently snapping the start
    // to the window edge.
    const startAnchor = surface.offsetToDate(surface.dateToOffset(data.start));
    const hiddenRemainderMs = adapter.getTime(data.start) - adapter.getTime(startAnchor);

    let newStart = adapter.addMilliseconds(
      toDate(cursorOffsetMs - data.initialCursorPositionInEventMs),
      hiddenRemainderMs,
    );

    // Keep the event inside the window of the surface.
    if (bounds) {
      if (adapter.isBefore(newStart, bounds.start)) {
        newStart = bounds.start;
      }
      const maxStart = adapter.addMilliseconds(bounds.end, -eventDurationMs);
      if (adapter.isAfter(newStart, maxStart)) {
        newStart = maxStart;
      }
    }

    // The event keeps its real duration even when it spans hidden hours, so the real start and
    // end both shift by the same amount as their rendered anchors.
    return { start: newStart, end: adapter.addMilliseconds(newStart, eventDurationMs) };
  }

  if (resizeKind.matches(source)) {
    const data = source.dragData;
    if (!data) {
      return undefined;
    }

    if (data.side === 'start') {
      let cursorDate = toDate(cursorOffsetMs - data.initialCursorPositionInEventMs);
      if (bounds && adapter.isBefore(cursorDate, bounds.start)) {
        cursorDate = bounds.start;
      }
      // Ensure the new start date is not after or too close to the end date.
      return clampResizedEventEdge({
        adapter,
        side: 'start',
        start: data.start,
        end: data.end,
        cursorDate,
        precisionMinute: EVENT_DRAG_PRECISION_MINUTE,
      });
    }

    // The offset from the grab point to the event end is measured on the axis: the real duration
    // would overshoot when the event spans hidden hours.
    const eventAxisDurationMs = surface.dateToOffset(data.end) - surface.dateToOffset(data.start);
    let cursorDate = toDate(
      cursorOffsetMs - data.initialCursorPositionInEventMs + eventAxisDurationMs,
    );
    if (bounds && adapter.isAfter(cursorDate, bounds.end)) {
      cursorDate = bounds.end;
    }
    // Ensure the new end date is not before or too close to the start date.
    return clampResizedEventEdge({
      adapter,
      side: 'end',
      start: data.start,
      end: data.end,
      cursorDate,
      precisionMinute: EVENT_DRAG_PRECISION_MINUTE,
    });
  }

  if (schedulerExternalEventKind.matches(source)) {
    return { start: getLinearPointerDate({ target, surface }) };
  }

  return undefined;
}
