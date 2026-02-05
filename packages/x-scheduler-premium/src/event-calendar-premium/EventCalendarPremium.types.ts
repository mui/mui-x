import { EventCalendarPremiumParameters } from '@mui/x-scheduler-headless-premium/use-event-calendar-premium';
import { SchedulerTranslations } from '@mui/x-scheduler/models';
import type { EventCalendarClasses } from '@mui/x-scheduler/event-calendar';

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
}
