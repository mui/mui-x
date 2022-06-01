# @mui/x-date-pickers

This package is the community edition of the date and time picker components.
It's part of MUI X, an open core extension of MUI, with advanced components.

## Installation

Install the package in your project directory with:

```sh
// with npm
npm install @mui/x-date-pickers

// with yarn
yarn add @mui/x-date-pickers
```

This component has the following peer dependencies that you will need to install as well.

```json
"peerDependencies": {
  "@mui/material": "^5.4.1",
  "@mui/system": "^5.4.1",
  "react": "^17.0.2 || ^18.0.0"
},
```

You need to provide a date-library that is used by the pickers by setting the `dateAdapter` to an adapter of your choosing.

We currently support 4 different date-libraries:

- [date-fns](https://date-fns.org/)
- [Day.js](https://day.js.org/)
- [Luxon](https://moment.github.io/luxon/#/)
- [Moment.js](https://momentjs.com/)

If you need to use `js-joda`, `date-fns-jalali`, `jalaali`, or `hijri` library, you should be able to find the corresponding date-library from [`@date-io`](https://github.com/dmtrKovalenko/date-io#projects).

First, you have to install the adapter package for the date-library you want to use:

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
  return <LocalizationProvider dateAdapter={AdapterDateFns}>{children}</LocalizationProvider>;
}
```

## Documentation

[The documentation](https://mui.com/x/react-date-pickers/getting-started/)
