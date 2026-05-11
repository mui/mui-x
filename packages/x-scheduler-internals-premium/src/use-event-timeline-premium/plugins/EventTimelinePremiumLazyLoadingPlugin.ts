import { SchedulerLazyLoadingPlugin } from '../../internals/plugins/SchedulerLazyLoadingPlugin';
import {
  EventTimelinePremiumState,
  EventTimelinePremiumParameters,
} from '../EventTimelinePremiumStore.types';
import type { EventTimelinePremiumStore } from '../EventTimelinePremiumStore';
import { eventTimelinePremiumPresetSelectors } from '../../event-timeline-premium-selectors';

/**
 * Lazy-loading plugin for `EventTimelinePremium`. Watches the visible range derived
 * from the current preset (`{ start, end }`) and triggers a data-source fetch through
 * the shared `SchedulerLazyLoadingPlugin` whenever the range changes. The first fetch
 * is gated on `state.hasMounted` so it doesn't run before React mounts the component.
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

    store.registerStoreEffect(
      (state) => {
        if (!state.hasMounted) {
          return null;
        }
        const viewConfig = eventTimelinePremiumPresetSelectors.config(state);
        return `${state.adapter.getTime(viewConfig.start)}|${state.adapter.getTime(viewConfig.end)}`;
      },

      (previousKey, nextKey) => {
        if (previousKey === nextKey || !store.parameters.dataSource) {
          return;
        }

        const viewConfig = eventTimelinePremiumPresetSelectors.config(store.state);
        const range = { start: viewConfig.start, end: viewConfig.end };
        const isInstantLoad = previousKey === null;
        // Defer the fetch out of the subscriber callback so the state update that
        // triggered this effect commits before the data manager starts mutating state
        // again (otherwise the fetch's `set('isLoading', true)` re-enters the same
        // notification cycle and can interleave with the current update's listeners).
        queueMicrotask(() => {
          this.queueDataFetchForRange(range, isInstantLoad);
        });
      },
    );
  }
}
