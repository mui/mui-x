import { createTheme } from '@mui/material/styles';

createTheme({
  components: {
    MuiDateRangePicker: {
      defaultProps: {
        calendars: 2,
        // @ts-expect-error invalid MuiDateRangePicker prop
        someRandomProp: true,
      },
    },
    MuiDateRangePickerDay: {
      defaultProps: {
        color: 'red',
        // @ts-expect-error invalid MuiDateRangePickerDay prop
        someRandomProp: true,
      },
    },
    MuiDateRangePickerInput: {
      defaultProps: {
        disabled: true,
        // @ts-expect-error invalid MuiDateRangePickerInput prop
        someRandomProp: true,
      },
    },
    MuiDateRangePickerToolbar: {
      defaultProps: {
        toolbarPlaceholder: 'empty',
        // @ts-expect-error invalid MuiDateRangePickerToolbar prop
        someRandomProp: true,
      },
    },
    MuiDateRangePickerViewDesktop: {
      defaultProps: {
        disabled: true,
        // @ts-expect-error invalid MuiDateRangePickerViewDesktop prop
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
    MuiDesktopNextDateRangePicker: {
      defaultProps: {
        open: true,
        // @ts-expect-error invalid MuiDesktopNextDateRangePicker prop
        someRandomProp: true,
      },
    },
    MuiMobileDateRangePicker: {
      defaultProps: {
        disableFuture: true,
        // @ts-expect-error invalid MuiMobileDateRangePicker prop
        someRandomProp: true,
      },
    },
    MuiMobileNextDateRangePicker: {
      defaultProps: {
        open: true,
        // @ts-expect-error invalid MuiMobileNextDateRangePicker prop
        someRandomProp: true,
      },
    },
    MuiNextDateRangePicker: {
      defaultProps: {
        open: true,
        // @ts-expect-error invalid MuiNextDateRangePicker prop
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
    MuiStaticNextDateRangePicker: {
      defaultProps: {
        disabled: true,
        // @ts-expect-error invalid MuiStaticNextDateRangePicker prop
        someRandomProp: true,
      },
    },
  },
});
