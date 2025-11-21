import { useOnMount } from '@base-ui-components/utils/useOnMount';
import { EventCalendarViewConfig } from '../models';
import { useEventCalendarStoreContext } from '../use-event-calendar-store-context';

/**
 * Initializes the view on the event calendar.
 * The initialization is only done during the 1st render, the config should be defined statically.
 * ```
 * @param parameters Parameters for the view.
 */
export function useEventCalendarView(config: EventCalendarViewConfig) {
  const store = useEventCalendarStoreContext();

  useOnMount(() => store.setViewConfig(config));
}
