import { CalendarDraggedOccurrence } from '../models';
import { Adapter } from '../utils/adapter/types';

/**
 * Determines if the dragged occurrence has changed in a meaningful way that requires updating the store.
 */
export function shouldUpdateDraggedOccurrence(
  adapter: Adapter,
  previous: CalendarDraggedOccurrence | null,
  next: CalendarDraggedOccurrence | null,
): boolean {
  if (next == null || previous == null) {
    return next !== previous;
  }

  for (const key in next) {
    if (key === 'start' || key === 'end' || key === 'originalStart') {
      if (!adapter.isEqual(next[key], previous[key])) {
        return true;
      }
    } else if (
      !Object.is(
        next[key as keyof CalendarDraggedOccurrence],
        previous?.[key as keyof CalendarDraggedOccurrence],
      )
    ) {
      return true;
    }
  }

  return false;
}
