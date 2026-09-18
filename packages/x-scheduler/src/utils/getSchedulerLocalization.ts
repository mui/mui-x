import type {
  EventCalendarLocaleText,
  EventEditingLocaleText,
  EventTimelineLocaleText,
} from '../models/translations';

export interface SchedulerLocalization {
  components: {
    MuiEventCalendar: {
      defaultProps: {
        localeText: Partial<EventCalendarLocaleText>;
      };
    };
    MuiEventTimeline: {
      defaultProps: {
        localeText: Partial<EventTimelineLocaleText>;
      };
    };
  };
}

export const getSchedulerLocalization = (translations: {
  calendar: Partial<Omit<EventCalendarLocaleText, keyof EventEditingLocaleText>>;
  timeline: Partial<Omit<EventTimelineLocaleText, keyof EventEditingLocaleText>>;
  dialog: Partial<EventEditingLocaleText>;
}): SchedulerLocalization => ({
  components: {
    MuiEventCalendar: {
      defaultProps: {
        localeText: { ...translations.dialog, ...translations.calendar },
      },
    },
    MuiEventTimeline: {
      defaultProps: {
        localeText: { ...translations.dialog, ...translations.timeline },
      },
    },
  },
});
