---
title: Support for other calendar systems
---

# Support for other calendar systems

<p class="description">Use the Date and Time Pickers with non-gregorian calendars.</p>

## Jalali

You can use either the `AdapterDateFnsJalali` adapter which is based on [date-fns-jalali](https://www.npmjs.com/package/date-fns-jalali)
or the `AdapterMomentJalaali` adapter which is based on [moment-jalaali](https://www.npmjs.com/package/moment-jalaali).

The following demo shows how to use the date-fns plugin:

{{"demo": "AdapterJalali.js"}}

## Hijri

You can use the `AdapterMomentHijri` adapter which is based on [moment-hijri](https://www.npmjs.com/package/moment-hijri):

{{"demo": "AdapterHijri.js"}}

## Unsupported libraries

If you need to use a date library that is not supported yet, please [open an issue](https://github.com/mui/mui-x/issues/new/choose) on the MUI X repository.
