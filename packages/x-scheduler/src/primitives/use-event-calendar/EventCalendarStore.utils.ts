import { createSelectorMemoized, Store } from '@base-ui-components/utils/store';
import { EventCalendarState as State } from './EventCalendarStore.types';
import { innerGetEventOccurrencesGroupedByDay } from '../use-event-occurrences-grouped-by-day';
import { selectors } from './EventCalendarStore.selectors';
import { EventCalendarStore } from './EventCalendarStore';

function runStoreEffect<State, Value>(
  store: Store<State>,
  selector: (state: State) => Value,
  effect: (previous: Value, next: Value) => void,
) {
  let previousState = selector(store.getSnapshot());
  store.subscribe((state) => {
    const nextState = selector(state);
    effect(previousState, nextState);
    previousState = nextState;
  });
}

function syncEventOccurrencesMap(store: EventCalendarStore) {
  runStoreEffect(
    store,
    createSelectorMemoized(
      selectors.events,
      selectors.visibleDate,
      selectors.visibleResourcesMap,
      (state: State) => state.adapter,
      (state: State) => state.viewConfig,
      (state: State) => state.preferences.showWeekends,
      (events, visibleDate, visibleResourcesMap, adapter, viewConfig, showWeekends) => {
        if (viewConfig == null) {
          return null;
        }

        const visibleDays = viewConfig.getVisibleDays({
          adapter,
          visibleDate,
          showWeekends,
        });

        return innerGetEventOccurrencesGroupedByDay(
          adapter,
          visibleDays,
          viewConfig.renderEventIn,
          events,
          visibleResourcesMap,
        );
      },
    ),
    (_previous, next) => {
      if (next == null) {
        return;
      }

      // TODO: Remove queueMicrotask once the state handles nested updates
      queueMicrotask(() => store.set('tempEventOccurrencesMap', next));
    },
  );
}

export function runEventCalendarStoreEffects(store: EventCalendarStore) {
  syncEventOccurrencesMap(store);
}
