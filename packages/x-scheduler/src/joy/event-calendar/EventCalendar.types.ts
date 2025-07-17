import { CalendarEvent } from '../models/events';
import { CalendarResource } from '../models/resource';
import { EventCalendarTranslations } from '../models/translations';

export interface EventCalendarProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The events to render in the calendar.
   */
  events: CalendarEvent[];
  /**
   * Callback fired when some event of the calendar change.
   */
  onEventsChange?: (value: CalendarEvent[]) => void;
  /**
   * Translation overrides for the component's texts.
   */
  translations?: Partial<EventCalendarTranslations>;
  /**
   * The resources that can be assigned to events.
   */
  resources?: CalendarResource[];
}
