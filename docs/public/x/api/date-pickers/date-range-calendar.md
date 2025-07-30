# DateRangeCalendar API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- Date Range Calendar
- Date Range Picker
- Date Time Range Picker

## Import

```jsx
import { DateRangeCalendar } from '@mui/x-date-pickers-pro/DateRangeCalendar';
// or
import { DateRangeCalendar } from '@mui/x-date-pickers-pro';
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| autoFocus | `bool` | - | No |  |
| availableRangePositions | `Array<'end' \| 'start'>` | `['start', 'end']` | No |  |
| calendars | `1 \| 2 \| 3` | `2` | No |  |
| classes | `object` | - | No | Override or extend the styles applied to the component. |
| currentMonthCalendarPosition | `1 \| 2 \| 3` | `1` | No |  |
| dayOfWeekFormatter | `function(date: PickerValidDate) => string` | `(date: PickerValidDate) => adapter.format(date, 'weekdayShort').charAt(0).toUpperCase()` | No |  |
| defaultRangePosition | `'end' \| 'start'` | `'start'` | No |  |
| defaultValue | `Array<object>` | - | No |  |
| disableAutoMonthSwitching | `bool` | `false` | No |  |
| disabled | `bool` | `false` | No |  |
| disableDragEditing | `bool` | `false` | No |  |
| disableFuture | `bool` | `false` | No |  |
| disableHighlightToday | `bool` | `false` | No |  |
| disablePast | `bool` | `false` | No |  |
| displayWeekNumber | `bool` | - | No |  |
| fixedWeekNumber | `number` | - | No |  |
| focusedView | `'day'` | - | No |  |
| loading | `bool` | `false` | No |  |
| maxDate | `object` | `2099-12-31` | No |  |
| minDate | `object` | `1900-01-01` | No |  |
| onChange | `function(value: TValue, selectionState: PickerSelectionState \| undefined, selectedView: TView \| undefined) => void` | - | No |  |
| onFocusedViewChange | `function(view: TView, hasFocus: boolean) => void` | - | No |  |
| onMonthChange | `function(month: PickerValidDate) => void` | - | No |  |
| onRangePositionChange | `function(rangePosition: RangePosition) => void` | - | No |  |
| onViewChange | `function(view: TView) => void` | - | No |  |
| openTo | `'day'` | - | No |  |
| rangePosition | `'end' \| 'start'` | - | No |  |
| readOnly | `bool` | `false` | No |  |
| reduceAnimations | `bool` | ``@media(prefers-reduced-motion: reduce)` || `navigator.userAgent` matches Android <10 or iOS <13` | No |  |
| referenceDate | `Array<object> \| object` | `The closest valid date using the validation props, except callbacks such as `shouldDisableDate`.` | No |  |
| renderLoading | `function() => React.ReactNode` | `() => "..."` | No |  |
| shouldDisableDate | `function(day: PickerValidDate, position: string) => boolean` | - | No |  |
| showDaysOutsideCurrentMonth | `bool` | `false` | No |  |
| slotProps | `object` | `{}` | No |  |
| slots | `object` | `{}` | No |  |
| sx | `Array<func \| object \| bool> \| func \| object` | - | No | The system prop that allows defining system overrides as well as additional CSS styles. |
| timezone | `string` | `The timezone of the `value` or `defaultValue` prop is defined, 'default' otherwise.` | No |  |
| value | `Array<object>` | - | No |  |
| view | `'day'` | - | No |  |
| views | `Array<'day'>` | - | No |  |

> **Note**: The `ref` is forwarded to the root element (HTMLDivElement).

> Any other props supplied will be provided to the root element (native element).

## Theme default props

You can use `MuiDateRangeCalendar` to change the default props of this component with the theme.

## Slots

| Name | Default | Class | Description |
|------|---------|-------|-------------|
| calendarHeader | `PickersCalendarHeader` | - | Custom component for calendar header.
Check the [PickersCalendarHeader](https://mui.com/x/api/date-pickers/pickers-calendar-header/) component. |
| day | `DateRangePickersDay` | - | Custom component for day in range pickers.
Check the [DateRangePickersDay](https://mui.com/x/api/date-pickers/date-range-picker-day/) component. |
| leftArrowIcon | `ArrowLeft` | - | Icon displayed in the left view switch button. |
| nextIconButton | `IconButton` | - | Button allowing to switch to the right view. |
| previousIconButton | `IconButton` | - | Button allowing to switch to the left view. |
| rightArrowIcon | `ArrowRight` | - | Icon displayed in the right view switch button. |
| switchViewButton | `IconButton` | - | Button displayed to switch between different calendar views. |
| switchViewIcon | `ArrowDropDown` | - | Icon displayed in the SwitchViewButton. Rotated by 180° when the open view is `year`. |

## CSS

### Rule name

| Global class | Rule name | Description |
|--------------|-----------|-------------|
| - | dayDragging | Styles applied to the day calendar container when dragging |
| - | monthContainer | Styles applied to the container of a month. |
| - | root | Styles applied to the root element. |

## Source code

If you did not find the information on this page, consider having a look at the implementation of the component for more detail.

- [/packages/x-date-pickers-pro/src/DateRangeCalendar/DateRangeCalendar.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-date-pickers-pro/src/DateRangeCalendar/DateRangeCalendar.tsx)