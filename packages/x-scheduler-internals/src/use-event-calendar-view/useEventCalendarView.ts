import { useOnMount } from '@base-ui/utils/useOnMount';
import { useStore } from '@base-ui/utils/store';
import type { EventCalendarViewDefinition } from '../models';
import { useEventCalendarStoreContext } from '../use-event-calendar-store-context';

/**
 * Initializes the view on the event calendar.
 * The initialization is only done during the 1st render, the definition should be defined statically.
 * ```
 * @param parameters Parameters for the view.
 */
export function useEventCalendarView(definition: EventCalendarViewDefinition) {
  // Context hooks
  const store = useEventCalendarStoreContext();

  // Selector hooks
  const days = useStore(store, definition.visibleDaysSelector);

  // Feature hooks
  useOnMount(() => store.setViewDefinition(definition));

  return { days };
}
