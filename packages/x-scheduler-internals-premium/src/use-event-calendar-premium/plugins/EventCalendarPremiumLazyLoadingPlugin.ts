import type { EventCalendarState } from '@mui/x-scheduler-internals/use-event-calendar';
import {
  SchedulerLazyLoadingPlugin,
  toWholeDays,
} from '../../internals/plugins/SchedulerLazyLoadingPlugin';
import { getDateRangeKey } from '../../internals/utils/queue';
import type { DateRange } from '../../internals/utils/queue';
import type {
  EventCalendarPremiumState,
  EventCalendarPremiumParameters,
} from '../EventCalendarPremiumStore.types';
import type { EventCalendarPremiumStore } from '../EventCalendarPremiumStore';

export class EventCalendarPremiumLazyLoadingPlugin<
  TEvent extends object,
> extends SchedulerLazyLoadingPlugin<
  TEvent,
  EventCalendarPremiumState,
  EventCalendarPremiumParameters<TEvent, any>
> {
  constructor(store: EventCalendarPremiumStore<TEvent, any>) {
    super(store);

    this.disposables.defer(
      store.registerStoreEffect(
        (state) => {
          const range = getRangeToFetch(state);
          if (range === null) {
            return null;
          }

          return getDateRangeKey(range);
        },

        (previousKey, nextKey) => {
          // `null` means no view is registered or it has no range to fetch.
          if (previousKey === nextKey || nextKey === null || !store.parameters.dataSource) {
            return;
          }

          this.scheduleFetch(() => getRangeToFetch(store.state), previousKey === null);
        },
      ),
    );
  }
}

/**
 * Returns the range to fetch for the registered view, spanning whole days of the display timezone,
 * or `null` when there is nothing to fetch.
 */
function getRangeToFetch(state: EventCalendarPremiumState): DateRange | null {
  const { viewDefinition, adapter, displayTimezone } = state;
  if (!viewDefinition) {
    return null;
  }

  const calendarState = state as EventCalendarState;
  if (viewDefinition.fetchRangeSelector) {
    const range = viewDefinition.fetchRangeSelector(calendarState);
    return toWholeDays(
      { start: adapter.getTime(range.start), end: adapter.getTime(range.end) },
      displayTimezone,
    );
  }

  const days = viewDefinition.visibleDaysSelector(calendarState);
  if (days.length === 0) {
    return null;
  }
  return toWholeDays(
    { start: days[0].timestamp, end: days[days.length - 1].timestamp },
    displayTimezone,
  );
}
