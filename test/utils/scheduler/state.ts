import {
  EventCalendarParameters,
  EventCalendarStore,
} from '@mui/x-scheduler-headless/use-event-calendar';
import { TimelineParameters, TimelineStore } from '@mui/x-scheduler-headless-premium/use-timeline';
import { adapter } from './adapters';

export const DEFAULT_EVENT_CALENDAR_STATE = new EventCalendarStore({ events: [] }, adapter).state;

export const DEFAULT_TIMELINE_STATE = new TimelineStore({ events: [] }, adapter).state;

export const getEventCalendarStateFromParameters = <
  TEvent extends object,
  TResource extends object,
>(
  parameters: EventCalendarParameters<TEvent, TResource>,
) => {
  const state = new EventCalendarStore(parameters, adapter).state;
  return state;
};

export const getTimelineStateFromParameters = <TEvent extends object, TResource extends object>(
  parameters: TimelineParameters<TEvent, TResource>,
) => {
  const state = new TimelineStore(parameters, adapter).state;
  return state;
};
