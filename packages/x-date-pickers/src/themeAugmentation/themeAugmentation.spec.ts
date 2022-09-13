import { createTheme } from '@mui/material/styles';

createTheme({
  components: {
    MuiCalendarOrClockPicker: {
      defaultProps: {
        open: true,
        // @ts-expect-error invalid MuiCalendarOrClockPicker prop
        someRandomProp: true,
      },
    },
    MuiCalendarPicker: {
      defaultProps: {
        view: 'day',
        // @ts-expect-error invalid MuiCalendarPicker prop
        someRandomProp: true,
      },
    },
    MuiCalendarPickerSkeleton: {
      defaultProps: {
        className: 'class',
        // @ts-expect-error invalid MuiCalendarPickerSkeleton prop
        someRandomProp: true,
      },
    },
    MuiClock: {
      defaultProps: {
        ampmInClock: true,
        // @ts-expect-error invalid MuiClock prop
        someRandomProp: true,
      },
    },
    MuiClockNumber: {
      defaultProps: {
        selected: true,
        // @ts-expect-error invalid MuiClockNumber prop
        someRandomProp: true,
      },
    },
    MuiClockPicker: {
      defaultProps: {
        view: 'hours',
        // @ts-expect-error invalid MuiClockPicker prop
        someRandomProp: true,
      },
    },
    MuiClockPointer: {
      defaultProps: {
        type: 'hours',
        // @ts-expect-error invalid MuiClockPointer prop
        someRandomProp: true,
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
    },
    MuiDayPicker: {
      defaultProps: {
        disabled: true,
        // @ts-expect-error invalid MuiDayPicker prop
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
    MuiDateTimePickerTabs: {
      defaultProps: {
        view: 'day',
        // @ts-expect-error invalid MuiDateTimePicker prop
        someRandomProp: true,
      },
    },
    MuiDateTimePickerToolbar: {
      defaultProps: {
        disabled: true,
        // @ts-expect-error invalid MuiDateTimePickerToolbar prop
        someRandomProp: true,
      },
    },
    MuiMonthPicker: {
      defaultProps: {
        disableFuture: true,
        // @ts-expect-error invalid MuiMonthPicker prop
        someRandomProp: true,
      },
    },
    MuiPickersCalendarHeader: {
      defaultProps: {
        disabled: true,
        // @ts-expect-error invalid MuiPickersCalendarHeader prop
        someRandomProp: true,
      },
    },
    MuiPickersFadeTransitionGroup: {
      defaultProps: {
        reduceAnimations: true,
        // @ts-expect-error invalid MuiPickersFadeTransitionGroup prop
        someRandomProp: true,
      },
    },
    MuiPickersDay: {
      defaultProps: {
        disabled: true,
        // @ts-expect-error invalid MuiPickersDay prop
        someRandomProp: true,
      },
    },
    MuiPickersPopper: {
      defaultProps: {
        open: true,
        // @ts-expect-error invalid MuiPickersPopper prop
        someRandomProp: true,
      },
    },
    MuiPickersToolbar: {
      defaultProps: {
        isLandscape: true,
        // @ts-expect-error invalid MuiPickersToolbar prop
        someRandomProp: true,
      },
    },
    MuiPickersToolbarButton: {
      defaultProps: {
        disabled: true,
        // @ts-expect-error invalid MuiPickersToolbarButton prop
        someRandomProp: true,
      },
    },
    MuiTimePickerToolbar: {
      defaultProps: {
        disabled: true,
        // @ts-expect-error invalid MuiTimePickerToolbar prop
        someRandomProp: true,
      },
    },
    MuiStaticDatePicker: {
      defaultProps: {
        open: true,
        someRandomProp: true,
      },
    },
    MuiYearPicker: {
      defaultProps: {
        disableFuture: true,
        // @ts-expect-error invalid MuiYearPicker prop
        someRandomProp: true,
      },
    },
    MuiPickerStaticWrapper: {
      defaultProps: {
        open: true,
        // @ts-expect-error invalid MuiPickerStaticWrapper prop
        someRandomProp: true,
      },
    },
  },
});
