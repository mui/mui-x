import type { TimeGridEvent } from '../time-grid/event';

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

export function isDraggingTimeGridEvent(data: any): data is TimeGridEvent.EventDragData {
  return data.type === 'event' && data.source === 'TimeGridEvent';
}
