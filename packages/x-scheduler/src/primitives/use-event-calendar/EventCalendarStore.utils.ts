import { CalendarPlaceholderOccurrence } from '../models';
import { Adapter } from '../utils/adapter/types';

/**
 * Determines if the placeholder occurrence has changed in a meaningful way that requires updating the store.
 */
export function shouldUpdatePlaceholderOccurrence(
  adapter: Adapter,
  previous: CalendarPlaceholderOccurrence | null,
  next: CalendarPlaceholderOccurrence | null,
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
        next[key as keyof CalendarPlaceholderOccurrence],
        previous?.[key as keyof CalendarPlaceholderOccurrence],
      )
    ) {
      return true;
    }
  }

  return false;
}
