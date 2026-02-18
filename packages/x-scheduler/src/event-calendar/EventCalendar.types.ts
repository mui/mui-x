import {
  EventCalendarParameters,
  EventCalendarStore,
} from '@mui/x-scheduler-headless/use-event-calendar';
import type { SchedulerPublicAPI } from '@mui/x-scheduler-headless/internals';
import { EventCalendarLocaleText } from '../models/translations';
import type { EventCalendarClasses } from './eventCalendarClasses';

export type EventCalendarApiRef<
  TEvent extends object = any,
  TResource extends object = any,
> = React.RefObject<Partial<SchedulerPublicAPI<EventCalendarStore<TEvent, TResource>>> | undefined>;

export interface EventCalendarProps<TEvent extends object, TResource extends object>
  extends React.HTMLAttributes<HTMLDivElement>, EventCalendarParameters<TEvent, TResource> {
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<EventCalendarClasses>;
  /**
   * Set the locale text of the Event Calendar.
   * You can find all the translation keys supported in [the source](https://github.com/mui/mui-x/blob/HEAD/packages/x-scheduler/src/models/translations.ts)
   * in the GitHub repository.
   */
  localeText?: Partial<EventCalendarLocaleText>;
  /**
   * The ref object that allows Event Calendar manipulation.
   * Can be instantiated with `useEventCalendarApiRef()`.
   */
  apiRef?: EventCalendarApiRef;
}
