---
productId: x-date-pickers
title: Date and Time Pickers - Calendar systems
components: LocalizationProvider
githubLabel: 'component: pickers'
packageName: '@mui/x-date-pickers'
---

# Calendar systems

<p class="description">Use the Date and Time Pickers with non-Gregorian calendars.</p>

## Jalali

You can use either the `AdapterDateFnsJalali` adapter, which is based on [date-fns-jalali](https://www.npmjs.com/package/date-fns-jalali),
or the `AdapterMomentJalaali` adapter, which is based on [moment-jalaali](https://www.npmjs.com/package/moment-jalaali).

The following demo shows how to use the `date-fns-jalali` adapter:

{{"demo": "AdapterJalali.js"}}

:::info
We support `date-fns-jalali` package v2.x, v3.x, and v4.x major versions.

A single adapter cannot work for all `date-fns-jalali` versions, because the way functions are exported has been changed in v3.x.

To use `date-fns-jalali` v3.x or v4.x, you will have to import the adapter from `@mui/x-date-pickers/AdapterDateFnsJalaliV3` instead of `@mui/x-date-pickers/AdapterDateFnsJalali`.

```tsx
// with date-fns-jalali v2.x
import { AdapterDateFnsJalali } from '@mui/x-date-pickers/AdapterDateFnsJalali';
// with date-fns-jalali v3.x or v4.x
import { AdapterDateFnsJalali } from '@mui/x-date-pickers/AdapterDateFnsJalaliV3';
```

:::

The following demo shows how to use the `moment-jalaali` adapter:

{{"demo": "AdapterMomentJalali.js"}}

## Hijri

You can use the `AdapterMomentHijri` adapter, which is based on [moment-hijri](https://www.npmjs.com/package/moment-hijri):

{{"demo": "AdapterHijri.js"}}

:::error
The adapter with `moment-hijri` does not support the new fields components because the date library seems buggy when parsing a month only.
If you want to help on the support of hijri calendar, please have a look at [this issue](https://github.com/xsoh/moment-hijri/issues/83).

The demo is based on the [Custom Field—Using a Button](/x/react-date-pickers/custom-field/#using-a-button) demo to let you pick a value using only the view.
You can have a look at the other demos in the [Custom Field—With a custom editing experience](/x/react-date-pickers/custom-field/#with-a-custom-editing-experience) section if you want a different editing experience that works with `AdapterMomentHijri`.
:::

## Unsupported libraries

If you need to use a date library that is not supported yet, please [open an issue](https://github.com/mui/mui-x/issues/new/choose) in the MUI X repository.
