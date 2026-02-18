import {
  EventCalendarPremiumParameters,
  EventCalendarPremiumStore,
} from '@mui/x-scheduler-headless-premium/use-event-calendar-premium';
import type { SchedulerPublicAPI } from '@mui/x-scheduler-headless/internals';
import { EventCalendarLocaleText } from '@mui/x-scheduler/models';
import type { EventCalendarClasses } from '@mui/x-scheduler/event-calendar';

export type EventCalendarPremiumApiRef<
  TEvent extends object = any,
  TResource extends object = any,
> = React.RefObject<
  Partial<SchedulerPublicAPI<EventCalendarPremiumStore<TEvent, TResource>>> | undefined
>;

export interface EventCalendarPremiumProps<TEvent extends object, TResource extends object>
  extends React.HTMLAttributes<HTMLDivElement>, EventCalendarPremiumParameters<TEvent, TResource> {
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
   * Can be instantiated with `useEventCalendarPremiumApiRef()`.
   */
  apiRef?: EventCalendarPremiumApiRef;
}
