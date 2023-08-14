---
productId: x-date-pickers
title: Date and Time Pickers - Date localization
components: LocalizationProvider
githubLabel: 'component: pickers'
packageName: '@mui/x-date-pickers'
---

# Date localization

<p class="description">Date and Time Pickers support formats from different locales.</p>

## Getting started

The default locale of MUI is English (United States). If you want to use other locales—follow the instructions below.

:::warning
This page focuses on date format localization.
If you need to translate text inside a component, check out the [Translated components](/x/react-date-pickers/localization/) page.
:::

## Set a custom locale

### With `dayjs`

For `dayjs`, import the locale and then pass its name to `LocalizationProvider`:

```tsx
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/de';

<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
  {children}
</LocalizationProvider>;
```

{{"demo": "LocalizationDayjs.js"}}

### With `date-fns`

For `date-fns`, import the locale and pass it to `LocalizationProvider`:

```tsx
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import de from 'date-fns/locale/de';

<LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={de}>
  {children}
</LocalizationProvider>;
```

{{"demo": "LocalizationDateFns.js"}}

### With `luxon`

For `luxon`, pass the locale name to `LocalizationProvider`:

```tsx
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';

<LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale="de">
  {children}
</LocalizationProvider>;
```

{{"demo": "LocalizationLuxon.js"}}

:::warning
The Date and Time Pickers are not working well with Luxon macro-token (`D`, `DD`, `T`, `TT`, ...),
because of [how they are expanded](https://github.com/mui/mui-x/issues/7615).

If your application is using only a single locale, the easiest solution is to manually provide a format that does not contain any macro-token
(e.g. `M/d/yyyy` instead of `D` for the english locale).

As soon as a solution is found the built-in support will be improved.
:::

### With `moment`

For `moment`, import the locale and then pass its name to `LocalizationProvider`:

```tsx
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import 'moment/locale/de';

<LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="de">
  {children}
</LocalizationProvider>;
```

{{"demo": "LocalizationMoment.js"}}

:::warning
Some of the `moment` methods do not support scoped locales.
For accurate localization, you will have to manually update the global locale before updating it in `LocalizationProvider`.

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
You can override the default setting with the `ampm` prop:

{{"demo": "AmPMCustomization.js"}}

## Custom formats

:::warning
The format received by the props described below depends on the date library you are using.
Please refer to each library's documentation for the full format table:

- [Day.js](https://day.js.org/docs/display/format)
- [date-fns](https://date-fns.org/docs/format)
- [Luxon](https://moment.github.io/luxon/#/formatting?id=table-of-tokens)
- [Moment.js](https://momentjs.com/docs/#/displaying/format/)

:::

### Custom field format

The fields have a default format that depends on the picker being used, the views enabled, and the 12h/24h format.

If this default format does not suit you, you can customize it using the `format` prop:

:::info
This prop is available on all fields and pickers.
:::

{{"demo": "CustomFieldFormat.js"}}

:::info
You can control the field format spacing using the [formatDensity](/x/react-date-pickers/custom-field/#change-the-format-density) prop.
:::

### Field-supported formats

Some formats might not yet be supported by the fields.
For example, they don't support day of the year or quarter.

Here is the list of the currently supported formats:

- The year
  - ✅ 2-digits values (e.g: `23`)
  - ✅ 4-digits values (e.g: `2023`)
  - ❌ Values with ordinal (e.g: `2023th`)
- The month

  - ✅ 1-based digit (e.g: `08`)
  - ✅ Multi-letter values (e.g `Aug`, `August`)
  - ❌ 1-letter values (e.g: `A`) because several months are represented with the same letter

- The day of the month

  - ✅ 1-based digit values (e.g: `24`)
  - ✅ 1-based digit values with ordinal (e.g: `24th`)

- The day of the week

  - ✅ 0-based digit values (e.g: `03`)
  - ✅ 1-based digit values (e.g: `04`)
  - ✅ Multi-letter values (e.g: `Tue`, `Tuesday`)
  - ❌ 1-letter values (e.g: `T`) because several days of the week are represented with the same letter

- The hours

  - ✅ 0-based 12-hours values (e.g: `03`)
  - ✅ 0-based 24-hours values (e.g: `15`)
  - ❌ 1-based values (e.g: `24` instead of `00`)

- The minutes

- The seconds

- The meridiem

If you need to use some format that is not yet supported, please [open an issue](https://github.com/mui/mui-x/issues/new/choose) describing what is your exact use case.
Some new formats might be supported in the future, depending on the complexity of the implementation.

### Respect leading zeros in fields

By default, the value rendered in the field always contains digit zeros, even if your format says otherwise.
You can force the field to respect your format information by setting the `shouldRespectLeadingZeros` prop to `true`.

:::warning
When `shouldRespectLeadingZeros={true}`, the field will add an invisible character on the sections containing a single digit to make sure `onChange` is fired.
If you need to get the clean value from the input, you can remove this character using `input.value.replace(/\u200e/g, '')`.
:::

:::warning
Luxon is not able to respect the leading zeroes when using macro tokens (e.g: "DD"), so `shouldRespectLeadingZeros={true}` might lead to inconsistencies when using `AdapterLuxon`.
:::

{{"demo": "RespectLeadingZerosFieldFormat.js"}}

### Custom field placeholder

When a section is empty, the fields displays its placeholder instead of an empty value.
For example, if you did not fill any value for the `year` section, the field will render the year placeholder.

These placeholders are based on your current component localization, not on your date localization.

{{"demo": "FieldPlaceholder.js"}}

For more information on how to define your component localization, check out the [Translated components](/x/react-date-pickers/localization/) page.

:::warning
Placeholders translations depend on locale.
Some locales might keep using English placeholders, because that format is commonly used in a given locale.
:::

### Custom toolbar format

To customize the format used in the toolbar, use the `toolbarFormat` prop of the toolbar slot.

:::info
This prop is available on all pickers.
:::

{{"demo": "CustomToolbarFormat.js"}}

### Custom day of week format

Use `dayOfWeekFormatter` to customize day names in the calendar header.
This prop takes the short name of the day provided by the date library as an input, and returns it's formatted version.
The default formatter only keeps the first letter and capitalises it.

:::info
This prop is available on all components that render a day calendar, including the Date Calendar as well as all Date Pickers, Date Time Pickers, and Date Range Pickers.
:::

The example below adds a dot at the end of each day in the calendar header:

{{"demo": "CustomDayOfWeekFormat.js"}}
