import { createTheme } from '@mui/material/styles';
import {
  dateCalendarClasses,
  dayCalendarClasses,
  pickersSlideTransitionClasses,
} from '../DateCalendar';
import { pickersCalendarHeaderClasses } from '../PickersCalendarHeader';
import { dayCalendarSkeletonClasses } from '../DayCalendarSkeleton';
import {
  clockClasses,
  clockNumberClasses,
  timeClockClasses,
  clockPointerClasses,
} from '../TimeClock';
import { datePickerToolbarClasses } from '../DatePicker';
import { dateTimePickerToolbarClasses } from '../DateTimePicker';
import { pickersArrowSwitcherClasses } from '../internals/components/PickersArrowSwitcher';
import { pickersPopperClasses } from '../internals/components/pickersPopperClasses';
import { pickersDayClasses } from '../PickersDay';
import { timePickerToolbarClasses } from '../TimePicker';
import { pickersMonthClasses } from '../MonthCalendar';
import { digitalClockClasses } from '../DigitalClock';
import {
  multiSectionDigitalClockClasses,
  multiSectionDigitalClockSectionClasses,
} from '../MultiSectionDigitalClock';

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
        // @ts-expect-error invalid MuiDateCalendar class key
        content: {
          backgroundColor: 'blue',
        },
      },
    },
    MuiDateField: {
      defaultProps: {
        className: 'class',
        // @ts-expect-error invalid MuiDateField prop
        someRandomProp: true,
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
        // @ts-expect-error invalid MuiDayCalendarSkeleton class key
        content: {
          backgroundColor: 'blue',
        },
      },
    },
    MuiDigitalClock: {
      defaultProps: {
        timeStep: 42,
        // @ts-expect-error invalid MuiDigitalClock prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: {
          backgroundColor: 'red',
          [`.${digitalClockClasses.item}`]: {
            backgroundColor: 'green',
          },
        },
        // @ts-expect-error invalid MuiDigitalClock class key
        content: {
          backgroundColor: 'blue',
        },
      },
    },
    MuiMultiSectionDigitalClock: {
      defaultProps: {
        timeSteps: { minutes: 42 },
        // @ts-expect-error invalid MuiMultiSectionDigitalClock prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: {
          backgroundColor: 'red',
          [`&.${multiSectionDigitalClockClasses.root}`]: {
            backgroundColor: 'green',
          },
        },
        // @ts-expect-error invalid MuiMultiSectionDigitalClock class key
        content: {
          backgroundColor: 'blue',
        },
      },
    },
    MuiMultiSectionDigitalClockSection: {
      defaultProps: {
        className: 'class',
        // @ts-expect-error invalid MuiMultiSectionDigitalClockSection prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: {
          backgroundColor: 'red',
          [`.${multiSectionDigitalClockSectionClasses.item}`]: {
            backgroundColor: 'green',
          },
        },
        // @ts-expect-error invalid MuiMultiSectionDigitalClockSection class key
        content: {
          backgroundColor: 'blue',
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
        // @ts-expect-error invalid MuiClock class key
        content: {
          backgroundColor: 'blue',
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
        // @ts-expect-error invalid MuiClockNumber class key
        content: {
          backgroundColor: 'blue',
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
        // @ts-expect-error invalid MuiClockPointer class key
        content: {
          backgroundColor: 'blue',
        },
      },
    },
    MuiDateTimeField: {
      defaultProps: {
        className: 'class',
        // @ts-expect-error invalid MuiDateTimeField prop
        someRandomProp: true,
      },
    },
    MuiDatePickerToolbar: {
      defaultProps: {
        hidden: false,
        // @ts-expect-error invalid MuiDatePickerToolbar prop
        view: 'day',
      },
      styleOverrides: {
        root: {
          backgroundColor: 'red',
          [`.${datePickerToolbarClasses.title}`]: {
            backgroundColor: 'green',
          },
        },
        // @ts-expect-error invalid MuiDatePickerToolbar class key
        content: {
          backgroundColor: 'blue',
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
        // @ts-expect-error invalid MuiDateTimePickerTabs class key
        content: {
          backgroundColor: 'blue',
        },
      },
    },
    MuiDateTimePickerToolbar: {
      defaultProps: {
        hidden: false,
        // @ts-expect-error invalid MuiDateTimePickerToolbar prop
        view: 'day',
      },
      styleOverrides: {
        root: {
          backgroundColor: 'red',
          [`.${dateTimePickerToolbarClasses.dateContainer}`]: {
            backgroundColor: 'green',
          },
        },
        // @ts-expect-error invalid MuiDateTimePickerToolbar class key
        content: {
          backgroundColor: 'blue',
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
          [`.${dayCalendarClasses.weekContainer}`]: {
            backgroundColor: 'green',
          },
        },
        // @ts-expect-error invalid MuiDayCalendar class key
        content: {
          backgroundColor: 'blue',
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
        // @ts-expect-error invalid MuiMonthCalendar class key
        content: {
          backgroundColor: 'blue',
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
        // @ts-expect-error invalid MuiPickersArrowSwitcher class key
        content: {
          backgroundColor: 'blue',
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
        // @ts-expect-error invalid MuiPickersCalendarHeader class key
        content: {
          backgroundColor: 'blue',
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
        // @ts-expect-error invalid MuiPickersFadeTransitionGroup class key
        content: {
          backgroundColor: 'blue',
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
        // @ts-expect-error invalid MuiPickersDay class key
        content: {
          backgroundColor: 'blue',
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
        // @ts-expect-error invalid MuiPickersMonth class key
        content: {
          backgroundColor: 'blue',
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
        // @ts-expect-error invalid MuiPickersPopper class key
        content: {
          backgroundColor: 'blue',
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
        // @ts-expect-error invalid MuiPickersSlideTransition class key
        content: {
          backgroundColor: 'blue',
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
        },
        // @ts-expect-error invalid MuiPickersToolbar class key
        contentWrapper: {
          backgroundColor: 'blue',
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
        // @ts-expect-error invalid MuiPickersToolbarButton class key
        content: {
          backgroundColor: 'blue',
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
        // @ts-expect-error invalid MuiPickersToolbarText class key
        content: {
          backgroundColor: 'blue',
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
        // @ts-expect-error invalid MuiPickersLayout class key
        content: {
          backgroundColor: 'blue',
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
        // @ts-expect-error invalid MuiPickersYear class key
        content: {
          backgroundColor: 'blue',
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
        // @ts-expect-error invalid MuiTimeClock class key
        content: {
          backgroundColor: 'blue',
        },
      },
    },
    MuiTimeField: {
      defaultProps: {
        className: 'class',
        // @ts-expect-error invalid MuiTimeField prop
        someRandomProp: true,
      },
    },
    MuiTimePickerToolbar: {
      defaultProps: {
        hidden: false,
        // @ts-expect-error invalid MuiTimePickerToolbar prop
        view: 'hours',
      },
      styleOverrides: {
        root: {
          backgroundColor: 'red',
          [`.${timePickerToolbarClasses.separator}`]: {
            backgroundColor: 'green',
          },
        },
        // @ts-expect-error invalid MuiTimePickerToolbar class key
        content: {
          backgroundColor: 'blue',
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
        // @ts-expect-error invalid MuiYearCalendar class key
        content: {
          backgroundColor: 'blue',
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

    // V7 Pickers's TextField
    MuiPickersTextField: {
      defaultProps: {
        classes: { root: 'test' },
        // @ts-expect-error invalid MuiPickersTextField prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: {
          backgroundColor: 'red',
        },
        // @ts-expect-error invalid MuiPickersTextField class key
        content: {
          backgroundColor: 'blue',
        },
      },
    },
    MuiPickersInputBase: {
      defaultProps: {
        classes: { root: 'test' },
        // @ts-expect-error invalid MuiPickersInputBase prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: {
          backgroundColor: 'red',
        },
        // @ts-expect-error invalid MuiPickersInputBase class key
        content: {
          backgroundColor: 'blue',
        },
      },
    },
    MuiPickersInput: {
      defaultProps: {
        classes: { root: 'test' },
        // @ts-expect-error invalid MuiPickersInput prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: {
          backgroundColor: 'red',
        },
        // @ts-expect-error invalid MuiPickersInput class key
        content: {
          backgroundColor: 'blue',
        },
      },
    },
    MuiPickersFilledInput: {
      defaultProps: {
        classes: { root: 'test' },
        // @ts-expect-error invalid MuiPickersFilledInput prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: {
          backgroundColor: 'red',
        },
        // @ts-expect-error invalid MuiPickersFilledInput class key
        content: {
          backgroundColor: 'blue',
        },
      },
    },
    MuiPickersOutlinedInput: {
      defaultProps: {
        classes: { root: 'test' },
        // @ts-expect-error invalid MuiPickersOutlinedInput prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: {
          backgroundColor: 'red',
        },
        // @ts-expect-error invalid MuiPickersOutlinedInput class key
        content: {
          backgroundColor: 'blue',
        },
      },
    },
    MuiPickersSectionList: {
      defaultProps: {
        classes: { root: 'test' },
        // @ts-expect-error invalid MuiPickersSectionList prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: {
          backgroundColor: 'red',
        },
        // @ts-expect-error invalid MuiPickersSectionList class key
        content: {
          backgroundColor: 'blue',
        },
      },
    },
  },
});
