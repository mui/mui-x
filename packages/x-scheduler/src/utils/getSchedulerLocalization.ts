import type {
  EventCalendarLocaleText,
  EventDialogLocaleText,
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
  calendar: Partial<Omit<EventCalendarLocaleText, keyof EventDialogLocaleText>>;
  timeline: Partial<Omit<EventTimelineLocaleText, keyof EventDialogLocaleText>>;
  dialog: Partial<EventDialogLocaleText>;
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
