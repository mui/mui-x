import type { EventCalendarState } from '@mui/x-scheduler-internals/use-event-calendar';
import type { EventCalendarVisibleRange } from '@mui/x-scheduler-internals/models';
import { SchedulerLazyLoadingPlugin } from '../../internals/plugins/SchedulerLazyLoadingPlugin';
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

          return `${state.adapter.getTime(range.start)}:${state.adapter.getTime(range.end)}`;
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
 * Returns the range to fetch for the registered view, or `null` when there is nothing to fetch.
 */
function getRangeToFetch(state: EventCalendarPremiumState): EventCalendarVisibleRange | null {
  const { viewDefinition, adapter } = state;
  if (!viewDefinition) {
    return null;
  }

  const calendarState = state as EventCalendarState;
  if (viewDefinition.visibleRangeSelector) {
    return viewDefinition.visibleRangeSelector(calendarState);
  }

  const days = viewDefinition.visibleDaysSelector(calendarState);
  if (days.length === 0) {
    return null;
  }

  return { start: adapter.startOfDay(days[0].value), end: days[days.length - 1].value };
}
