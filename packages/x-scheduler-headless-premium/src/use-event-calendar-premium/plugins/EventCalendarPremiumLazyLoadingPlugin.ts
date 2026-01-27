import { SchedulerLazyLoadingPlugin } from '../../internals/plugins/SchedulerLazyLoadingPlugin';
import { EventCalendarState } from '@mui/x-scheduler-headless/use-event-calendar';
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

    store.registerStoreEffect(
      (state) => {
        const visibleDays =
          state.viewConfig?.visibleDaysSelector?.(state as EventCalendarState) ?? [];

        // Build a primitive key that is stable if the visible range didn't change.
        const visibleDaysKey = visibleDays.map((day) => day.key).join('|');

        return {
          viewConfig: state.viewConfig,
          visibleDaysKey,
        };
      },

      (previous, next) => {
        // Bail out if nothing relevant changed.
        if (previous.visibleDaysKey === next.visibleDaysKey) {
          return;
        }

        let isInstantLoad = false;
        if (previous.viewConfig == null) {
          isInstantLoad = true;
        }

        const visibleDays =
          next.viewConfig?.visibleDaysSelector?.(store.state as EventCalendarState) ?? [];

        if (!store.parameters.dataSource || visibleDays.length === 0) {
          return;
        }

        const range = {
          start: visibleDays[0].value,
          end: visibleDays[visibleDays.length - 1].value,
        };

        queueMicrotask(() => this.queueDataFetchForRange(range, isInstantLoad));
      },
    );
  }
}
