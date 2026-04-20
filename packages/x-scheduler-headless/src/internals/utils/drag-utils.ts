import {
  SchedulerOccurrencePlaceholder,
  SchedulerOccurrencePlaceholderInternalDragOrResize,
} from '../../models';

const INTERNAL_DRAG_OR_RESIZE_PLACEHOLDER_TYPES = new Set(['internal-drag', 'internal-resize']);

export function isInternalDragOrResizePlaceholder(
  placeholder: SchedulerOccurrencePlaceholder | null,
): placeholder is SchedulerOccurrencePlaceholderInternalDragOrResize {
  return placeholder !== null && INTERNAL_DRAG_OR_RESIZE_PLACEHOLDER_TYPES.has(placeholder.type);
}
