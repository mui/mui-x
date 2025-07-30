# DayCalendarSkeleton API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- [Date Calendar](/x/react-date-pickers/date-calendar/)

## Import

```jsx
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';
// or
import { DayCalendarSkeleton } from '@mui/x-date-pickers';
// or
import { DayCalendarSkeleton } from '@mui/x-date-pickers-pro';
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| classes | `object` | - | No | Override or extend the styles applied to the component. |
| sx | `Array<func \| object \| bool> \| func \| object` | - | No | The system prop that allows defining system overrides as well as additional CSS styles. |

> **Note**: The `ref` is forwarded to the root element (HTMLDivElement).

> Any other props supplied will be provided to the root element (native element).

## Theme default props

You can use `MuiDayCalendarSkeleton` to change the default props of this component with the theme.

## CSS

### Rule name

| Global class | Rule name | Description |
|--------------|-----------|-------------|
| - | daySkeleton | Styles applied to the day element. |
| - | root | Styles applied to the root element. |
| - | week | Styles applied to the week element. |

## Source code

If you did not find the information on this page, consider having a look at the implementation of the component for more detail.

- [/packages/x-date-pickers/src/DayCalendarSkeleton/DayCalendarSkeleton.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-date-pickers/src/DayCalendarSkeleton/DayCalendarSkeleton.tsx)