import * as React from 'react';
import { useOnMount } from '@base-ui-components/utils/useOnMount';
import { useStore } from '@base-ui-components/utils/store/useStore';
import { EventCalendarViewConfig } from '../models';
import { useEventCalendarStoreContext } from '../use-event-calendar-store-context';

/**
 * Initializes the view on the event calendar.
 * The initialization is only done during the 1st render, the config should be defined statically.
 * ```
 * @param parameters Parameters for the view.
 */
export function useEventCalendarView<P extends object>(config: EventCalendarViewConfig<P>) {
  // Context hooks
  const store = useEventCalendarStoreContext();

  // Selector hooks
  const getVisibleDayParameters = useStore(store, config.getVisibleDayParametersSelector);

  useOnMount(() => store.setViewConfig(config));

  return React.useMemo(
    () => ({
      days: config.getVisibleDays(getVisibleDayParameters),
    }),
    [config, getVisibleDayParameters],
  );
}
