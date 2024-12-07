import { createTheme } from '@mui/material/styles';
import { dateRangeCalendarClasses } from '../DateRangeCalendar';
import { dateRangePickerToolbarClasses } from '../DateRangePicker';
import { dateRangePickerDayClasses } from '../DateRangePickerDay';
import { multiInputRangeFieldClasses } from '../MultiInputRangeField';
import {
  dateTimeRangePickerTabsClasses,
  dateTimeRangePickerToolbarClasses,
} from '../DateTimeRangePicker';

createTheme({
  components: {
    MuiDateRangeCalendar: {
      defaultProps: {
        calendars: 3,
        // @ts-expect-error invalid MuiDateRangeCalendar prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: {
          backgroundColor: 'red',
          [`.${dateRangeCalendarClasses.monthContainer}`]: {
            backgroundColor: 'green',
          },
        },
        // @ts-expect-error invalid MuiDateRangeCalendar class key
        content: {
          backgroundColor: 'blue',
        },
      },
    },

    MuiDateRangePickerDay: {
      defaultProps: {
        color: 'red',
        // @ts-expect-error invalid MuiDateRangePickerDay prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: {
          backgroundColor: 'red',
          [`.${dateRangePickerDayClasses.day}`]: {
            backgroundColor: 'green',
          },
        },
        // @ts-expect-error invalid MuiDateTimePickerToolbar class key
        content: {
          backgroundColor: 'blue',
        },
      },
    },

    MuiDateTimeRangePickerTabs: {
      defaultProps: {
        className: 'empty',
        // @ts-expect-error invalid MuiDateTimeRangePickerTabs prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: {
          backgroundColor: 'red',
          [`.${dateTimeRangePickerTabsClasses.filler}`]: {
            backgroundColor: 'green',
          },
        },
        // @ts-expect-error invalid MuiDateTimeRangePickerTabs class key
        content: {
          backgroundColor: 'blue',
        },
      },
    },

    MuiDateRangePickerToolbar: {
      defaultProps: {
        toolbarPlaceholder: 'empty',
        // @ts-expect-error invalid MuiDateRangePickerToolbar prop
        view: 'day',
      },
      styleOverrides: {
        root: {
          backgroundColor: 'red',
          [`.${dateRangePickerToolbarClasses.container}`]: {
            backgroundColor: 'green',
          },
        },
        // @ts-expect-error invalid MuiDateRangePickerToolbar class key
        content: {
          backgroundColor: 'blue',
        },
      },
    },

    MuiDateTimeRangePickerToolbar: {
      defaultProps: {
        toolbarPlaceholder: 'empty',
        // @ts-expect-error invalid MuiDateTimeRangePickerToolbar prop
        view: 'day',
      },
      styleOverrides: {
        root: {
          backgroundColor: 'red',
          [`.${dateTimeRangePickerToolbarClasses.startToolbar}`]: {
            backgroundColor: 'green',
          },
        },
        // @ts-expect-error invalid MuiDateTimeRangePickerToolbar class key
        content: {
          backgroundColor: 'blue',
        },
      },
    },

    // Multi input range fields
    MuiMultiInputRangeField: {
      defaultProps: {
        disabled: true,
        // @ts-expect-error invalid MuiMultiInputRangeField prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: {
          backgroundColor: 'red',
          [`.${multiInputRangeFieldClasses.separator}`]: {
            backgroundColor: 'green',
          },
        },
        // @ts-expect-error invalid MuiMultiInputDateRangeField class key
        content: {
          backgroundColor: 'blue',
        },
      },
    },

    // Single input range fields
    MuiSingleInputDateRangeField: {
      defaultProps: {
        disabled: true,
        // @ts-expect-error invalid MuiSingleInputDateRangeField prop
        someRandomProp: true,
      },
    },

    MuiSingleInputDateTimeRangeField: {
      defaultProps: {
        disabled: true,
        // @ts-expect-error invalid MuiSingleInputDateTimeRangeField prop
        someRandomProp: true,
      },
    },

    MuiSingleInputTimeRangeField: {
      defaultProps: {
        disabled: true,
        // @ts-expect-error invalid MuiSingleInputTimeRangeField prop
        someRandomProp: true,
      },
    },

    // Date Range Pickers
    MuiDateRangePicker: {
      defaultProps: {
        open: true,
        // @ts-expect-error invalid MuiDateRangePicker prop
        someRandomProp: true,
      },
    },

    MuiDesktopDateRangePicker: {
      defaultProps: {
        open: true,
        // @ts-expect-error invalid MuiDesktopDateRangePicker prop
        someRandomProp: true,
      },
    },

    MuiMobileDateRangePicker: {
      defaultProps: {
        open: true,
        // @ts-expect-error invalid MuiMobileDateRangePicker prop
        someRandomProp: true,
      },
    },

    MuiStaticDateRangePicker: {
      defaultProps: {
        disabled: true,
        // @ts-expect-error invalid MuiStaticDateRangePicker prop
        someRandomProp: true,
      },
    },

    // Date Time Range Pickers
    MuiDateTimeRangePicker: {
      defaultProps: {
        open: true,
        // @ts-expect-error invalid MuiDateTimeRangePicker prop
        someRandomProp: true,
      },
    },

    MuiDesktopDateTimeRangePicker: {
      defaultProps: {
        open: true,
        // @ts-expect-error invalid MuiDesktopDateTimeRangePicker prop
        someRandomProp: true,
      },
    },

    MuiMobileDateTimeRangePicker: {
      defaultProps: {
        open: true,
        // @ts-expect-error invalid MuiMobileDateTimeRangePicker prop
        someRandomProp: true,
      },
    },
  },
});
