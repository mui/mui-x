import { SchedulerLazyLoadingPlugin } from '../../internals/utils/SchedulerStore/plugins/SchedulerLazyLoadingPlugin';
import { EventCalendarStore } from '../EventCalendarStore';
import { EventCalendarState, EventCalendarParameters } from '../EventCalendarStore.types';

export class EventCalendarLazyLoadingPlugin<
  TEvent extends object,
  TResource extends object,
> extends SchedulerLazyLoadingPlugin<
  TEvent,
  TResource,
  EventCalendarState,
  EventCalendarParameters<TEvent, TResource>
> {
  constructor(store: EventCalendarStore<TEvent, TResource>) {
    super(store);

    store.registerStoreEffect(
      (state) => {
        const visibleDays =
          state.viewConfig?.visibleDaysSelector?.(state as EventCalendarState) ?? [];

        // Build a primitive key that is stable if the visible range didn't change.
        // Adjust the mapping if your visibleDays items have a different shape.
        const visibleDaysKey = visibleDays.map((day) => day.key).join('|');

        return {
          viewConfig: state.viewConfig,
          visibleDaysKey,
          isLoading: state.isLoading,
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
