# YearCalendar API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- [Custom slots and subcomponents](/x/react-date-pickers/custom-components/)
- [Date Calendar](/x/react-date-pickers/date-calendar/)

## Import

```jsx
import { YearCalendar } from '@mui/x-date-pickers/YearCalendar';
// or
import { YearCalendar } from '@mui/x-date-pickers';
// or
import { YearCalendar } from '@mui/x-date-pickers-pro';
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| classes | `object` | - | No | Override or extend the styles applied to the component. |
| defaultValue | `object` | - | No |  |
| disabled | `bool` | `false` | No |  |
| disableFuture | `bool` | `false` | No |  |
| disableHighlightToday | `bool` | `false` | No |  |
| disablePast | `bool` | `false` | No |  |
| maxDate | `object` | `2099-12-31` | No |  |
| minDate | `object` | `1900-01-01` | No |  |
| onChange | `function(value: PickerValidDate) => void` | - | No |  |
| readOnly | `bool` | `false` | No |  |
| referenceDate | `object` | `The closest valid year using the validation props, except callbacks such as `shouldDisableYear`.` | No |  |
| shouldDisableYear | `function(year: PickerValidDate) => boolean` | - | No |  |
| slotProps | `object` | `{}` | No |  |
| slots | `object` | `{}` | No |  |
| sx | `Array<func \| object \| bool> \| func \| object` | - | No | The system prop that allows defining system overrides as well as additional CSS styles. |
| timezone | `string` | `The timezone of the `value` or `defaultValue` prop is defined, 'default' otherwise.` | No |  |
| value | `object` | - | No |  |
| yearsOrder | `'asc' \| 'desc'` | `'asc'` | No |  |
| yearsPerRow | `3 \| 4` | `3` | No |  |

> **Note**: The `ref` is forwarded to the root element (HTMLDivElement).

> Any other props supplied will be provided to the root element (native element).

## Theme default props

You can use `MuiYearCalendar` to change the default props of this component with the theme.

## Slots

| Name | Default | Class | Description |
|------|---------|-------|-------------|
| yearButton | `YearCalendarButton` | - | Button displayed to render a single year in the `year` view. |

## CSS

### Rule name

| Global class | Rule name | Description |
|--------------|-----------|-------------|
| - | button | Styles applied to the button element that represents a single year |
| `.Mui-disabled` | - | Styles applied to a disabled button element. |
| - | root | Styles applied to the root element. |
| `.Mui-selected` | - | Styles applied to a selected button element. |

## Source code

If you did not find the information on this page, consider having a look at the implementation of the component for more detail.

- [/packages/x-date-pickers/src/YearCalendar/YearCalendar.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-date-pickers/src/YearCalendar/YearCalendar.tsx)