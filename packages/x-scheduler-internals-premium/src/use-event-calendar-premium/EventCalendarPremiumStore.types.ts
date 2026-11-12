import type {
  EventCalendarState,
  EventCalendarParameters,
} from '@mui/x-scheduler-internals/use-event-calendar';
import type { SchedulerLazyLoadingParameters } from '../models';
import type { EventCalendarPremiumStoreFeatures } from '../internals/features/eventCalendarPremiumStoreFeatures';

/**
 * State for the EventCalendarPremium component.
 * Extends EventCalendarState with premium-specific state properties.
 */
export interface EventCalendarPremiumState extends EventCalendarState {}

/**
 * Parameters for the EventCalendarPremium component.
 * Extends EventCalendarParameters with premium-specific parameters.
 */
export interface EventCalendarPremiumParameters<TEvent extends object, TResource extends object>
  extends EventCalendarParameters<TEvent, TResource>, SchedulerLazyLoadingParameters<TEvent> {}

/**
 * Parameters accepted by the calendar store: the component parameters and the store features.
 * @internal
 */
export interface EventCalendarPremiumStoreParameters<
  TEvent extends object,
  TResource extends object,
> extends EventCalendarPremiumParameters<TEvent, TResource> {
  /**
   * Optional features of the store, read only when the store is created.
   */
  storeFeatures?: EventCalendarPremiumStoreFeatures;
}
