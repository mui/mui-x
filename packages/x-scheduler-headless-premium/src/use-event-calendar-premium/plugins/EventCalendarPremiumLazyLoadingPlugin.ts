import { SchedulerLazyLoadingPlugin } from '../../internals/plugins/SchedulerLazyLoadingPlugin';
import {
  EventCalendarPremiumState,
  EventCalendarPremiumParameters,
} from '../EventCalendarPremiumStore.types';
import type { EventCalendarPremiumStore } from '../EventCalendarPremiumStore';

export class EventCalendarPremiumLazyLoadingPlugin<
  TEvent extends object,
  TResource extends object,
> extends SchedulerLazyLoadingPlugin<
  TEvent,
  TResource,
  EventCalendarPremiumState,
  EventCalendarPremiumParameters<TEvent, TResource>
> {
  constructor(store: EventCalendarPremiumStore<TEvent, TResource>) {
    super(store);

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
  }
}
