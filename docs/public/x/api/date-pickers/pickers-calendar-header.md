# PickersCalendarHeader API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- [Custom slots and subcomponents](/x/react-date-pickers/custom-components/)

## Import

```jsx
import { PickersCalendarHeader } from '@mui/x-date-pickers/PickersCalendarHeader';
// or
import { PickersCalendarHeader } from '@mui/x-date-pickers';
// or
import { PickersCalendarHeader } from '@mui/x-date-pickers-pro';
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| classes | `object` | - | No | Override or extend the styles applied to the component. |
| format | `string` | ``${adapter.formats.month} ${adapter.formats.year}`` | No |  |
| labelId | `string` | - | No |  |
| slotProps | `object` | `{}` | No |  |
| slots | `object` | `{}` | No |  |
| sx | `Array<func \| object \| bool> \| func \| object` | - | No | The system prop that allows defining system overrides as well as additional CSS styles. |

> **Note**: The `ref` is forwarded to the root element (HTMLDivElement).

> Any other props supplied will be provided to the root element (native element).

## Theme default props

You can use `MuiPickersCalendarHeader` to change the default props of this component with the theme.

## Slots

| Name | Default | Class | Description |
|------|---------|-------|-------------|
| leftArrowIcon | `ArrowLeft` | - | Icon displayed in the left view switch button. |
| nextIconButton | `IconButton` | - | Button allowing to switch to the right view. |
| previousIconButton | `IconButton` | - | Button allowing to switch to the left view. |
| rightArrowIcon | `ArrowRight` | - | Icon displayed in the right view switch button. |
| switchViewButton | `IconButton` | `.MuiPickersCalendarHeader-switchViewButton` | Button displayed to switch between different calendar views. |
| switchViewIcon | `ArrowDropDown` | `.MuiPickersCalendarHeader-switchViewIcon` | Icon displayed in the SwitchViewButton. Rotated by 180° when the open view is `year`. |

## CSS

### Rule name

| Global class | Rule name | Description |
|--------------|-----------|-------------|
| - | label | Styles applied to the label element. |
| - | labelContainer | Styles applied to the label container element. |
| - | root | Styles applied to the root element. |

## Source code

If you did not find the information on this page, consider having a look at the implementation of the component for more detail.

- [/packages/x-date-pickers/src/PickersCalendarHeader/PickersCalendarHeader.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-date-pickers/src/PickersCalendarHeader/PickersCalendarHeader.tsx)