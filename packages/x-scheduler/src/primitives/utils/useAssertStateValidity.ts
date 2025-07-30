'use client';
import { warn } from '../../base-ui-copy/utils/warn';
import { useSelector } from '../../base-ui-copy/utils/store';
import { EventCalendarStore, selectors } from '../use-event-calendar/store';

/**
 * Make sure the state current value doesn't contain incompatible values.
 */
function useAssertStateValidityOutsideOfProduction(store: EventCalendarStore) {
  useSelector(store, () => {
    const views = selectors.views(store.state);
    const view = selectors.view(store.state);

    if (!views.includes(view)) {
      warn(
        [
          `Event Calendar: The current view "${view}" is not compatible with the available views: ${views.join(', ')}.`,
          'Please ensure that the current view is included in the views array.',
        ].join('\n'),
      );
    }

    return null;
  });
}

export const useAssertStateValidity =
  process.env.NODE_ENV === 'production' ? () => {} : useAssertStateValidityOutsideOfProduction;
