# MUI X Date Pickers Pro

This package is the Pro plan edition of the Date and Time Picker Components.
It's part of [MUI X](https://mui.com/x/), an open-core extension of our Core libraries, with advanced components.

## Installation

Install the package in your project directory with:

```bash
npm install @mui/x-date-pickers-pro
```

Then install the date library of your choice (if not already installed).
The pickers currently support the following date libraries:

- [date-fns](https://date-fns.org/)
- [Day.js](https://day.js.org/)
- [Luxon](https://moment.github.io/luxon/#/)
- [Moment.js](https://momentjs.com/)

```bash
# date-fns
npm install date-fns

# or dayjs
npm install dayjs

# or luxon
npm install luxon

# or moment
npm install moment
```

This component has the following peer dependencies that you need to install as well.

```json
"peerDependencies": {
  "@mui/material": "^5.15.14 || ^6.0.0",
  "react": "^17.0.0 || ^18.0.0 || ^19.0.0",
  "react-dom": "^17.0.0 || ^18.0.0 || ^19.0.0"
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

Visit [https://mui.com/x/react-date-pickers/](https://mui.com/x/react-date-pickers/) to view the full documentation.
