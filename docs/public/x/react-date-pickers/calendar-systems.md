---
productId: x-date-pickers
title: Date and Time Pickers - Calendar systems
components: LocalizationProvider
githubLabel: 'scope: pickers'
packageName: '@mui/x-date-pickers'
---

# Calendar systems

Use the Date and Time Pickers with non-Gregorian calendars.

## Jalali

You can use either the `AdapterDateFnsJalali` adapter, which is based on [date-fns-jalali](https://www.npmjs.com/package/date-fns-jalali),
or the `AdapterMomentJalaali` adapter, which is based on [moment-jalaali](https://www.npmjs.com/package/moment-jalaali).

The following demo shows how to use the `date-fns-jalali` adapter:

```tsx
import * as React from 'react';
import { prefixer } from 'stylis';
import rtlPlugin from '@mui/stylis-plugin-rtl';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { AdapterDateFnsJalali } from '@mui/x-date-pickers/AdapterDateFnsJalali';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';

// Create rtl cache
const cacheRtl = createCache({
  key: 'adapter-date-fns-jalali-demo',
  stylisPlugins: [prefixer, rtlPlugin],
});

export default function AdapterJalali() {
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
          <LocalizationProvider dateAdapter={AdapterDateFnsJalali}>
            <DateTimePicker
              label="AdapterDateFnsJalali"
              defaultValue={new Date(2022, 1, 1, 12)}
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

```

:::info
We support `date-fns-jalali` package v2.x, v3.x, and v4.x major versions.

A single adapter cannot work for all `date-fns-jalali` versions, because the way functions are exported has been changed in v3.x.

To use `date-fns-jalali` v2.x, you need to import the adapter from `@mui/x-date-pickers/AdapterDateFnsJalaliV2` instead of `@mui/x-date-pickers/AdapterDateFnsJalali`.

```tsx
// with date-fns-jalali v3.x or v4.x
import { AdapterDateFnsJalali } from '@mui/x-date-pickers/AdapterDateFnsJalali';
// with date-fns-jalali v2.x
import { AdapterDateFnsJalali } from '@mui/x-date-pickers/AdapterDateFnsJalaliV2';
```

:::

The following demo shows how to use the `moment-jalaali` adapter:

```tsx
import * as React from 'react';
import { prefixer } from 'stylis';
import rtlPlugin from '@mui/stylis-plugin-rtl';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import moment from 'moment-jalaali';
import { AdapterMomentJalaali } from '@mui/x-date-pickers/AdapterMomentJalaali';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';

// Create rtl cache
const cacheRtl = createCache({
  key: 'adapter-moment-jalali-demo',
  stylisPlugins: [prefixer, rtlPlugin],
});

export default function AdapterMomentJalali() {
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
          <LocalizationProvider dateAdapter={AdapterMomentJalaali}>
            <DateTimePicker
              label="AdapterMomentJalaali"
              defaultValue={moment('2022-02-01T12:00:00')}
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

```

## Hijri

You can use the `AdapterMomentHijri` adapter, which is based on [moment-hijri](https://www.npmjs.com/package/moment-hijri):

```tsx
import * as React from 'react';
import moment from 'moment-hijri';
import { prefixer } from 'stylis';
import rtlPlugin from '@mui/stylis-plugin-rtl';
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

```

:::error
The adapter with `moment-hijri` does not support the new fields components because the date library seems buggy when parsing a month only.
If you want to help on the support of hijri calendar, please have a look at [this issue](https://github.com/xsoh/moment-hijri/issues/83).

The demo is based on the [Custom Field—Using a Button](/x/react-date-pickers/custom-field/#using-a-button) demo to let you pick a value using only the view.
You can have a look at the other demos in the [Custom Field—With a custom editing experience](/x/react-date-pickers/custom-field/#with-a-custom-editing-experience) section if you want a different editing experience that works with `AdapterMomentHijri`.
:::

## Unsupported libraries

If you need to use a date library that is not supported yet, please [open an issue](https://github.com/mui/mui-x/issues/new/choose) in the MUI X repository.
