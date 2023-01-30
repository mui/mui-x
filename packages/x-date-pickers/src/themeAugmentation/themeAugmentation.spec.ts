import { createTheme } from '@mui/material/styles';
import {
  dateCalendarClasses,
  dayPickerClasses,
  pickersCalendarHeaderClasses,
  pickersSlideTransitionClasses,
} from '../DateCalendar';
import { dayCalendarSkeletonClasses } from '../DayCalendarSkeleton';
import {
  clockClasses,
  clockNumberClasses,
  timeClockClasses,
  clockPointerClasses,
} from '../TimeClock';
import { datePickerToolbarClasses } from '../DatePicker';
import { dateTimePickerToolbarClasses } from '../DateTimePicker';
import {
  pickersArrowSwitcherClasses,
  pickersPopperClasses,
  pickersToolbarClasses,
} from '../internals';
import { pickersDayClasses } from '../PickersDay';
import { timePickerToolbarClasses } from '../TimePicker';
import { pickersMonthClasses } from '../MonthCalendar';

createTheme({
  components: {
    MuiDateCalendar: {
      defaultProps: {
        view: 'day',
        // @ts-expect-error invalid MuiDateCalendar prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: {
          backgroundColor: 'red',
          [`.${dateCalendarClasses.viewTransitionContainer}`]: {
            backgroundColor: 'green',
          },
        },
      },
    },
    MuiDayCalendarSkeleton: {
      defaultProps: {
        className: 'class',
        // @ts-expect-error invalid MuiDayCalendarSkeleton prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: {
          backgroundColor: 'red',
          [`.${dayCalendarSkeletonClasses.week}`]: {
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
    MuiDayCalendar: {
      defaultProps: {
        disabled: true,
        // @ts-expect-error invalid MuiDayCalendar prop
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
    MuiMonthCalendar: {
      defaultProps: {
        disableFuture: true,
        // @ts-expect-error invalid MuiMonthCalendar prop
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
    MuiPickersMonth: {
      defaultProps: {
        classes: { selected: 'test' },
        // @ts-expect-error invalid MuiPickersMonth prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: {
          backgroundColor: 'red',
          [`.${pickersMonthClasses.monthButton}`]: {
            backgroundColor: 'green',
          },
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
    MuiPickersSlideTransition: {
      defaultProps: {
        classes: { slideExit: 'exit' },
        // @ts-expect-error invalid MuiPickersSlideTransition prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: {
          backgroundColor: 'red',
          [`.${pickersSlideTransitionClasses.slideExit}`]: {
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
    MuiPickersToolbarText: {
      defaultProps: {
        className: 'klass',
        // @ts-expect-error invalid MuiPickersToolbarText prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: {
          backgroundColor: 'red',
        },
      },
    },
    MuiPickersLayout: {
      defaultProps: {
        disabled: true,
        // @ts-expect-error invalid MuiPickersLayout prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: {
          backgroundColor: 'red',
        },
        contentWrapper: {
          backgroundColor: 'red',
        },
      },
    },
    MuiPickersYear: {
      defaultProps: {
        classes: { yearButton: 'test' },
        // @ts-expect-error invalid MuiPickersYear prop
        someRandomProp: true,
      },
      styleOverrides: {
        yearButton: {
          backgroundColor: 'red',
        },
      },
    },
    MuiTimeClock: {
      defaultProps: {
        view: 'hours',
        // @ts-expect-error invalid MuiTimeCLock prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: {
          backgroundColor: 'red',
          [`.${timeClockClasses.arrowSwitcher}`]: {
            backgroundColor: 'green',
          },
        },
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
    MuiYearCalendar: {
      defaultProps: {
        disableFuture: true,
        // @ts-expect-error invalid MuiYearCalendar prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: {
          backgroundColor: 'red',
        },
      },
    },

    // Date Pickers
    MuiDatePicker: {
      defaultProps: {
        open: true,
        // @ts-expect-error invalid MuiDatePicker prop
        someRandomProp: true,
      },
    },
    MuiDesktopDatePicker: {
      defaultProps: {
        open: true,
        // @ts-expect-error invalid MuiDesktopDatePicker prop
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
    MuiStaticDatePicker: {
      defaultProps: {
        disabled: true,
        // @ts-expect-error invalid MuiStaticDatePicker prop
        someRandomProp: true,
      },
    },

    // Time Pickers
    MuiTimePicker: {
      defaultProps: {
        open: true,
        // @ts-expect-error invalid MuiTimePicker prop
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
    MuiMobileTimePicker: {
      defaultProps: {
        open: true,
        // @ts-expect-error invalid MuiMobileTimePicker prop
        someRandomProp: true,
      },
    },
    MuiStaticTimePicker: {
      defaultProps: {
        disabled: true,
        // @ts-expect-error invalid MuiStaticTimePicker prop
        someRandomProp: true,
      },
    },

    // Date Time Pickers
    MuiDesktopDateTimePicker: {
      defaultProps: {
        open: true,
        // @ts-expect-error invalid MuiDesktopDateTimePicker prop
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
    MuiDateTimePicker: {
      defaultProps: {
        open: true,
        // @ts-expect-error invalid MuiDateTimePicker prop
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
  },
});
