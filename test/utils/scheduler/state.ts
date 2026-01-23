import {
  EventCalendarParameters,
  EventCalendarStore,
} from '@mui/x-scheduler-headless/use-event-calendar';
import {
  EventTimelinePremiumParameters,
  EventTimelinePremiumStore,
} from '@mui/x-scheduler-headless-premium/use-event-timeline-premium';
import { adapter } from './adapters';

export const DEFAULT_EVENT_CALENDAR_STATE = new EventCalendarStore({ events: [] }, adapter).state;

export const DEFAULT_EVENT_TIMELINE_PREMIUM_STATE = new EventTimelinePremiumStore(
  { events: [] },
  adapter,
).state;

export const getEventCalendarStateFromParameters = <
  TEvent extends object,
  TResource extends object,
>(
  parameters: EventCalendarParameters<TEvent, TResource>,
) => {
  const state = new EventCalendarStore(parameters, adapter).state;
  return state;
};

export const getEventTimelinePremiumStateFromParameters = <
  TEvent extends object,
  TResource extends object,
>(
  parameters: EventTimelinePremiumParameters<TEvent, TResource>,
) => {
  const state = new EventTimelinePremiumStore(parameters, adapter).state;
  return state;
};
