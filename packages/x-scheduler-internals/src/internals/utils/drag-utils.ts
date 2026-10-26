import type {
  SchedulerOccurrencePlaceholder,
  SchedulerOccurrencePlaceholderInternalDragOrResize,
} from '../../models';
import { EVENT_DRAG_PRECISION_MS } from '../../constants';

const INTERNAL_DRAG_OR_RESIZE_PLACEHOLDER_TYPES = new Set(['internal-drag', 'internal-resize']);

export function isInternalDragOrResizePlaceholder(
  placeholder: SchedulerOccurrencePlaceholder | null,
): placeholder is SchedulerOccurrencePlaceholderInternalDragOrResize {
  return placeholder !== null && INTERNAL_DRAG_OR_RESIZE_PLACEHOLDER_TYPES.has(placeholder.type);
}

/**
 * Rounds an offset in milliseconds to the precision of the drag and drop.
 */
export function roundToDragPrecision(offsetMs: number): number {
  return Math.round(offsetMs / EVENT_DRAG_PRECISION_MS) * EVENT_DRAG_PRECISION_MS;
}
