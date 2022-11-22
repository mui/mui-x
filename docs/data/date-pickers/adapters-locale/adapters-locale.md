---
title: Localized dates
---

# Localized dates

<p class="description">Date and Time pickers allow to support formats from different locales.</p>

## Getting started

The default locale of MUI is English (United States). If you want to use other locales—follow the instructions below.

:::warning
This page focuses on the date format localization.
If you want to translate the texts inside the components, have a look at the [Translated components](/x/react-date-pickers/localization/) page.
:::

## Set a custom locale

### With `dayjs`

For `dayjs`, you have to import the locale and then pass its name to `LocalizationProvider`:

```tsx
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/de';

<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
  {children}
</LocalizationProvider>;
```

{{"demo": "LocalizationDayjs.js"}}

### With `date-fns`

For `date-fns`, you have to import the locale and pass it to `LocalizationProvider`:

```tsx
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import de from 'date-fns/locale/de';

<LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={de}>
  {children}
</LocalizationProvider>;
```

{{"demo": "LocalizationDateFns.js"}}

### With `luxon`

For `luxon`, you have to pass the locale name to `LocalizationProvider`:

```tsx
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';

<LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale="de">
  {children}
</LocalizationProvider>;
```

{{"demo": "LocalizationLuxon.js"}}

### With `moment`

For `moment`, you have to import the locale and then pass its name to `LocalizationProvider`:

```tsx
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import 'moment/locale/de';

<LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="de">
  {children}
</LocalizationProvider>;
```

{{"demo": "LocalizationMoment.js"}}

:::warning
Some of `moment` methods do not support scoped local.
To have a correct localization, you will have to manually update the global local before updating it in `LocalizationProvider`.

```tsx
function App({ children }) {
  const [locale, setLocale] = React.useState('en-us');

  if (moment.locale() !== locale) {
    moment.locale(locale);
  }

  return (
    <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={locale}>
      <Stack>
        <Button onClick={() => setLocale('de')}>Switch to German</Button>
        {children}
      </Stack>
    </LocalizationProvider>
  );
}
```

:::

## 12h/24h format

All the time and datetime components will automatically adjust to the locale's time setting, i.e. the 12-hour or 24-hour format.
This can be overridden by using the `ampm` prop:

{{"demo": "AmPMCustomization.js"}}

## Custom formats

:::warning
The format received by the props described below depends on the date library you are using.
Please refer to each library documentation for the full format table:

- [Day.js](https://day.js.org/docs/display/format)
- [date-fns](https://date-fns.org/docs/format)
- [Luxon](https://moment.github.io/luxon/#/formatting?id=table-of-tokens)
- [Moment.js](https://momentjs.com/docs/#/displaying/format/)

:::

### Custom field format

The fields have a default format that depends on the picker being used, the views enabled and the 12h/24h format.

If this default format does not suit you, you can customize it using the `format` prop:

:::info
This prop is available on all the fields and all the pickers.
:::

{{"demo": "CustomFieldFormat.js"}}

### Custom toolbar format

To customize the format used in the toolbar, you can use the `toolbarFormat` prop of the toolbar slot.

:::info
This prop is available on all the pickers.
:::

{{"demo": "CustomToolbarFormat.js"}}

### Custom day of week format

To customize day names in calendar header, you can use `dayOfWeekFormatter` which takes as an input the short name of the day provided by the date-library and returns it's formatted version.
The default formatter only keeps the first letter and capitalises it.

:::info
This prop is available on all components rendering a day calendar (`DateCalendar`, all the date pickers, date time pickers and date range pickers)
:::

The example bellow adds a dot at the end of each day in the calendar header:

{{"demo": "CustomDayOfWeekFormat.js"}}
