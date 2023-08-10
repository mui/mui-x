import { createTheme } from '@mui/material/styles';
import { dateRangeCalendarClasses } from '../DateRangeCalendar';
import { dateRangePickerToolbarClasses } from '../DateRangePicker';
import { dateRangePickerDayClasses } from '../DateRangePickerDay';
import { multiInputDateRangeFieldClasses } from '../MultiInputDateRangeField';
import { multiInputDateTimeRangeFieldClasses } from '../MultiInputDateTimeRangeField';
import { multiInputTimeRangeFieldClasses } from '../MultiInputTimeRangeField';

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
    MuiDateRangePickerToolbar: {
      defaultProps: {
        toolbarPlaceholder: 'empty',
        // @ts-expect-error invalid MuiDateRangePickerToolbar prop
        someRandomProp: true,
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

    // Multi input range fields
    MuiMultiInputDateRangeField: {
      defaultProps: {
        disabled: true,
        // @ts-expect-error invalid MuiMultiInputDateRangeField prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: {
          backgroundColor: 'red',
          [`.${multiInputDateRangeFieldClasses.separator}`]: {
            backgroundColor: 'green',
          },
        },
        // @ts-expect-error invalid MuiMultiInputDateRangeField class key
        content: {
          backgroundColor: 'blue',
        },
      },
    },
    MuiMultiInputDateTimeRangeField: {
      defaultProps: {
        disabled: true,
        // @ts-expect-error invalid MuiMultiInputDateTimeRangeField prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: {
          backgroundColor: 'red',
          [`.${multiInputDateTimeRangeFieldClasses.separator}`]: {
            backgroundColor: 'green',
          },
        },
        // @ts-expect-error invalid MuiMultiInputDateTimeRangeField class key
        content: {
          backgroundColor: 'blue',
        },
      },
    },
    MuiMultiInputTimeRangeField: {
      defaultProps: {
        disabled: true,
        // @ts-expect-error invalid MuiMultiInputTimeRangeField prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: {
          backgroundColor: 'red',
          [`.${multiInputTimeRangeFieldClasses.separator}`]: {
            backgroundColor: 'green',
          },
        },
        // @ts-expect-error invalid MuiMultiInputTimeRangeField class key
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
  },
});
