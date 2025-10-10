import { EventCalendarParameters } from '@mui/x-scheduler-headless/use-event-calendar';
import { SchedulerTranslations } from '../models/translations';

export interface EventCalendarProps<EventModel extends {}>
  extends React.HTMLAttributes<HTMLDivElement>,
    EventCalendarParameters<EventModel> {
  /**
   * Translation overrides for the component's texts.
   */
  translations?: Partial<SchedulerTranslations>;
}
