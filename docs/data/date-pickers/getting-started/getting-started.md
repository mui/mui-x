---
product: date-pickers
title: Date picker, Time picker React components
components: DatePicker,DateTimePicker,TimePicker
githubLabel: 'component: DatePicker'
materialDesign: https://material.io/components/date-pickers
waiAria: https://www.w3.org/WAI/ARIA/apg/example-index/dialog-modal/datepicker-dialog.html
packageName: '@mui/x-date-pickers'
---

# Date / Time pickers

<p class="description">Date pickers and Time pickers allow selecting a single value from a pre-determined set.</p>

- On mobile, pickers are best suited for display in a confirmation dialog.
- For inline display, such as on a form, consider using compact controls such as segmented dropdown buttons.

## React components

{{"demo": "MaterialUIPickers.js"}}

### Setup

#### Package installation

You need to install 3 different types of package to make the pickers work:

1. **The component** (`@mui/x-date-pickers` or `@mui/x-date-pickers-pro`) manages the rendering.
2. **The date-library** ([`moment`](https://momentjs.com/), [`dayjs`](https://day.js.org/), ...) manages the date manipulation.
3. **The adapter** ([`@date-io`](https://github.com/dmtrKovalenko/date-io#projects)) exposes your favorite **date-library** under a unified api used by **component**.

First you have to install the date-library you want to use to manage dates, and the component package:

{{"demo": "InstructionsNoSnap.js", "bg": "inline", "hideToolbar": true, "disableAd": true}}

We currently support 4 different date-libraries:

- [date-fns](https://date-fns.org/) adapted by `@date-io/date-fns`.
- [Day.js](https://day.js.org/) adapted by `@date-io/dayjs`.
- [Luxon](https://moment.github.io/luxon/#/) adapted by `@date-io/luxon`.
- [Moment.js](https://momentjs.com/) adapted by `@date-io/moment`.

If you need to use `js-joda`, `date-fns-jalali`, `moment-jalaali`, or `moment-hijri` library, you should be able to find the corresponding date-library from [`@date-io`](https://github.com/dmtrKovalenko/date-io#projects).
In such a case, you will have to install both the _date-library_ and the corresponding `@date-io` adapter.

```jsx
// To use moment-jalaali
yarn add moment-jalaali
yarn add @date-io/jalaali
```

#### Code setup

After installation completed, you have to set the `dateAdapter` prop of the `LocalizationProvider` accordingly.
The supported adapters are exported from both the `@mui/x-date-pickers` and `@mui/x-date-pickers-pro`.

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

If you use another library you should import the adapter directly from the `@date-io` package as follow.

```jsx
import AdapterJalaali from '@date-io/jalaali';

function App({ children }) {
  return (
    <LocalizationProvider dateAdapter={AdapterJalaali}>
      {children}
    </LocalizationProvider>
  );
}
```

### Unsupported libraries

To use a date-library that is not supported yet by `@date-io`, you will have to write an adapter.
Which means writing a file containing the default formats, and the methods.
As an example, you can look to the [`dayjs` adapter](https://github.com/dmtrKovalenko/date-io/blob/master/packages/dayjs/src/dayjs-utils.ts).

In such a case, don't hesitate to open a PR to get some help.

## TypeScript

In order to benefit from the [CSS overrides](/material-ui/customization/theme-components/#global-style-overrides) and [default prop customization](/material-ui/customization/theme-components/#default-props) with the theme, TypeScript users need to import the following types.
Internally, it uses module augmentation to extend the default theme structure.

```tsx
// When using TypeScript 4.x and above
import type {} from '@mui/x-date-pickers/themeAugmentation';
import type {} from '@mui/x-date-pickers-pro/themeAugmentation';
// When using TypeScript 3.x and below
import '@mui/x-date-pickers/themeAugmentation';
import '@mui/x-date-pickers-pro/themeAugmentation';

const theme = createTheme({
  components: {
    MuiDatePicker: {
      styleOverrides: {
        root: {
          backgroundColor: 'red',
        },
      },
    },
  },
});
```

:::info
You don't have to import the theme augmentation from both `@mui/x-date-pickers` and `@mui/x-date-pickers-pro` when using `@mui/x-date-pickers-pro`.
Importing it from `@mui/x-date-pickers-pro` is enough.
:::

## Native pickers

:::warning
Native input controls support by browsers [isn't perfect](https://caniuse.com/#feat=input-datetime).
:::

Native date (`type="date"`), time (`type="time"`) and date&time (`type="datetime-local"`) pickers.

{{"demo": "NativePickers.js"}}
