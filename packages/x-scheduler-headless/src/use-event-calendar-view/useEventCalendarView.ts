import * as React from 'react';
import { useOnMount } from '@base-ui-components/utils/useOnMount';
import { useStore } from '@base-ui-components/utils/store/useStore';
import { EventCalendarViewConfig } from '../models';
import { useEventCalendarStoreContext } from '../use-event-calendar-store-context';
import { useAdapter } from '../use-adapter';
import {
  schedulerEventSelectors,
  schedulerOtherSelectors,
  schedulerResourceSelectors,
} from '../scheduler-selectors';
import { eventCalendarPreferenceSelectors } from '../event-calendar-selectors';

/**
 * Initializes the view on the event calendar.
 * The initialization is only done during the 1st render, the config should be defined statically.
 * ```
 * @param parameters Parameters for the view.
 */
export function useEventCalendarView(config: EventCalendarViewConfig) {
  // Context hooks
  const adapter = useAdapter();
  const store = useEventCalendarStoreContext();

  // Selector hooks
  const visibleDate = useStore(store, schedulerOtherSelectors.visibleDate);
  const preferences = useStore(store, eventCalendarPreferenceSelectors.all);
  const events = useStore(store, schedulerEventSelectors.processedEventList);
  const visibleResources = useStore(store, schedulerResourceSelectors.visibleMap);
  const resourceParentIds = useStore(store, schedulerResourceSelectors.resourceParentIdLookup);

  useOnMount(() => store.setViewConfig(config));

  return React.useMemo(
    () => ({
      days: config.getVisibleDays({
        adapter,
        visibleDate,
        preferences,
        events,
        visibleResources,
        resourceParentIds,
      }),
    }),
    [adapter, config, visibleDate, preferences, events, visibleResources, resourceParentIds],
  );
}
