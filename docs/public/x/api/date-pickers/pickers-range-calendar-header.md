# PickersRangeCalendarHeader API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- [Custom slots and subcomponents](/x/react-date-pickers/custom-components/)

## Import

```jsx
import { PickersRangeCalendarHeader } from '@mui/x-date-pickers-pro/PickersRangeCalendarHeader';
// or
import { PickersRangeCalendarHeader } from '@mui/x-date-pickers-pro';
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| calendars | `1 \| 2 \| 3` | - | Yes |  |
| month | `object` | - | Yes |  |
| monthIndex | `number` | - | Yes |  |
| classes | `object` | - | No | Override or extend the styles applied to the component. |
| format | `string` | ``${adapter.formats.month} ${adapter.formats.year}`` | No |  |
| labelId | `string` | - | No |  |
| slotProps | `object` | `{}` | No |  |
| slots | `object` | `{}` | No |  |
| sx | `Array<func \| object \| bool> \| func \| object` | - | No | The system prop that allows defining system overrides as well as additional CSS styles. |

> **Note**: The `ref` is forwarded to the root element (HTMLDivElement).

> Any other props supplied will be provided to the root element (native element).

## CSS

### Rule name

| Global class | Rule name | Description |
|--------------|-----------|-------------|
| - | label | Styles applied to the label element. |
| - | labelContainer | Styles applied to the label container element. |
| - | root | Styles applied to the root element. |
| - | switchViewButton | Styles applied to the switch view button element. |
| - | switchViewIcon | Styles applied to the switch view icon element. |

## Source code

If you did not find the information on this page, consider having a look at the implementation of the component for more detail.

- [/packages/x-date-pickers-pro/src/PickersRangeCalendarHeader/PickersRangeCalendarHeader.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-date-pickers-pro/src/PickersRangeCalendarHeader/PickersRangeCalendarHeader.tsx)