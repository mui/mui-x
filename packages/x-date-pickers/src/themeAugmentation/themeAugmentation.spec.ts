import { createTheme } from '@mui/material/styles';
import {
  calendarPickerClasses,
  dayPickerClasses,
  pickersCalendarHeaderClasses,
} from '../CalendarPicker';
import { calendarPickerSkeletonClasses } from '../CalendarPickerSkeleton';
import {
  clockClasses,
  clockNumberClasses,
  clockPickerClasses,
  clockPointerClasses,
} from '../ClockPicker';
import { datePickerToolbarClasses } from '../DatePicker';
import { dateTimePickerToolbarClasses } from '../DateTimePicker';
import {
  calendarOrClockPickerClasses,
  pickersArrowSwitcherClasses,
  pickersPopperClasses,
  pickerStaticWrapperClasses,
  pickersToolbarClasses,
} from '../internals';
import { pickersDayClasses } from '../PickersDay';
import { timePickerToolbarClasses } from '../TimePicker';

createTheme({
  components: {
    MuiCalendarOrClockPicker: {
      defaultProps: {
        open: true,
        // @ts-expect-error invalid MuiCalendarOrClockPicker prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: {
          backgroundColor: 'red',
          [`.${calendarOrClockPickerClasses.mobileKeyboardInputView}`]: {
            backgroundColor: 'green',
          },
        },
      },
    },
    MuiCalendarPicker: {
      defaultProps: {
        view: 'day',
        // @ts-expect-error invalid MuiCalendarPicker prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: {
          backgroundColor: 'red',
          [`.${calendarPickerClasses.viewTransitionContainer}`]: {
            backgroundColor: 'green',
          },
        },
      },
    },
    MuiCalendarPickerSkeleton: {
      defaultProps: {
        className: 'class',
        // @ts-expect-error invalid MuiCalendarPickerSkeleton prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: {
          backgroundColor: 'red',
          [`.${calendarPickerSkeletonClasses.week}`]: {
            backgroundColor: 'green',
          },
        },
      },
    },
    MuiClock: {
      defaultProps: {
        ampmInClock: true,
        // @ts-expect-error invalid MuiClock prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: {
          backgroundColor: 'red',
          [`.${clockClasses.clock}`]: {
            backgroundColor: 'green',
          },
        },
      },
    },
    MuiClockNumber: {
      defaultProps: {
        selected: true,
        // @ts-expect-error invalid MuiClockNumber prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: {
          backgroundColor: 'red',
          [`&.${clockNumberClasses.selected}`]: {
            backgroundColor: 'green',
          },
        },
      },
    },
    MuiClockPicker: {
      defaultProps: {
        view: 'hours',
        // @ts-expect-error invalid MuiClockPicker prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: {
          backgroundColor: 'red',
          [`.${clockPickerClasses.arrowSwitcher}`]: {
            backgroundColor: 'green',
          },
        },
      },
    },
    MuiClockPointer: {
      defaultProps: {
        type: 'hours',
        // @ts-expect-error invalid MuiClockPointer prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: {
          backgroundColor: 'red',
          [`.${clockPointerClasses.thumb}`]: {
            backgroundColor: 'green',
          },
        },
      },
    },
    MuiDatePicker: {
      defaultProps: {
        open: true,
        // @ts-expect-error invalid MuiDatePicker prop
        someRandomProp: true,
      },
    },
    MuiDatePickerToolbar: {
      defaultProps: {
        disabled: true,
        // @ts-expect-error invalid MuiDatePicker prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: {
          backgroundColor: 'red',
          [`.${datePickerToolbarClasses.title}`]: {
            backgroundColor: 'green',
          },
        },
      },
    },
    MuiDateTimePicker: {
      defaultProps: {
        open: true,
        // @ts-expect-error invalid MuiDateTimePicker prop
        someRandomProp: true,
      },
    },
    MuiDateTimePickerTabs: {
      defaultProps: {
        view: 'day',
        // @ts-expect-error invalid MuiDateTimePicker prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: {
          backgroundColor: 'red',
        },
      },
    },
    MuiDateTimePickerToolbar: {
      defaultProps: {
        disabled: true,
        // @ts-expect-error invalid MuiDateTimePickerToolbar prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: {
          backgroundColor: 'red',
          [`.${dateTimePickerToolbarClasses.dateContainer}`]: {
            backgroundColor: 'green',
          },
        },
      },
    },
    MuiDayPicker: {
      defaultProps: {
        disabled: true,
        // @ts-expect-error invalid MuiDayPicker prop
        someRandomProp: true,
      },
      styleOverrides: {
        header: {
          backgroundColor: 'red',
          [`.${dayPickerClasses.weekContainer}`]: {
            backgroundColor: 'green',
          },
        },
      },
    },
    MuiDesktopDatePicker: {
      defaultProps: {
        open: true,
        // @ts-expect-error invalid MuiDesktopDatePicker prop
        someRandomProp: true,
      },
    },
    MuiDesktopDateTimePicker: {
      defaultProps: {
        open: true,
        // @ts-expect-error invalid MuiDesktopDateTimePicker prop
        someRandomProp: true,
      },
    },
    MuiDesktopTimePicker: {
      defaultProps: {
        open: true,
        // @ts-expect-error invalid MuiDesktopTimePicker prop
        someRandomProp: true,
      },
    },
    MuiLocalizationProvider: {
      defaultProps: {
        adapterLocale: 'fr',
        // @ts-expect-error invalid MuiLocalizationProvider prop
        someRandomProp: true,
      },
    },
    MuiMobileDatePicker: {
      defaultProps: {
        open: true,
        // @ts-expect-error invalid MuiMobileDatePicker prop
        someRandomProp: true,
      },
    },
    MuiMobileDateTimePicker: {
      defaultProps: {
        open: true,
        // @ts-expect-error invalid MuiMobileDateTimePicker prop
        someRandomProp: true,
      },
    },
    MuiMobileTimePicker: {
      defaultProps: {
        open: true,
        // @ts-expect-error invalid MuiMobileTimePicker prop
        someRandomProp: true,
      },
    },
    MuiMonthPicker: {
      defaultProps: {
        disableFuture: true,
        // @ts-expect-error invalid MuiMonthPicker prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: {
          backgroundColor: 'red',
        },
      },
    },
    MuiPickersArrowSwitcher: {
      defaultProps: {
        classes: { root: 'test' },
        // @ts-expect-error invalid MuiPickersArrowSwitcher prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: {
          backgroundColor: 'red',
          [`.${pickersArrowSwitcherClasses.button}`]: {
            backgroundColor: 'green',
          },
        },
      },
    },
    MuiPickersCalendarHeader: {
      defaultProps: {
        classes: { root: 'test' },
        // @ts-expect-error invalid MuiPickersCalendarHeader prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: {
          backgroundColor: 'red',
          [`.${pickersCalendarHeaderClasses.labelContainer}`]: {
            backgroundColor: 'green',
          },
        },
      },
    },
    MuiPickersDay: {
      defaultProps: {
        disabled: true,
        // @ts-expect-error invalid MuiPickersDay prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: {
          backgroundColor: 'red',
          [`.${pickersDayClasses.today}`]: {
            backgroundColor: 'green',
          },
        },
      },
    },
    MuiPickersFadeTransitionGroup: {
      defaultProps: {
        reduceAnimations: true,
        // @ts-expect-error invalid MuiPickersFadeTransitionGroup prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: {
          backgroundColor: 'red',
        },
      },
    },
    MuiPickersPopper: {
      defaultProps: {
        open: true,
        // @ts-expect-error invalid MuiPickersPopper prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: {
          backgroundColor: 'red',
          [`.${pickersPopperClasses.paper}`]: {
            backgroundColor: 'green',
          },
        },
      },
    },
    MuiPickerStaticWrapper: {
      defaultProps: {
        open: true,
        // @ts-expect-error invalid MuiPickerStaticWrapper prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: {
          backgroundColor: 'red',
          [`.${pickerStaticWrapperClasses.content}`]: {
            backgroundColor: 'green',
          },
        },
      },
    },
    MuiPickersToolbar: {
      defaultProps: {
        isLandscape: true,
        // @ts-expect-error invalid MuiPickersToolbar prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: {
          backgroundColor: 'red',
          [`.${pickersToolbarClasses.penIconButton}`]: {
            backgroundColor: 'green',
          },
        },
      },
    },
    MuiPickersToolbarButton: {
      defaultProps: {
        disabled: true,
        // @ts-expect-error invalid MuiPickersToolbarButton prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: {
          backgroundColor: 'red',
        },
      },
    },
    MuiStaticDatePicker: {
      defaultProps: {
        disabled: true,
        // @ts-expect-error invalid MuiStaticDatePicker prop
        someRandomProp: true,
      },
    },
    MuiStaticDateTimePicker: {
      defaultProps: {
        disabled: true,
        // @ts-expect-error invalid MuiStaticDateTimePicker prop
        someRandomProp: true,
      },
    },
    MuiStaticTimePicker: {
      defaultProps: {
        disabled: true,
        // @ts-expect-error invalid MuiStaticDatePicker prop
        someRandomProp: true,
      },
    },
    MuiTimePicker: {
      defaultProps: {
        open: true,
        // @ts-expect-error invalid MuiTimePicker prop
        someRandomProp: true,
      },
    },
    MuiTimePickerToolbar: {
      defaultProps: {
        disabled: true,
        // @ts-expect-error invalid MuiTimePickerToolbar prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: {
          backgroundColor: 'red',
          [`.${timePickerToolbarClasses.separator}`]: {
            backgroundColor: 'green',
          },
        },
      },
    },
    MuiYearPicker: {
      defaultProps: {
        disableFuture: true,
        // @ts-expect-error invalid MuiYearPicker prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: {
          backgroundColor: 'red',
        },
      },
    },
    PrivatePickersMonth: {
      styleOverrides: {
        root: {
          backgroundColor: 'red',
        },
        // @ts-expect-error invalid PrivatePickersMonth prop
        randomClass: {
          color: 'black',
        },
      },
    },
    PrivatePickersSlideTransition: {
      styleOverrides: {
        root: {
          backgroundColor: 'red',
        },
        // @ts-expect-error invalid PrivatePickersSlideTransition prop
        randomClass: {
          color: 'black',
        },
      },
    },
    PrivatePickersToolbarText: {
      styleOverrides: {
        root: {
          backgroundColor: 'red',
        },
        // @ts-expect-error invalid PrivatePickersToolbarText prop
        randomClass: {
          color: 'black',
        },
      },
    },
    PrivatePickersYear: {
      styleOverrides: {
        root: {
          backgroundColor: 'red',
        },
        // @ts-expect-error invalid PrivatePickersYear prop
        randomClass: {
          color: 'black',
        },
      },
    },
  },
});
