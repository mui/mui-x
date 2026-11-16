export interface DateLocaleTheme {
  components: {
    MuiEventCalendar: {
      defaultProps: {
        dateLocale: string;
      };
    };
    MuiEventTimeline: {
      defaultProps: {
        dateLocale: string;
      };
    };
  };
}

/**
 * Creates the theme options that set the locale of the dates of the Event Calendar and the Event
 * Timeline.
 * @param dateLocale The locale of the dates, as a BCP 47 language tag such as `"fr-FR"`.
 */
export const createDateLocaleTheme = (dateLocale: string): DateLocaleTheme => ({
  components: {
    MuiEventCalendar: {
      defaultProps: {
        dateLocale,
      },
    },
    MuiEventTimeline: {
      defaultProps: {
        dateLocale,
      },
    },
  },
});
