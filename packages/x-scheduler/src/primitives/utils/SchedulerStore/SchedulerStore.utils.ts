import { CalendarOccurrencePlaceholder } from '../../models';
import { Adapter } from '../adapter/types';

/**
 * Determines if the occurrence placeholder has changed in a meaningful way that requires updating the store.
 */
export function shouldUpdateOccurrencePlaceholder(
  adapter: Adapter,
  previous: CalendarOccurrencePlaceholder | null,
  next: CalendarOccurrencePlaceholder | null,
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
        next[key as keyof CalendarOccurrencePlaceholder],
        previous?.[key as keyof CalendarOccurrencePlaceholder],
      )
    ) {
      return true;
    }
  }

  return false;
}
