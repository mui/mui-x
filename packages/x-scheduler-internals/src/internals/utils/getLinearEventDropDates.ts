import type { Draggable } from '@base-ui/react/draggable';
import { EVENT_DRAG_PRECISION_MINUTE, EVENT_DRAG_PRECISION_MS } from '../../constants';
import { roundToDragPrecision } from './drag-utils';
import { schedulerExternalEventKind } from './schedulerDrag';
import type {
  SchedulerAxisEventDragData,
  SchedulerAxisEventResizeDragData,
  SchedulerEventDragPayload,
} from './schedulerDrag';
import type { SchedulerDropTarget } from './SchedulerDropTarget';

/**
 * A drop target where the pointer maps to a date along one axis, such as a day column or a
 * timeline row. The dates are timestamps in milliseconds. The offsets are milliseconds from the
 * start of the axis, in the unit of the surface: the hidden hours of a timeline row take no space,
 * and a day column counts the time elapsed, which differs from its wall-clock hours on DST days.
 */
export interface LinearDropSurface {
  /**
   * The axis of the target that the date follows.
   */
  axis: 'x' | 'y';
  /**
   * Whether the dates run from the right edge of the target, as on a horizontal axis in RTL.
   * @default false
   */
  reversed?: boolean;
  /**
   * How long the target is along its axis, as an offset.
   * The axis skips hidden hours, so it can be shorter than the dates it spans.
   */
  durationMs: number;
  /**
   * Maps the position of the pointer along the axis, from 0 at the start of the dates to 1 at
   * their end, to an offset from the start of the axis.
   * Defaults to a linear mapping over `durationMs`.
   */
  fractionToOffsetMs?: (fraction: number) => number;
  /**
   * Maps an offset from the start of the axis to a date.
   */
  offsetToDate: (offsetMs: number) => number;
  /**
   * Maps a date to an offset from the start of the axis. A date that falls in hidden hours maps
   * to the edge of the visible hours.
   */
  dateToOffset: (date: number) => number;
  /**
   * The part of the start of a moved event that the axis does not render, because it falls in
   * hidden hours. The move carries it over, so an unmoved drag maps back to the exact dates.
   * Defaults to the distance between the start and the date the axis renders it at.
   */
  getHiddenStartRemainderMs?: (start: number) => number;
  /**
   * The dates an event has to stay within, when the surface holds a single window such as a day.
   */
  bounds?: { start: number; end: number };
  /**
   * Whether a moved event with these dates has to stay within `bounds`.
   * @default () => true
   */
  isMoveBounded?: (start: number, end: number) => boolean;
}

function getCursorOffsetMs(target: Draggable.Target.Record, surface: LinearDropSurface) {
  const point = target.getSnappedLocalPoint()[surface.axis];
  const fraction = surface.reversed ? 1 - point : point;
  return surface.fractionToOffsetMs
    ? surface.fractionToOffsetMs(fraction)
    : Math.round(surface.durationMs * fraction);
}

/**
 * The date under the pointer, rounded to the drag precision.
 * It stops one slot before the end of the axis: a drop on the very edge would otherwise start an
 * event where the surface no longer renders it.
 */
export function getLinearPointerDate(parameters: {
  target: Draggable.Target.Record;
  surface: LinearDropSurface;
}): number {
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
  source: SchedulerDropTarget.Source;
  target: Draggable.Target.Record;
  surface: LinearDropSurface;
  moveKind: Draggable.Kind<SchedulerEventDragPayload, TMoveData>;
  resizeKind: Draggable.Kind<SchedulerEventDragPayload, TResizeData>;
}): SchedulerDropTarget.DropDates | undefined {
  const { source, target, surface, moveKind, resizeKind } = parameters;
  const { bounds } = surface;
  const precisionMs = EVENT_DRAG_PRECISION_MINUTE * 60_000;

  const cursorOffsetMs = getCursorOffsetMs(target, surface);
  const toDate = (offsetMs: number) => surface.offsetToDate(roundToDragPrecision(offsetMs));

  if (moveKind.matches(source)) {
    const data = source.dragData;
    if (!data) {
      return undefined;
    }
    const eventDurationMs = data.end - data.start;

    // `cursorOffsetMs - initialCursorPositionInEventMs` reconstructs the *rendered* start edge
    // plus the drag delta. When the real start hides inside the hidden hours, the rendered edge
    // is its window-clamped anchor: carry the hidden remainder over to the new anchor so an
    // unmoved drag maps back to the exact original dates instead of silently snapping the start
    // to the window edge.
    const hiddenRemainderMs = surface.getHiddenStartRemainderMs
      ? surface.getHiddenStartRemainderMs(data.start)
      : data.start - surface.offsetToDate(surface.dateToOffset(data.start));

    let newStart = toDate(cursorOffsetMs - data.initialCursorPositionInEventMs) + hiddenRemainderMs;

    // Keep the event inside the window of the surface.
    if (bounds && (surface.isMoveBounded?.(data.start, data.end) ?? true)) {
      newStart = Math.min(Math.max(newStart, bounds.start), bounds.end - eventDurationMs);
    }

    // The event keeps its real duration even when it spans hidden hours, so the real start and
    // end both shift by the same amount as their rendered anchors.
    return { start: newStart, end: newStart + eventDurationMs };
  }

  if (resizeKind.matches(source)) {
    const data = source.dragData;
    if (!data) {
      return undefined;
    }

    // The event keeps one drag precision step of duration: the snap step is also the minimum.
    if (data.side === 'start') {
      let newStart = toDate(cursorOffsetMs - data.initialCursorPositionInEventMs);
      if (bounds) {
        newStart = Math.max(newStart, bounds.start);
      }
      return { start: Math.min(newStart, data.end - precisionMs), end: data.end };
    }

    // The offset from the grab point to the event end is measured on the axis: the real duration
    // would overshoot when the event spans hidden hours.
    const eventAxisDurationMs = surface.dateToOffset(data.end) - surface.dateToOffset(data.start);
    let newEnd = toDate(cursorOffsetMs - data.initialCursorPositionInEventMs + eventAxisDurationMs);
    if (bounds) {
      newEnd = Math.min(newEnd, bounds.end);
    }
    return { start: data.start, end: Math.max(newEnd, data.start + precisionMs) };
  }

  if (schedulerExternalEventKind.matches(source)) {
    return { start: getLinearPointerDate({ target, surface }) };
  }

  return undefined;
}
