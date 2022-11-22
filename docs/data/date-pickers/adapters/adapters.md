---
title: Library to manipulate dates
---

# Library to manipulate dates

<p class="description">Choose which library the pickers must use to manipulate the dates.</p>

## Why do you need a library ?

Like most pickers—the MUI Date and Time Pickers need a library to manipulate the dates.
It will be used to format, parse and mutate the date inside all pickers.

MUI Date and Time Pickers lets you choose which library **you** want to use for the date manipulation.
This lets you pick the library you already use in your application, without adding an extra one in your bundle.

To achieve this, both `@mui/x-date-pickers` and `@mui/x-date-pickers-pro` exports a set of **adapters** which exposes
the date manipulation libraries under a unified api.

## Choosing a date library

### Available libraries

The Date and Time Pickers currently support the following date libraries:

- [Day.js](https://day.js.org/)
- [date-fns](https://date-fns.org/)
- [Luxon](https://moment.github.io/luxon/#/)
- [Moment.js](https://momentjs.com/)

:::info
If you are using another calendar system than the _Gregorian_ one (i.e: _Jalali_ or _Hijri_ calendars)—please refer to the [Support for other calendar systems](#support-for-other-calendar-systems) section.
:::

### Recommended library

If you are already using one of these libraries in your application—you can keep using it for the Date and Time Pickers as well.
This will avoid bundling two libraries.

If you are starting a new project without any date manipulation outside of `@mui/x-date-pickers`—consider using `dayjs` which will have the smallest impact on the bundle size of your application.

Here is the weight added to your gzipped bundle size by each of those libraries when used inside the Date and Time Pickers:

| **Library**       | **Gzipped size** |
| ----------------- | ---------------- |
| `dayjs@1.11.5`    | 6.77kb           |
| `date-fns@2.29.3` | 19.39kb          |
| `luxon@3.0.4`     | 23.26kb          |
| `moment@2.29.4`   | 20.78kb          |

:::info
The results above were obtained in October 2022 with the latest version of each library.
The bundling strategy was taken care of by a _Create React App_ and no locale was loaded for any of the library.

The results may vary in your application depending on the version of each library, the locale and the bundling strategy used.
:::

## Setup a date library

To use a date library inside the Date and Time Pickers, you need to first install it

{{"component": "modules/components/PickersInstallationInstructions.js"}}

You then have to pass its adapter to the `LocalizationProvider`.
The supported adapters as well as `LocalizationProvider` are exported from both the `@mui/x-date-pickers` and `@mui/x-date-pickers-pro` packages.

All the pickers rendered inside this provider will have access to the adapter through a React context.
For that reason, we recommend you to wrap your entire application with a `LocalizationProvider` to be able to use the Date and Time Pickers everywhere.

{{"component": "modules/components/PickersRenderingInstructions.js"}}

## Support for other calendar systems

### Jalali

You can use either the `AdapterDateFnsJalali` adapter which is based on [date-fns-jalali](https://www.npmjs.com/package/date-fns-jalali)
or the `AdapterMomentJalaali` adapter which is based on [moment-jalaali](https://www.npmjs.com/package/moment-jalaali).

The following demo shows how to use the date-fns plugin:

{{"demo": "AdapterJalali.js"}}

### Hijri

You can use the `AdapterMomentHijri` adapter which is based on [moment-hijri](https://www.npmjs.com/package/moment-hijri):

{{"demo": "AdapterHijri.js"}}

### Unsupported libraries

If you need to use a date library that is not supported yet, please [open an issue](https://github.com/mui/mui-x/issues/new/choose) on the MUI X repository.
