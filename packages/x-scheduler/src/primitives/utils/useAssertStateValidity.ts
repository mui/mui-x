'use client';
import { useStore } from '@base-ui-components/utils/store';
import { warn } from '@base-ui-components/utils/warn';
import { selectors } from '../use-event-calendar/store';
import type { useEventCalendar } from '../use-event-calendar';

/**
 * Makes sure the state current value doesn't contain incompatible values.
 */
function useAssertStateValidityOutsideOfProduction(store: useEventCalendar.Store) {
  useStore(store, () => {
    const calendarViews = selectors.calendarViews(store.state);
    const view = selectors.view(store.state);

    if (!calendarViews.includes(view)) {
      warn(
        [
          `Event Calendar: The current view "${view}" is not compatible with the available calendarViews: ${calendarViews.join(', ')}.`,
          'Please ensure that the current view is included in the calendarViews array.',
        ].join('\n'),
      );
    }

    return null;
  });
}

export const useAssertStateValidity =
  process.env.NODE_ENV === 'production' ? () => {} : useAssertStateValidityOutsideOfProduction;
