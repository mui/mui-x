---
product: date-pickers
title: Date picker, Time picker React components
components: DatePicker,DateTimePicker,TimePicker
githubLabel: 'component: DatePicker'
materialDesign: https://material.io/components/date-pickers
waiAria: https://www.w3.org/TR/wai-aria-practices/examples/dialog-modal/datepicker-dialog.html
packageName: '@mui/x-date-pickers'
---

# Date / Time pickers

<p class="description">Date pickers and Time pickers allow selecting a single value from a pre-determined set.</p>

- On mobile, pickers are best suited for display in a confirmation dialog.
- For inline display, such as on a form, consider using compact controls such as segmented dropdown buttons.

## React components

{{"demo": "MaterialUIPickers.js"}}

### Setup

You need to provide a date-library that is used by the pickers by setting the `dateAdapter` to an adapter of your choosing.

We currently support 4 different date-libraries:

- [date-fns](https://date-fns.org/)
- [Day.js](https://day.js.org/)
- [Luxon](https://moment.github.io/luxon/#/)
- [Moment.js](https://momentjs.com/)

If you need to use `js-joda`, `date-fns-jalali`, `jalaali`, or `hijri` library, you should be able to find the corresponding date-library from [`@date-io`](https://github.com/dmtrKovalenko/date-io#projects).

First you have to install the adapter package for the date-library you want to use:

```sh
// date-fns
npm install @date-io/date-fns
// or for Day.js
npm install @date-io/dayjs
// or for Luxon
npm install @date-io/luxon
// or for Moment.js
npm install @date-io/moment
```

Then you have to set the `dateAdapter` prop of the `LocalizationProvider` accordingly:

```js
// date-fns
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// or for Day.js
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// or for Luxon
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
// or for Moment.js
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

function App({ children }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      {children}
    </LocalizationProvider>
  );
}
```

## Native pickers

⚠️ Native input controls support by browsers [isn't perfect](https://caniuse.com/#feat=input-datetime).

Native date (`type="date"`), time (`type="time"`) and date&time (`type="datetime-local"`) pickers.

{{"demo": "NativePickers.js"}}
