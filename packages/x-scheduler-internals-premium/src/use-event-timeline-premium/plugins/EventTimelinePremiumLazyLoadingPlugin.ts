import { SchedulerLazyLoadingPlugin } from '../../internals/plugins/SchedulerLazyLoadingPlugin';
import type {
  EventTimelinePremiumState,
  EventTimelinePremiumParameters,
} from '../EventTimelinePremiumStore.types';
import type { EventTimelinePremiumStore } from '../EventTimelinePremiumStore';
import { eventTimelinePremiumPresetSelectors } from '../../event-timeline-premium-selectors';
import { getDateRangeKey } from '../../internals/utils/queue';
import type { DateRange } from '../../internals/utils/queue';

/**
 * The first fetch is gated on `state.hasInitialized`: without it, the selector
 * would return the same key at construction and at mount (defaults are enough
 * to compute it), so `registerStoreEffect` would never fire its first transition
 * and the initial fetch would never trigger.
 */
export class EventTimelinePremiumLazyLoadingPlugin<
  TEvent extends object,
> extends SchedulerLazyLoadingPlugin<
  TEvent,
  EventTimelinePremiumState,
  EventTimelinePremiumParameters<TEvent, any>
> {
  constructor(store: EventTimelinePremiumStore<TEvent, any>) {
    super(store);

    this.disposables.defer(
      store.registerStoreEffect(
        (state) => {
          if (!state.hasInitialized) {
            return null;
          }
          return getDateRangeKey(getRangeToFetch(state));
        },

        (previousKey, nextKey) => {
          if (previousKey === nextKey || !store.parameters.dataSource) {
            return;
          }

          this.scheduleFetch(() => getRangeToFetch(store.state), previousKey === null);
        },
      ),
    );
  }
}

/**
 * Returns the days of the visible range of the preset.
 */
function getRangeToFetch(state: EventTimelinePremiumState): DateRange {
  const axis = eventTimelinePremiumPresetSelectors.axis(state);
  return { start: axis.start, end: axis.end };
}
