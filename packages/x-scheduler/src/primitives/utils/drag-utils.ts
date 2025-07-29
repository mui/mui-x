import { SchedulerValidDate } from '../models';
import type { TimeGridEvent } from '../time-grid/event';
import type { TimeGridEventResizeHandler } from '../time-grid/event-resize-handler';
import { Adapter } from './adapter/types';

export const EVENT_DRAG_PRECISION_MINUTE = 15;

export const EVENT_DRAG_PRECISION_MS = EVENT_DRAG_PRECISION_MINUTE * 60 * 1000;

export function getCursorPositionRelativeToElement({
  ref,
  input,
}: {
  input: { clientY: number };
  ref: React.RefObject<HTMLElement | null>;
}) {
  if (!ref.current) {
    return { y: 0 };
  }

  const clientY = input.clientY;
  const pos = ref.current.getBoundingClientRect();
  const y = clientY - pos.y;

  return { y };
}

export function isDraggingTimeGridEvent(data: any): data is TimeGridEvent.DragData {
  return data.source === 'TimeGridEvent';
}

export function isDraggingTimeGridEventResizeHandler(
  data: any,
): data is TimeGridEventResizeHandler.DragData {
  return data.source === 'TimeGridEventResizeHandler';
}

export function createDateFromPositionInCollection(
  parameters: CreateDateFromPositionInCollectionParameters,
): SchedulerValidDate {
  const { adapter, collectionStart, collectionEnd, position } = parameters;

  // TODO: Avoid JS date conversion
  const getTimestamp = (date: SchedulerValidDate) => adapter.toJsDate(date).getTime();

  const collectionStartTimestamp = getTimestamp(collectionStart);
  const collectionEndTimestamp = getTimestamp(collectionEnd);
  const collectionDurationMs = collectionEndTimestamp - collectionStartTimestamp;

  const positionInCollectionMs = collectionDurationMs * position;
  const roundedPositionInCollectionMs =
    Math.round(positionInCollectionMs / EVENT_DRAG_PRECISION_MS) * EVENT_DRAG_PRECISION_MS;

  // TODO: Use "addMilliseconds" instead of "addSeconds" when available in the adapter
  return adapter.addSeconds(collectionStart, roundedPositionInCollectionMs / 1000);
}

interface CreateDateFromPositionInCollectionParameters {
  adapter: Adapter;
  collectionStart: SchedulerValidDate;
  collectionEnd: SchedulerValidDate;
  /**
   * Position to convert relative to the collection.
   * Must be a value between 0 and 1, where 0 is the start of the collection and 1 is the end.
   */
  position: number;
}
