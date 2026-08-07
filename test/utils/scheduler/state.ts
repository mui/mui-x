import {
  EventCalendarParameters,
  EventCalendarStore,
} from '@mui/x-scheduler-internals/use-event-calendar';
import {
  EventTimelinePremiumStoreParameters,
  EventTimelinePremiumStore,
} from '@mui/x-scheduler-internals-premium/use-event-timeline-premium';
import { adapter } from './adapters';
import { ResourceBuilder } from './resource-builder';

export const DEFAULT_EVENT_CALENDAR_STATE = new EventCalendarStore({ events: [] }, adapter).state;

export const DEFAULT_EVENT_TIMELINE_PREMIUM_STATE = new EventTimelinePremiumStore(
  { events: [], resources: [ResourceBuilder.new().build()] },
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
  parameters: EventTimelinePremiumStoreParameters<TEvent, TResource>,
) => {
  const state = new EventTimelinePremiumStore(parameters, adapter).state;
  return state;
};
