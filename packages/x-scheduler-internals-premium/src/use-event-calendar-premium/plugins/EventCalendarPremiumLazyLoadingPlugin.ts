import type { EventCalendarState } from '@mui/x-scheduler-internals/use-event-calendar';
import { eventCalendarAgendaSelectors } from '@mui/x-scheduler-internals/event-calendar-selectors';
import type { TemporalSupportedObject } from '@mui/x-scheduler-internals/models';
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
          if (!state.viewDefinition) {
            return null;
          }

          const range = getRangeToFetch(state);
          return `${state.adapter.getTime(range.start)}:${state.adapter.getTime(range.end)}`;
        },

        (previousKey, nextKey) => {
          // `null` means no view is registered, so there is no range to fetch.
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
 * Returns the range covered by the visible days of the registered view.
 * The agenda view has no visible day when it hides the empty days and no loaded event falls in its
 * horizon, so it falls back to the default agenda window to keep fetching on navigation.
 * That window is the same list the agenda shows while loading, so the range stays stable across
 * `isLoading` flips.
 */
function getRangeToFetch(state: EventCalendarPremiumState): {
  start: TemporalSupportedObject;
  end: TemporalSupportedObject;
} {
  const calendarState = state as EventCalendarState;
  const visibleDays = state.viewDefinition?.visibleDaysSelector(calendarState) ?? [];
  const days =
    visibleDays.length > 0
      ? visibleDays
      : eventCalendarAgendaSelectors.defaultVisibleDays(calendarState);

  return { start: days[0].value, end: days[days.length - 1].value };
}
