import {
  EventCalendarParameters,
  EventCalendarStore,
} from '@mui/x-scheduler-headless/use-event-calendar';
import {
  TimelinePremiumParameters,
  TimelinePremiumStore,
} from '@mui/x-scheduler-headless-premium/use-timeline-premium';
import { adapter } from './adapters';

export const DEFAULT_EVENT_CALENDAR_STATE = new EventCalendarStore({ events: [] }, adapter).state;

export const DEFAULT_TIMELINE_STATE = new TimelinePremiumStore({ events: [] }, adapter).state;

export const getEventCalendarStateFromParameters = <
  TEvent extends object,
  TResource extends object,
>(
  parameters: EventCalendarParameters<TEvent, TResource>,
) => {
  const state = new EventCalendarStore(parameters, adapter).state;
  return state;
};

export const getTimelinePremiumStateFromParameters = <
  TEvent extends object,
  TResource extends object,
>(
  parameters: TimelinePremiumParameters<TEvent, TResource>,
) => {
  const state = new TimelinePremiumStore(parameters, adapter).state;
  return state;
};
