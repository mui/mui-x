# @mui/x-date-pickers-pro

This package is the commercial edition of the date and time picker components.
It's part of MUI X, an open-core extension of MUI, with advanced components.

## Installation

Install the package in your project directory with:

```sh
npm install @mui/x-date-pickers-pro
```

Then install the date library of your choice (if not already installed).
We currently support 4 different date libraries:

- [date-fns](https://date-fns.org/)
- [Day.js](https://day.js.org/)
- [Luxon](https://moment.github.io/luxon/#/)
- [Moment.js](https://momentjs.com/)

```sh
// date-fns
npm install date-fns
// or dayjs
npm install dayjs
// or luxon
npm install luxon
// or moment
npm install moment
```

This component has the following peer dependencies that you will need to install as well.

```json
"peerDependencies": {
  "@mui/base": "^5.0.0-alpha.87",
  "@mui/material": "^5.8.6",
  "@mui/system": "^5.8.0",
  "react": "^17.0.0 || ^18.0.0",
  "react-dom": "^17.0.0 || ^18.0.0"
},
```

After completing the installation, you have to set the `dateAdapter` prop of the `LocalizationProvider` accordingly.
The supported adapters are exported from `@mui/x-date-pickers-pro`.

```js
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
// date-fns
import { AdapterDateFns } from '@mui/x-date-pickers-pro/AdapterDateFns';
// or for dayjs
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
// or for luxon
import { AdapterLuxon } from '@mui/x-date-pickers-pro/AdapterLuxon';
// or for moment
import { AdapterMoment } from '@mui/x-date-pickers-pro/AdapterMoment';

function App({ children }) {
  return <LocalizationProvider dateAdapter={AdapterDateFns}>{children}</LocalizationProvider>;
}
```

## Documentation

[The documentation](https://mui.com/x/react-date-pickers/getting-started/)
