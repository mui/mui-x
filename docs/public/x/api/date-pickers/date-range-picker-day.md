# DateRangePickerDay API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- Date Range Picker
- Date Time Range Picker

## Import

```jsx
import { DateRangePickerDay } from '@mui/x-date-pickers-pro/DateRangePickerDay';
// or
import { DateRangePickerDay } from '@mui/x-date-pickers-pro';
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

## CSS

### Rule name

| Global class | Rule name | Description |
|--------------|-----------|-------------|
| - | day | Styles applied to the day element. |
| - | dayInsideRangeInterval | Styles applied to the day element if `selected=false` and `isHighlighting=true`. |
| - | dayOutsideRangeInterval | Styles applied to the day element if `isHighlighting=false`. |
| - | endOfMonth | Styles applied to the root element if `day` is the end of the month. |
| - | firstVisibleCell | Styles applied to the root element if `day` is the first visible cell of the month. |
| - | hiddenDayFiller | Styles applied to the root element if it is an empty cell used to fill the week. |
| - | lastVisibleCell | Styles applied to the root element if `day` is the last visible cell of the month. |
| - | notSelectedDate | Styles applied to the day element if `selected=false`. |
| - | outsideCurrentMonth | Styles applied to the root element if `outsideCurrentMonth=true` |
| - | rangeIntervalDayHighlight | Styles applied to the root element if `isHighlighting=true`. |
| - | rangeIntervalDayHighlightEnd | Styles applied to the root element if `isEndOfHighlighting=true`. |
| - | rangeIntervalDayHighlightStart | Styles applied to the root element if `isStartOfHighlighting=true`. |
| - | rangeIntervalDayPreview | Styles applied to the root element if `isPreviewing=true`. |
| - | rangeIntervalDayPreviewEnd | Styles applied to the root element if `isEndOfPreviewing=true`. |
| - | rangeIntervalDayPreviewStart | Styles applied to the root element if `isStartOfPreviewing=true`. |
| - | rangeIntervalPreview | Styles applied to the preview element. |
| - | root | Styles applied to the root element. |
| - | startOfMonth | Styles applied to the root element if `day` is the start of the month. |

## Source code

If you did not find the information on this page, consider having a look at the implementation of the component for more detail.

- [/packages/x-date-pickers-pro/src/DateRangePickerDay/DateRangePickerDay.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-date-pickers-pro/src/DateRangePickerDay/DateRangePickerDay.tsx)