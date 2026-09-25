import type {
  EventCalendarLocaleText,
  EventEditingLocaleText,
  EventTimelineLocaleText,
  SchedulerEventLocaleText,
} from '../models/translations';

type SharedLocaleTextKey = keyof EventEditingLocaleText | keyof SchedulerEventLocaleText;

export type SchedulerDialogTranslations = Partial<EventEditingLocaleText>;
export type SchedulerEventTranslations = Partial<SchedulerEventLocaleText>;
export type SchedulerCalendarTranslations = Partial<
  Omit<EventCalendarLocaleText, SharedLocaleTextKey>
>;
export type SchedulerTimelineTranslations = Partial<
  Omit<EventTimelineLocaleText, SharedLocaleTextKey>
>;

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
  dialog: SchedulerDialogTranslations;
  event: SchedulerEventTranslations;
  calendar: SchedulerCalendarTranslations;
  timeline: SchedulerTimelineTranslations;
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
