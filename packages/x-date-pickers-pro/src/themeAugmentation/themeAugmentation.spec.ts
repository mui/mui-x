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
    MuiDesktopNextDateRangePicker: {
      defaultProps: {
        open: true,
        // @ts-expect-error invalid MuiDesktopNextDateRangePicker prop
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
    MuiStaticNextDateRangePicker: {
      defaultProps: {
        disabled: true,
        // @ts-expect-error invalid MuiStaticNextDateRangePicker prop
        someRandomProp: true,
      },
    },
  },
});
