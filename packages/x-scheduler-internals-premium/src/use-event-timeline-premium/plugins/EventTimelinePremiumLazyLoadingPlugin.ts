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
 * is gated on `state.hasInitialized` so it doesn't run against the constructor-only
 * initial state.
 */
export class EventTimelinePremiumLazyLoadingPlugin<
  TEvent extends object,
> extends SchedulerLazyLoadingPlugin<
  TEvent,
  EventTimelinePremiumState,
  EventTimelinePremiumParameters<TEvent, any>
> {
  private isMicrotaskScheduled = false;

  private pendingIsInstantLoad = false;

  constructor(store: EventTimelinePremiumStore<TEvent, any>) {
    super(store);

    store.registerStoreEffect(
      (state) => {
        if (!state.hasInitialized) {
          return null;
        }
        const viewConfig = eventTimelinePremiumPresetSelectors.config(state);
        return `${state.adapter.getTime(viewConfig.start)}|${state.adapter.getTime(viewConfig.end)}`;
      },

      (previousKey, nextKey) => {
        if (previousKey === nextKey || !store.parameters.dataSource) {
          return;
        }

        if (previousKey === null) {
          this.pendingIsInstantLoad = true;
        }
        if (this.isMicrotaskScheduled) {
          return;
        }
        this.isMicrotaskScheduled = true;

        // Defer + coalesce: avoids re-entering the current notification cycle and
        // collapses multiple range-changing updates in the same commit into one fetch.
        queueMicrotask(() => {
          this.isMicrotaskScheduled = false;
          const isInstantLoad = this.pendingIsInstantLoad;
          this.pendingIsInstantLoad = false;

          const viewConfig = eventTimelinePremiumPresetSelectors.config(store.state);
          const range = { start: viewConfig.start, end: viewConfig.end };
          this.queueDataFetchForRange(range, isInstantLoad).catch((error) => {
            if (process.env.NODE_ENV !== 'production') {
              console.error(
                'MUI X Scheduler: unexpected rejection from queueDataFetchForRange',
                error,
              );
            }
          });
        });
      },
    );
  }
}
