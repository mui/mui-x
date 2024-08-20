---
productId: x-date-pickers
title: Date and Time Pickers - Date format and localization
components: LocalizationProvider
githubLabel: 'component: pickers'
packageName: '@mui/x-date-pickers'
---

# Date format and localization

<p class="description">Date and Time Pickers support formats from different locales.</p>

## Getting started

The default locale of MUI X is English (United States). If you want to use other locales, follow the instructions below.

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

:::info
Both `date-fns` major versions (v2.x and v3.x) are supported.

A single adapter cannot work for both `date-fns` v2.x and v3.x, because the way functions are exported has been changed in v3.x.

To use `date-fns` v3.x, you will have to import the adapter from `@mui/x-date-pickers/AdapterDateFnsV3` instead of `@mui/x-date-pickers/AdapterDateFns`.
:::

```tsx
// with date-fns v2.x
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// with date-fns v3.x
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
// with date-fns v2.x
import de from 'date-fns/locale/de';
// with date-fns v3.x
import { de } from 'date-fns/locale/de';

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
`AdapterLuxon` does not support `Settings.throwOnInvalid = true` [setting](https://moment.github.io/luxon/api-docs/index.html#settingsthrowoninvalid).

👍 Upvote [issue #11853](https://github.com/mui/mui-x/issues/11853) if you need support for it.

Don't hesitate to leave feedback on how you would like the data entry to behave.
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

## Meridiem — 12h/24h format

All the time and datetime components will automatically adjust to the locale's time setting, that is the 12-hour or 24-hour format.
You can override the default setting with the `ampm` prop:

{{"demo": "AmPMCustomization.js"}}

## Custom formats

The format received by the props described below depends on the date library you are using.
Please refer to each library's documentation for the full format table:

- [Day.js](https://day.js.org/docs/display/format)
- [date-fns](https://date-fns.org/docs/format)
- [Luxon](https://moment.github.io/luxon/#/formatting?id=table-of-tokens)
- [Moment.js](https://momentjs.com/docs/#/displaying/format/)

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
  - ✅ Multi-letter values (for example `Aug`, `August`)
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

You can customize the specific placeholder section translation to your needs.
All the available placeholder translation methods and their parameters are available in [the source file](https://github.com/mui/mui-x/blob/HEAD/packages/x-date-pickers/src/locales/utils/pickersLocaleTextApi.ts).
You can override them using the `localeText` prop defined on the `LocalizationProvider` or on a specific Picker component if you need more fine-grained control.

A common use case is to change the placeholder of the month section to a short letter form (Jan, Feb, etc.).
The default translation implementation might not be what you want, so you can override it:

```tsx
<LocalizationProvider
  dateAdapter={AdapterDayjs}
  localeText={{
    fieldMonthPlaceholder: (params) =>
      params.contentType === 'digit' ? 'MM' : params.format,
  }}
>
  <DatePicker />
</LocalizationProvider>
```

### Custom toolbar format

To customize the format used in the toolbar, use the `toolbarFormat` prop of the `toolbar` slot.

:::info
This prop is available on all pickers.
:::

{{"demo": "CustomToolbarFormat.js"}}

### Custom day of week format

Use `dayOfWeekFormatter` to customize day names in the calendar header.
This prop takes two parameters, `day` (a string with the name of the day) and `date` ( the day in the format of your date library) and returns the formatted string to display.
The default formatter only keeps the first letter of the name and capitalises it.

:::warning
The first parameter `day` will be removed in v7 in favor of the second parameter `date` for more flexibility.
:::

:::info
This prop is available on all components that render a day calendar, including the Date Calendar as well as all Date Pickers, Date Time Pickers, and Date Range Pickers.
:::

The example below adds a dot at the end of each day in the calendar header:

{{"demo": "CustomDayOfWeekFormat.js"}}

### Custom calendar header format

To customize the format used on the calendar header, use the `format` prop of the `calendarHeader` slot.

:::info
This prop is available on all components that render a day calendar, including the Date Calendar as well as all Date Pickers, Date Time Pickers, and Date Range Pickers.
:::

{{"demo": "CustomCalendarHeaderFormat.js"}}

## Custom start of week

The Date and Time Pickers are using the week settings provided by your date libraries.
Each adapter uses its locale to define the start of the week.

If the default start of the week defined in your adapter's locale is not the one you want, you can override it as shown in the following examples.

:::warning
If you want to update the start of the week after the first render of a component,
you will have to manually remount your component to apply the new locale configuration.

:::

### With `dayjs`

For `dayjs`, use the `updateLocale` plugin:

```ts
import updateLocale from 'dayjs/plugin/updateLocale';

dayjs.extend(updateLocale);

// Replace "en" with the name of the locale you want to update.
dayjs.updateLocale('en', {
  // Sunday = 0, Monday = 1.
  weekStart: 1,
});
```

### With `date-fns`

For `date-fns`, override the `options.weekStartsOn` of the used locale:

```ts
import { Locale } from 'date-fns';
// with date-fns v2.x
import enUS from 'date-fns/locale/en-US';
// with date-fns v3.x
import { enUS } from 'date-fns/locale/en-US';

const customEnLocale: Locale = {
  ...enUS,
  options: {
    ...enUS.options,
    // Sunday = 0, Monday = 1.
    weekStartsOn: 1,
  },
};

<LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={customEnLocale}>
```

### With `luxon`

For `luxon`, use the `Settings.defaultWeekSettings` object:

```ts
import { Settings, Info } from 'luxon';

Settings.defaultWeekSettings = {
  // Sunday = 7, Monday = 1.
  firstDay: 1,
  // Makes sure we don't lose the other information from `defaultWeekSettings`
  minimalDays: Info.getMinimumDaysInFirstWeek(),
  weekend: Info.getWeekendWeekdays(),
};
```

:::warning
The [browser API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale/getWeekInfo) used by Luxon to determine the start of the week in the current locale is not yet supported by Firefox.
Users on this browser will always see Monday as the start of the week.
If you want to have the same start of week on all browsers,
you will have to manually override the `defaultWeekSettings` to set the `firstDay` corresponding to your locale.

For example, when using the `en-US` locale:

```ts
Settings.defaultWeekSettings = {
  firstDay: 7,
  minimalDays: Info.getMinimumDaysInFirstWeek(),
  weekend: Info.getWeekendWeekdays(),
};
```

:::

### With `moment`

For `moment`, use the `moment.updateLocale` method:

```ts
import moment from 'moment';

// Replace "en" with the name of the locale you want to update.
moment.updateLocale('en', {
  week: {
    // Sunday = 0, Monday = 1.
    dow: 1,
  },
});
```
