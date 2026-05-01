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
  private timelineStore: EventTimelinePremiumStore<TEvent, any>;

  constructor(store: EventTimelinePremiumStore<TEvent, any>) {
    super(store);
    this.timelineStore = store;

    store.registerStoreEffect(
      (state) => {
        const viewConfig = eventTimelinePremiumPresetSelectors.config(state);
        return `${state.adapter.getTime(viewConfig.start)}|${state.adapter.getTime(viewConfig.end)}`;
      },

      (previousKey, nextKey) => {
        if (previousKey === nextKey || !store.parameters.dataSource) {
          return;
        }

        const viewConfig = eventTimelinePremiumPresetSelectors.config(store.state);
        const range = { start: viewConfig.start, end: viewConfig.end };
        queueMicrotask(() => this.queueDataFetchForRange(range, false));
      },
    );
  }

  public fetchInitialRange = () => {
    if (!this.timelineStore.parameters.dataSource) {
      return;
    }
    const viewConfig = eventTimelinePremiumPresetSelectors.config(this.timelineStore.state);
    queueMicrotask(() =>
      this.queueDataFetchForRange({ start: viewConfig.start, end: viewConfig.end }, true),
    );
  };
}
