---
title: Library to manipulate dates
---

# Library to manipulate dates

<p class="description">Choose which library the pickers must use to manipulate the dates.</p>

## Why do you need a library ?

Like most pickers, the MUI Date and Time Pickers need a library to manipulate the dates.
It will be used to format, parse and mutate the date inside all of our components.

The specificity of the MUI Date and Time Pickers is to let you choose which library you want to use for the date manipulation.
This lets you pick the library you already use in your application, without adding an extra one in your bundle.

To achieve this, both `@mui/x-date-pickers` and `@mui/x-date-pickers-pro` exports a set of **adapters** which exposes
the date manipulation libraries under a unified api.

## Choosing a date library

### Available libraries

The Date and Time Pickers currently support 4 date-libraries:

- [Day.js](https://day.js.org/)
- [date-fns](https://date-fns.org/)
- [Luxon](https://moment.github.io/luxon/#/)
- [Moment.js](https://momentjs.com/)

### Recommended library

If you are already using one of these libraries in your application, we recommend using it for our components as well.
This will avoid bundling two libraries.

If you are starting a new project without any date manipulation outside of `@mui/x-date-pickers`,
then we recommend `dayjs` which will have the smallest impact on the bundle size of your application.

Here is the weight added to your gzipped bundle size by each of those libraries.

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

### Using another library ?

TODO

## Setup a date library

To use a date library inside the Date and Time Pickers, you need to first install it

```sh
// For Day.js
yarn add dayjs
npm install dayjs

// For date-fns
yarn add date-fns
npm install date-fns

// For Luxon
yarn add luxon
npm install luxon

// For Moment.js
yarn add moment
npm install moment
```

You then need to pass its adapter to the `LocalizationProvider`.
All the pickers rendered inside this provider will have access to the adapter through a React context.

We recommend you to wrap your entire application with a `LocalizationProvider` to be able to use the Date and Time Pickers everywhere.

```tsx
import { LocalizationProvider } from '@mui/x-date-pickers';

// For Day.js
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// For date-fns
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// For Luxon
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
// For Moment.js
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

function App({ children }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {children}
    </LocalizationProvider>
  );
}
```

:::info
If you are using range pickers, you can import the provider and the adapter directly from `@mui/x-date-pickers-pro`:

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

## Support for other calendar systems

TODO
