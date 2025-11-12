import { useIsoLayoutEffect } from '@base-ui-components/utils/useIsoLayoutEffect';
import { EventCalendarViewConfig } from '../models';
import { useEventCalendarStoreContext } from '../use-event-calendar-store-context';

/**
 * Defines the view on the event calendar.
 */
export function useEventCalendarView(config: EventCalendarViewConfig) {
  const store = useEventCalendarStoreContext();

  useIsoLayoutEffect(() => {
    return store.setViewConfig(config);
  }, [store, config]);
}
