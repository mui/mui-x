import * as React from 'react';
import moment from 'moment-hijri';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import { AdapterMomentHijri } from '@mui/x-date-pickers/AdapterMomentHijri';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  DateTimePicker,
  DateTimePickerProps,
  DateTimePickerFieldProps,
} from '@mui/x-date-pickers/DateTimePicker';
import { useValidation, validateDate } from '@mui/x-date-pickers/validation';
import {
  useSplitFieldProps,
  useParsedFormat,
  usePickerContext,
} from '@mui/x-date-pickers/hooks';

// Create rtl cache
const cacheRtl = createCache({
  key: 'adapter-moment-hijri-demo',
  stylisPlugins: [prefixer, rtlPlugin],
});

function ButtonDateTimeField(props: DateTimePickerFieldProps) {
  const { internalProps, forwardedProps } = useSplitFieldProps(props, 'date');
  const { value, timezone, format } = internalProps;
  const {
    InputProps,
    slotProps,
    slots,
    ownerState,
    label,
    focused,
    name,
    ...other
  } = forwardedProps;

  const pickerContext = usePickerContext();

  const parsedFormat = useParsedFormat(internalProps);
  const { hasValidationError } = useValidation({
    validator: validateDate,
    value,
    timezone,
    props: internalProps,
  });

  const handleTogglePicker = (event: React.UIEvent) => {
    if (pickerContext.open) {
      pickerContext.onClose(event);
    } else {
      pickerContext.onOpen(event);
    }
  };

  const valueStr = value == null ? parsedFormat : value.format(format);

  return (
    <Button
      {...other}
      variant="outlined"
      color={hasValidationError ? 'error' : 'primary'}
      ref={InputProps?.ref}
      onClick={handleTogglePicker}
    >
      {label ? `${label}: ${valueStr}` : valueStr}
    </Button>
  );
}

function ButtonFieldDateTimePicker(props: DateTimePickerProps) {
  return (
    <DateTimePicker
      {...props}
      slots={{ ...props.slots, field: ButtonDateTimeField }}
    />
  );
}

export default function AdapterHijri() {
  // Inherit the theme from the docs site (dark/light mode)
  const existingTheme = useTheme();

  const theme = React.useMemo(
    () => createTheme(existingTheme, { direction: 'rtl' }),
    [existingTheme],
  );

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <div dir="rtl">
          <LocalizationProvider dateAdapter={AdapterMomentHijri}>
            <ButtonFieldDateTimePicker
              defaultValue={moment(new Date(2022, 1, 1))}
              // moment-hijri support dates between 1356-01-01 and 1499-12-29 H (1937-03-14 and 2076-11-26)
              minDate={moment(new Date(1938, 0, 1))}
              maxDate={moment(new Date(2075, 11, 31))}
              // Setting `dir="rtl"` on the paper is needed if the `<div dir="rtl />` does not contain the portaled element.
              // If you set `dir="rtl"` on the `<body />`, you can skip it.
              slotProps={{
                desktopPaper: {
                  dir: 'rtl',
                },
                mobilePaper: {
                  dir: 'rtl',
                },
              }}
            />
          </LocalizationProvider>
        </div>
      </ThemeProvider>
    </CacheProvider>
  );
}
