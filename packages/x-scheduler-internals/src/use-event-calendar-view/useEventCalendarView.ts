import { useOnMount } from '@base-ui/utils/useOnMount';
import { useStore } from '@base-ui/utils/store/useStore';
import { EventCalendarViewConfig } from '../models';
import { useEventCalendarStoreContext } from '../use-event-calendar-store-context';

/**
 * Initializes the view on the event calendar.
 * The initialization is only done during the 1st render, the config should be defined statically.
 * ```
 * @param parameters Parameters for the view.
 */
export function useEventCalendarView(config: EventCalendarViewConfig) {
  // Context hooks
  const store = useEventCalendarStoreContext();

  // Selector hooks
  const days = useStore(store, config.visibleDaysSelector);

  // Feature hooks
  useOnMount(() => store.setViewConfig(config));

  return { days };
}
