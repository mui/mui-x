import type {
  EventCalendarLocaleText,
  EventEditingLocaleText,
  EventTimelineLocaleText,
  SchedulerEventLocaleText,
} from '../models/translations';

type SharedLocaleTextKey = keyof EventEditingLocaleText | keyof SchedulerEventLocaleText;

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
  calendar: Partial<Omit<EventCalendarLocaleText, SharedLocaleTextKey>>;
  timeline: Partial<Omit<EventTimelineLocaleText, SharedLocaleTextKey>>;
  dialog: Partial<EventEditingLocaleText>;
  event?: Partial<SchedulerEventLocaleText>;
}): SchedulerLocalization => ({
  components: {
    MuiEventCalendar: {
      defaultProps: {
        localeText: { ...translations.dialog, ...translations.event, ...translations.calendar },
      },
    },
    MuiEventTimeline: {
      defaultProps: {
        localeText: { ...translations.dialog, ...translations.event, ...translations.timeline },
      },
    },
  },
});
