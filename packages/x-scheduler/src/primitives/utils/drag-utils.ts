import { SchedulerValidDate } from '../models';
import type { DayGridEvent } from '../day-grid/event';
import type { TimeGridEvent } from '../time-grid/event';
import type { TimeGridEventResizeHandler } from '../time-grid/event-resize-handler';
import { Adapter } from './adapter/types';

export const EVENT_DRAG_PRECISION_MINUTE = 15;
export const EVENT_DRAG_PRECISION_MS = EVENT_DRAG_PRECISION_MINUTE * 60 * 1000;

export function isDraggingTimeGridEvent(data: any): data is TimeGridEvent.DragData {
  return data.source === 'TimeGridEvent';
}

export function isDraggingTimeGridEventResizeHandler(
  data: any,
): data is TimeGridEventResizeHandler.DragData {
  return data.source === 'TimeGridEventResizeHandler';
}

export function isDraggingDayGridEvent(data: any): data is DayGridEvent.DragData {
  return data.source === 'DayGridEvent';
}

export function addRoundedOffsetToDate(
  parameters: AddRoundedOffsetToDateParameters,
): SchedulerValidDate {
  const { date, offsetMs, adapter } = parameters;

  const roundedOffset = Math.round(offsetMs / EVENT_DRAG_PRECISION_MS) * EVENT_DRAG_PRECISION_MS;

  // TODO: Use "addMilliseconds" instead of "addSeconds" when available in the adapter
  return adapter.addSeconds(date, roundedOffset / 1000);
}

interface AddRoundedOffsetToDateParameters {
  adapter: Adapter;
  date: SchedulerValidDate;
  offsetMs: number;
}
