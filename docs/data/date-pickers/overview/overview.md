---
productId: x-date-pickers
title: Date and Time Picker React components
packageName: '@mui/x-date-pickers'
githubLabel: 'component: pickers'
materialDesign: https://m2.material.io/components/date-pickers
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/
---

# Date and Time Pickers

<p class="description">The Date and Time Pickers let the user select date and time values.</p>

{{"component": "modules/components/ComponentLinkHeader.js"}}

## Overview

{{"demo": "CommonlyUsedComponents.js"}}

## Community or Pro Plan?

The Date and Time Pickers are available in two packages:

- `@mui/x-date-pickers`, which is MIT licensed (free forever) and contains all the components to edit a date and/or a time.
- `@mui/x-date-pickers-pro`, which is [commercially licensed](/x/introduction/licensing/#pro-plan) and contains additional components to edit date and/or time ranges.

## Date library

The Date and Time Pickers are focused on UI/UX and, like most other picker components available, require a third-party library to format, parse, and mutate dates.

MUI's components let you choose which library you prefer for this purpose.
This gives you the flexibility to implement any date library you may already be using in your application, without adding an extra one to your bundle.

To achieve this, both `@mui/x-date-pickers` and `@mui/x-date-pickers-pro` export a set of **adapters** that expose the date manipulation libraries under a unified API.

### Available libraries

The Date and Time Pickers currently support the following date libraries:

- [Day.js](https://day.js.org/)
- [date-fns](https://date-fns.org/)
- [Luxon](https://moment.github.io/luxon/#/)
- [Moment.js](https://momentjs.com/)

:::warning
The Date and Time Pickers are not working well with Luxon macro-token (`D`, `DD`, `T`, `TT`, ...),
because of [how they are expanded](https://github.com/mui/mui-x/issues/7615).

If your application is using only a single locale, the easiest solution is to manually [provide a format](/x/react-date-pickers/adapters-locale/#custom-formats) that does not contain any macro-token
(e.g. `M/d/yyyy` instead of `D` for the english locale).

As soon as a solution is found the built-in support will be improved.
:::

:::info
If you are using a non-Gregorian calendar (such as Jalali or Hijri), please refer to the [Support for other calendar systems](/x/react-date-pickers/calendar-systems/) page.
:::

### Recommended library

If you are already using one of the libraries listed above in your application, then you can keep using it with the Date and Time Pickers as well.
This will avoid bundling two libraries.

If you don't have your own requirements or don't manipulate dates outside of MUI components, then the recommendation is to use `dayjs` because it has the smallest impact on your application's bundle size.

Here is the weight added to your gzipped bundle size by each of these libraries when used inside the Date and Time Pickers:

| Library           | Gzipped size |
| :---------------- | -----------: |
| `dayjs@1.11.5`    |       6.77kB |
| `date-fns@2.29.3` |      19.39kB |
| `luxon@3.0.4`     |      23.26kB |
| `moment@2.29.4`   |      20.78kB |

:::info
The results above were obtained in October 2022 with the latest version of each library.
The bundling of the JavaScript modules was done by a Create React App, and no locale was loaded for any of the libraries.

The results may vary in your application depending on the version of each library, the locale, and the bundler used.
:::

## What's next?

Continue to the [next page](/x/react-date-pickers/getting-started/) and learn how to prepare your application for the Date and Time Pickers.
