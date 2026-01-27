import { EventCalendarParameters } from '@mui/x-scheduler-headless/use-event-calendar';
import { SchedulerTranslations } from '../models/translations';
import type { EventCalendarClasses } from './eventCalendarClasses';

export interface EventCalendarProps<TEvent extends object, TResource extends object>
  extends React.HTMLAttributes<HTMLDivElement>, EventCalendarParameters<TEvent, TResource> {
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<EventCalendarClasses>;
  /**
   * Translation overrides for the component's texts.
   */
  translations?: Partial<SchedulerTranslations>;
}
