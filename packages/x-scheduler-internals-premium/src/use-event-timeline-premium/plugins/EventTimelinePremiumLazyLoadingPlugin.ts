import { SchedulerLazyLoadingPlugin } from '../../internals/plugins/SchedulerLazyLoadingPlugin';
import type {
  EventTimelinePremiumState,
  EventTimelinePremiumParameters,
} from '../EventTimelinePremiumStore.types';
import type { EventTimelinePremiumStore } from '../EventTimelinePremiumStore';
import { eventTimelinePremiumPresetSelectors } from '../../event-timeline-premium-selectors';

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
          const config = eventTimelinePremiumPresetSelectors.config(state);
          return `${state.adapter.getTime(config.start)}|${state.adapter.getTime(config.end)}`;
        },

        (previousKey, nextKey) => {
          if (previousKey === nextKey || !store.parameters.dataSource) {
            return;
          }

          this.scheduleFetch(() => {
            const config = eventTimelinePremiumPresetSelectors.config(store.state);
            return { start: config.start, end: config.end };
          }, previousKey === null);
        },
      ),
    );
  }
}
