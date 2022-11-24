---
product: date-pickers
title: Date Picker, Time Picker React components
githubLabel: 'component: pickers'
materialDesign: https://m2.material.io/components/date-pickers
waiAria: https://www.w3.org/WAI/ARIA/apg/example-index/dialog-modal/datepicker-dialog.html
packageName: '@mui/x-date-pickers'
---

# Date / Time Pickers

<p class="description">Date pickers and Time pickers allow selecting a single value from a pre-determined set.</p>

{{"component": "modules/components/ComponentLinkHeader.js"}}

- On mobile, pickers are best suited for display in a confirmation dialog.
- For inline display, such as on a form, consider using compact controls such as segmented dropdown buttons.

## React components

{{"demo": "MaterialUIPickers.js"}}

### Setup

#### Package installation

You need to install 3 different types of package to make the pickers work:

1. **The component** (`@mui/x-date-pickers` or `@mui/x-date-pickers-pro`) manages the rendering.
2. **The date-library** ([`moment`](https://momentjs.com/), [`dayjs`](https://day.js.org/), ...) manages the date manipulation.
3. **The adapter** (`@mui/x-date-pickers/AdapterDateFns`) exposes your favorite **date-library** under a unified api used by **component** thanks to [`@date-io`](https://github.com/dmtrKovalenko/date-io#projects).

First you have to install the date-library you want to use to manage dates, and the component package:

{{"demo": "InstructionsNoSnap.js", "bg": "inline", "hideToolbar": true, "disableAd": true}}

Here are the supported date-libraries and their specific calendar system:

- [date-fns](https://date-fns.org/): `@mui/x-date-pickers/AdapterDateFns`, adapted by `@date-io/date-fns`.
- [Day.js](https://day.js.org/): `@mui/x-date-pickers/AdapterDayjs`, adapted by `@date-io/dayjs`.
- [Luxon](https://moment.github.io/luxon/#/): `@mui/x-date-pickers/AdapterLuxon`, adapted by `@date-io/luxon`.
- [Moment.js](https://momentjs.com/): `@mui/x-date-pickers/AdapterMoment`, adapted by `@date-io/moment`.
- [date-fns-jalali](https://https://github.com/date-fns-jalali/date-fns-jalali/): `@mui/x-date-pickers/AdapterDateFnsJalali`, adapted by `@date-io/date-fns-jalali`.
- [moment-jalaali](https://https://github.com/jalaali/moment-jalaali/): `@mui/x-date-pickers/AdapterMomentJalaali`, adapted by `@date-io/jalaali`.
- [moment-hijri](https://https://github.com/xsoh/moment-hijri/): `@mui/x-date-pickers/AdapterMomentHijri`, adapted by `@date-io/hijri`.

#### Code setup

After installation completed, you have to set the `dateAdapter` prop of the `LocalizationProvider` accordingly.
The supported adapters are exported from both the `@mui/x-date-pickers` and `@mui/x-date-pickers-pro`.

```js
import { LocalizationProvider } from '@mui/x-date-pickers';

// Day.js
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// or for date-fns
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// or for Luxon
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
// or for Moment.js
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

function App({ children }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {children}
    </LocalizationProvider>
  );
}
```

If you use another library you should import the adapter directly from the `@date-io` package as follow.

```jsx
import { LocalizationProvider } from '@mui/x-date-pickers';
import AdapterJalaali from '@date-io/jalaali';

function App({ children }) {
  return (
    <LocalizationProvider dateAdapter={AdapterJalaali}>
      {children}
    </LocalizationProvider>
  );
}
```

:::info
If you are using range pickers, you can import the provided and the adapter directly from `@mui/x-date-pickers-pro`:

```js
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';

function App({ children }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {children}
    </LocalizationProvider>
  );
}
```

:::

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

## Testing caveats

:::info
Some test environments (i.e. `jsdom`) do not support media query. In such cases, components will be rendered in desktop mode. To modify this behavior you can fake the `window.matchMedia`.
:::

Be aware that running tests in headless browsers might not pass the default mediaQuery (`pointer: fine`).
In such case you can [force pointer precision](https://github.com/microsoft/playwright/issues/7769#issuecomment-1205106311) via browser flags or preferences.
