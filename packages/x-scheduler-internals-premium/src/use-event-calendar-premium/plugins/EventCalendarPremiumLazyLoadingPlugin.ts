import type { EventCalendarState } from '@mui/x-scheduler-internals/use-event-calendar';
import { SchedulerLazyLoadingPlugin } from '../../internals/plugins/SchedulerLazyLoadingPlugin';
import {
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

          const visibleDaysKey = visibleDays.map((day) => day.key).join('|');

          return {
            viewConfig: state.viewConfig,
            visibleDaysKey,
            isLoading: state.isLoading,
          };
        },

        (previous, next) => {
          if (previous.visibleDaysKey === next.visibleDaysKey) {
            return;
          }

          const visibleDays =
            next.viewConfig?.visibleDaysSelector?.(store.state as EventCalendarState) ?? [];

          if (!store.parameters.dataSource || visibleDays.length === 0) {
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
          }, previous.viewConfig == null);
        },
      ),
    );
  }
}
