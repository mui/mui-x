import type { EventCalendarLocaleText, EventTimelineLocaleText } from '../../models/translations';
import { enUS } from '../../locales/enUS';

export const EVENT_CALENDAR_DEFAULT_LOCALE_TEXT: EventCalendarLocaleText = enUS.components
  .MuiEventCalendar.defaultProps.localeText as EventCalendarLocaleText;

export const EVENT_TIMELINE_DEFAULT_LOCALE_TEXT: EventTimelineLocaleText = enUS.components
  .MuiEventTimeline.defaultProps.localeText as EventTimelineLocaleText;
