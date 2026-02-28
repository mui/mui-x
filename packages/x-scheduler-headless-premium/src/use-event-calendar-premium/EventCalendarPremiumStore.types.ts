import {
  EventCalendarState,
  EventCalendarParameters,
} from '@mui/x-scheduler-headless/use-event-calendar';

/**
 * State for the EventCalendarPremium component.
 * Extends EventCalendarState with premium-specific state properties.
 */
export interface EventCalendarPremiumState extends EventCalendarState {}

/**
 * Parameters for the EventCalendarPremium component.
 * Extends EventCalendarParameters with premium-specific parameters.
 */
export interface EventCalendarPremiumParameters<
  TEvent extends object,
  TResource extends object,
> extends EventCalendarParameters<TEvent, TResource> {}
