import { SchedulerLazyLoadingPlugin } from '../../internals/plugins/SchedulerLazyLoadingPlugin';
import {
  EventTimelinePremiumState,
  EventTimelinePremiumParameters,
} from '../EventTimelinePremiumStore.types';
import type { EventTimelinePremiumStore } from '../EventTimelinePremiumStore';
import { eventTimelinePremiumPresetSelectors } from '../../event-timeline-premium-selectors';

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
        queueMicrotask(() => {
          this.queueDataFetchForRange(range, isInstantLoad);
        });
      },
    );
  }
}
