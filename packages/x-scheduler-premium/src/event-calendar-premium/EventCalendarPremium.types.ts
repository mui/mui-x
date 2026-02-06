import {
  EventCalendarPremiumParameters,
  EventCalendarPremiumStore,
} from '@mui/x-scheduler-headless-premium/use-event-calendar-premium';
import type { SchedulerPublicAPI } from '@mui/x-scheduler-headless/internals';
import { SchedulerTranslations } from '@mui/x-scheduler/models';
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
   * Translation overrides for the component's texts.
   */
  translations?: Partial<SchedulerTranslations>;
  /**
   * The ref object that allows Event Calendar manipulation.
   * Can be instantiated with `useEventCalendarPremiumApiRef()`.
   */
  apiRef?: EventCalendarPremiumApiRef;
}
