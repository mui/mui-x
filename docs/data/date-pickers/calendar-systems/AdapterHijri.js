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
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
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

function ButtonDateTimeField(props) {
  const { internalProps, forwardedProps } = useSplitFieldProps(props, 'date');

  const pickerContext = usePickerContext();
  const parsedFormat = useParsedFormat();
  const { hasValidationError } = useValidation({
    validator: validateDate,
    value: pickerContext.value,
    timezone: pickerContext.timezone,
    props: internalProps,
  });

  const valueStr =
    pickerContext.value == null
      ? parsedFormat
      : pickerContext.value.format(pickerContext.fieldFormat);

  return (
    <Button
      {...forwardedProps}
      variant="outlined"
      color={hasValidationError ? 'error' : 'primary'}
      className={pickerContext.rootClassName}
      sx={pickerContext.rootSx}
      ref={pickerContext.triggerRef}
      onClick={() => pickerContext.setOpen((prev) => !prev)}
    >
      {pickerContext.label ? `${pickerContext.label}: ${valueStr}` : valueStr}
    </Button>
  );
}

function ButtonFieldDateTimePicker(props) {
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
