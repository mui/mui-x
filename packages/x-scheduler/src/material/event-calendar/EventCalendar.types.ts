import { EventCalendarParameters } from '../../primitives/use-event-calendar';
import { SchedulerTranslations } from '../models/translations';

export interface EventCalendarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    EventCalendarParameters {
  /**
   * Translation overrides for the component's texts.
   */
  translations?: Partial<SchedulerTranslations>;
}
