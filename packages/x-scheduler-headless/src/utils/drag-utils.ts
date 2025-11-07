import {
  CalendarOccurrencePlaceholder,
  CalendarOccurrencePlaceholderInternalDragOrResize,
} from '../models';

const INTERNAL_DRAG_OR_RESIZE_PLACEHOLDER_TYPES = new Set(['internal-drag', 'internal-resize']);

export function isInternalDragOrResizePlaceholder(
  placeholder: CalendarOccurrencePlaceholder | null,
): placeholder is CalendarOccurrencePlaceholderInternalDragOrResize {
  return placeholder !== null && INTERNAL_DRAG_OR_RESIZE_PLACEHOLDER_TYPES.has(placeholder.type);
}
