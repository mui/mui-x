import * as React from 'react';
import { useIsoLayoutEffect } from '@base-ui-components/utils/useIsoLayoutEffect';
import { useStore } from '@base-ui-components/utils/store';
import { CalendarViewConfig } from '../models';
import { useEventCalendarStoreContext } from './useEventCalendarStoreContext';
import { selectors } from '../use-event-calendar';
import { useAdapter } from './adapter/useAdapter';

/**
 * Initializes the view on the event calendar.
 * The initialization is only done during the 1st render. If you need to access variables in a callback you can use a ref:
 * ```ts
 * const { daysPerPage = 12 } = props;
 * const daysPerPageRef = React.useRef(daysPerPage);
 * useInitializeView(() => ({
 *   siblingVisibleDateGetter: (date, delta) => adapter.addDays(date, daysPerPageRef.current * delta),
 *  }));
 * ```
 * @param parameters Parameters for the view.
 */
export function useInitializeView(parameters: CalendarViewConfig) {
  const adapter = useAdapter();
  const store = useEventCalendarStoreContext();
  const visibleDate = useStore(store, selectors.visibleDate);
  const preferences = useStore(store, selectors.preferences);

  const initialParameters = React.useRef(parameters);
  useIsoLayoutEffect(() => {
    return store.setViewConfig(initialParameters.current);
  }, [store]);

  return React.useMemo(
    () => ({
      days: initialParameters.current.getVisibleDays({
        adapter,
        visibleDate,
        showWeekends: preferences.showWeekNumber,
      }),
    }),
    [adapter, visibleDate, preferences.showWeekNumber],
  );
}
