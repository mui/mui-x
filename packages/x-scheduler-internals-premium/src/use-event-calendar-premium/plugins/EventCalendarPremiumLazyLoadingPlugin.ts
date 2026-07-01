import type { EventCalendarState } from '@mui/x-scheduler-internals/use-event-calendar';
import { SchedulerLazyLoadingPlugin } from '../../internals/plugins/SchedulerLazyLoadingPlugin';
import type {
  EventCalendarPremiumState,
  EventCalendarPremiumParameters,
} from '../EventCalendarPremiumStore.types';
import type { EventCalendarPremiumStore } from '../EventCalendarPremiumStore';

export class EventCalendarPremiumLazyLoadingPlugin<
  TEvent extends object,
> extends SchedulerLazyLoadingPlugin<
  TEvent,
  EventCalendarPremiumState,
  EventCalendarPremiumParameters<TEvent, any>
> {
  constructor(store: EventCalendarPremiumStore<TEvent, any>) {
    super(store);

    this.disposables.defer(
      store.registerStoreEffect(
        (state) => {
          const visibleDays =
            state.viewConfig?.visibleDaysSelector?.(state as EventCalendarState) ?? [];

          if (visibleDays.length === 0) {
            return null;
          }

          return visibleDays.map((day) => day.key).join('|');
        },

        (previousKey, nextKey) => {
          // `null` means no view is registered, so there is no range to fetch.
          if (previousKey === nextKey || nextKey === null || !store.parameters.dataSource) {
            return;
          }

          this.scheduleFetch(() => {
            const days =
              store.state.viewConfig?.visibleDaysSelector?.(store.state as EventCalendarState) ??
              [];
            return {
              start: days[0].value,
              end: days[days.length - 1].value,
            };
          }, previousKey === null);
        },
      ),
    );
  }
}
