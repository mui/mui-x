import type { Draggable } from '@base-ui/react/draggable';
import { EVENT_DRAG_TAP_SLOP_PX } from '../../constants';
import { schedulerTimeEventResizeKind } from '../../internals/utils/schedulerDrag';

/**
 * A finger or pen resizes a time grid event from the first contact instead of after a hold, since
 * the handle is the only thing under it.
 */
export const TIME_EVENT_RESIZE_ACTIVATION = {
  touch: { type: 'immediate' },
  pen: { type: 'immediate' },
} as const;

/**
 * Whether a time grid resize is a touch or pen tap: the pointer has not left the spot where it
 * started. {@link TIME_EVENT_RESIZE_ACTIVATION} starts those resizes at the first contact, so a tap
 * on the handle is a drag too. Other drags start after some movement or a hold, and the engine
 * reports where they started moving as their start, so the distance from it says nothing about a
 * tap. The mouse always moves before a drag starts.
 */
export function isTimeEventResizeTap(
  source: Draggable.Root.Record,
  location: Draggable.LocationHistory,
) {
  const { initial, current } = location;
  if (!schedulerTimeEventResizeKind.matches(source) || current.input.pointerType === 'mouse') {
    return false;
  }
  return (
    Math.hypot(
      current.input.clientX - initial.input.clientX,
      current.input.clientY - initial.input.clientY,
    ) < EVENT_DRAG_TAP_SLOP_PX
  );
}
