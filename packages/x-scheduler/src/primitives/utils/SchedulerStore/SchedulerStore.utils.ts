import { CalendarOccurrencePlaceholder } from '../../models';
import { Adapter } from '../../use-adapter/useAdapter.types';

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

  const untypedPrevious = previous as Record<string, any>;
  const untypedNext = next as Record<string, any>;

  for (const key in untypedNext) {
    if (key === 'start' || key === 'end' || key === 'originalStart') {
      if (!adapter.isEqual(untypedNext[key], untypedPrevious[key])) {
        return true;
      }
    } else if (!Object.is(untypedNext[key], untypedPrevious[key])) {
      return true;
    }
  }

  return false;
}
