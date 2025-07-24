import type { TimeGridEvent } from '../time-grid/event';
import type { TimeGridEventResizeHandler } from '../time-grid/event-resize-handler';

export const EVENT_DRAG_PRECISION_MINUTE = 15;

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
