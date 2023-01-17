import { createTheme } from '@mui/material/styles';

createTheme({
  components: {
    MuiDateRangePickerDay: {
      defaultProps: {
        color: 'red',
        // @ts-expect-error invalid MuiDateRangePickerDay prop
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
