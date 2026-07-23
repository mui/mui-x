import type { FocusedItemIdentifier } from '../../../../models/seriesType';
import type { ChartSeriesType } from '../../../../models/seriesType/config';
import type {
  ItemActivationHandler,
  ItemActivationScope,
} from './useChartKeyboardNavigation.types';

export type ItemActivationRegistration = {
  scope: ItemActivationScope;
  handler: ItemActivationHandler;
};

export function isItemActivationKey(event: KeyboardEvent): boolean {
  return event.key === 'Enter' || event.key === ' ';
}

function getScopeSpecificity(
  scope: ItemActivationScope,
  item: FocusedItemIdentifier<ChartSeriesType>,
): number | null {
  if (scope.type !== undefined && scope.type !== item.type) {
    return null;
  }

  if (scope.seriesId !== undefined && (!('seriesId' in item) || scope.seriesId !== item.seriesId)) {
    return null;
  }

  return (scope.type === undefined ? 0 : 1) + (scope.seriesId === undefined ? 0 : 1);
}

/**
 * Returns the handler with the most specific scope matching the item, or `null` when none matches.
 */
export function findItemActivationHandler(
  registrations: Iterable<ItemActivationRegistration>,
  item: FocusedItemIdentifier<ChartSeriesType>,
): ItemActivationHandler | null {
  let bestHandler: ItemActivationHandler | null = null;
  let bestSpecificity = -1;

  for (const registration of registrations) {
    const specificity = getScopeSpecificity(registration.scope, item);

    if (specificity !== null && specificity > bestSpecificity) {
      bestHandler = registration.handler;
      bestSpecificity = specificity;
    }
  }

  return bestHandler;
}
