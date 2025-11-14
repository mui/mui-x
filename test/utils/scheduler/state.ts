import {
  EventCalendarParameters,
  EventCalendarStore,
} from '@mui/x-scheduler-headless/use-event-calendar';
import { adapter } from './adapters';

export const DEFAULT_EVENT_CALENDAR_STATE = new EventCalendarStore({ events: [] }, adapter).state;

export const getEventCalendarStateFromParameters = <
  TEvent extends object,
  TResource extends object,
>(
  parameters: EventCalendarParameters<TEvent, TResource>,
) => {
  const state = new EventCalendarStore(parameters, adapter).state;
  return state;
};
