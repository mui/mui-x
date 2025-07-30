# DateRangePickerDay2 API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- [Custom slots and subcomponents](/x/react-date-pickers/custom-components/)
- [Customization playground](/x/react-date-pickers/playground/)

## Import

```jsx
import { DateRangePickerDay2 } from '@mui/x-date-pickers-pro/DateRangePickerDay2';
// or
import { DateRangePickerDay2 } from '@mui/x-date-pickers-pro';
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| day | `object` | - | Yes |  |
| isEndOfHighlighting | `bool` | - | Yes |  |
| isEndOfPreviewing | `bool` | - | Yes |  |
| isFirstVisibleCell | `bool` | - | Yes |  |
| isHighlighting | `bool` | - | Yes |  |
| isLastVisibleCell | `bool` | - | Yes |  |
| isPreviewing | `bool` | - | Yes |  |
| isStartOfHighlighting | `bool` | - | Yes |  |
| isStartOfPreviewing | `bool` | - | Yes |  |
| outsideCurrentMonth | `bool` | - | Yes |  |
| action | `func \| { current?: { focusVisible: func } }` | - | No |  |
| centerRipple | `bool` | `false` | No |  |
| classes | `object` | - | No | Override or extend the styles applied to the component. |
| disabled | `bool` | `false` | No |  |
| disableHighlightToday | `bool` | `false` | No |  |
| disableMargin | `bool` | `false` | No |  |
| disableRipple | `bool` | `false` | No |  |
| disableTouchRipple | `bool` | `false` | No |  |
| draggable | `bool` | `false` | No |  |
| focusRipple | `bool` | `false` | No |  |
| focusVisibleClassName | `string` | - | No |  |
| isVisuallySelected | `bool` | - | No |  |
| onFocusVisible | `func` | - | No |  |
| selected | `bool` | `false` | No |  |
| showDaysOutsideCurrentMonth | `bool` | `false` | No |  |
| sx | `Array<func \| object \| bool> \| func \| object` | - | No | The system prop that allows defining system overrides as well as additional CSS styles. |
| today | `bool` | `false` | No |  |
| TouchRippleProps | `object` | - | No |  |
| touchRippleRef | `func \| { current?: { pulsate: func, start: func, stop: func } }` | - | No |  |

> **Note**: The `ref` is forwarded to the root element (HTMLButtonElement).

> Any other props supplied will be provided to the root element (native element).

## Theme default props

You can use `MuiDateRangePickerDay2` to change the default props of this component with the theme.

## CSS

### Rule name

| Global class | Rule name | Description |
|--------------|-----------|-------------|
| - | dayOutsideMonth | Styles applied to the root element if `outsideCurrentMonth=true` and `showDaysOutsideCurrentMonth=true`. |
| `.Mui-disabled` | - | State class applied to the root element if `disabled=true`. |
| - | draggable |  |
| - | endOfMonth |  |
| - | endOfWeek |  |
| - | fillerCell | Styles applied to the root element if `outsideCurrentMonth=true` and `showDaysOutsideCurrentMonth=false`. |
| - | insidePreviewing |  |
| - | insideSelection |  |
| - | previewed |  |
| - | previewEnd |  |
| - | previewStart |  |
| - | root | Styles applied to the root element. |
| `.Mui-selected` | - | State class applied to the root element if `selected=true`. |
| - | selectionEnd |  |
| - | selectionStart |  |
| - | startOfMonth |  |
| - | startOfWeek |  |
| - | today | Styles applied to the root element if `disableHighlightToday=false` and `today=true`. |

## Source code

If you did not find the information on this page, consider having a look at the implementation of the component for more detail.

- [/packages/x-date-pickers-pro/src/DateRangePickerDay2/DateRangePickerDay2.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-date-pickers-pro/src/DateRangePickerDay2/DateRangePickerDay2.tsx)