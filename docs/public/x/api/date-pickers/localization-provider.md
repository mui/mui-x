# LocalizationProvider API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- [Date format and localization](/x/react-date-pickers/adapters-locale/)
- [Calendar systems](/x/react-date-pickers/calendar-systems/)
- [Translated components](/x/react-date-pickers/localization/)
- [UTC and timezones](/x/react-date-pickers/timezone/)

## Import

```jsx
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// or
import { LocalizationProvider } from '@mui/x-date-pickers';
// or
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| adapterLocale | `any` | - | No |  |
| dateAdapter | `func` | - | No |  |
| dateFormats | `{ dayOfMonth?: string, dayOfMonthFull?: string, fullDate?: string, fullTime12h?: string, fullTime24h?: string, hours12h?: string, hours24h?: string, keyboardDate?: string, keyboardDateTime12h?: string, keyboardDateTime24h?: string, meridiem?: string, minutes?: string, month?: string, monthShort?: string, normalDate?: string, normalDateWithWeekday?: string, seconds?: string, shortDate?: string, weekday?: string, weekdayShort?: string, year?: string }` | - | No |  |
| dateLibInstance | `any` | - | No |  |
| localeText | `object` | - | No |  |

> **Note**: The `ref` is forwarded to the root element.

> Any other props supplied will be provided to the root element (native element).

## Source code

If you did not find the information on this page, consider having a look at the implementation of the component for more detail.

- [/packages/x-date-pickers/src/LocalizationProvider/LocalizationProvider.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-date-pickers/src/LocalizationProvider/LocalizationProvider.tsx)