import { EventCalendarParameters } from '@mui/x-scheduler-headless/use-event-calendar';
import { SchedulerTranslations } from '../models/translations';

export interface EventCalendarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    EventCalendarParameters {
  /**
   * Translation overrides for the component's texts.
   */
  translations?: Partial<SchedulerTranslations>;
}
