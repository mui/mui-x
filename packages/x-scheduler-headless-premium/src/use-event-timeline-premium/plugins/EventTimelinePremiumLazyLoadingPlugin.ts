import { SchedulerLazyLoadingPlugin } from '../../internals/plugins/SchedulerLazyLoadingPlugin';
import {
  EventTimelinePremiumState,
  EventTimelinePremiumParameters,
} from '../EventTimelinePremiumStore.types';
import type { EventTimelinePremiumStore } from '../EventTimelinePremiumStore';

export class EventTimelinePremiumLazyLoadingPlugin<
  TEvent extends object,
  TResource extends object,
> extends SchedulerLazyLoadingPlugin<
  TEvent,
  TResource,
  EventTimelinePremiumState,
  EventTimelinePremiumParameters<TEvent, TResource>
> {
  private initialLoadTriggered = false;

  private parentQueueDataFetchForRange: typeof this.queueDataFetchForRange;

  constructor(store: EventTimelinePremiumStore<TEvent, TResource>) {
    super(store);

    // Store reference to parent method before overriding
    this.parentQueueDataFetchForRange = this.queueDataFetchForRange;

    // Override to track initial load
    this.queueDataFetchForRange = async (range, immediate = false) => {
      this.initialLoadTriggered = true;
      return this.parentQueueDataFetchForRange(range, immediate);
    };

    // Subscribe to viewConfigChanged event to trigger data fetches
    store.subscribeEvent('viewConfigChanged', (params) => {
      if (!store.parameters.dataSource || params.visibleDays.length === 0) {
        return;
      }

      const range = {
        start: params.visibleDays[0].value,
        end: params.visibleDays[params.visibleDays.length - 1].value,
      };

      queueMicrotask(() => this.queueDataFetchForRange(range, params.isInitialLoad));
    });

    // Trigger initial load if dataSource is provided
    // This is done in the plugin constructor to ensure the plugin is fully initialized
    if (store.parameters.dataSource) {
      this.triggerInitialLoad(store);
    }
  }

  /**
   * Triggers the initial data load for the timeline.
   * Uses queueMicrotask to ensure the plugin subscription is set up first.
   */
  private triggerInitialLoad(store: EventTimelinePremiumStore<TEvent, TResource>) {
    // Use queueMicrotask to defer execution until after the current synchronous code completes
    // This ensures that any direct queueDataFetchForRange calls from tests run first
    queueMicrotask(() => {
      // Only trigger if not already done (e.g., by a direct queueDataFetchForRange call)
      if (this.initialLoadTriggered) {
        return;
      }
      this.initialLoadTriggered = true;

      // Emit viewConfigChanged to trigger the subscription handler
      store.emitInitialViewConfigChanged();
    });
  }
}
