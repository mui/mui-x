# StaticDateRangePicker API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- Date Range Picker
- [Date and Time Pickers - Validation](/x/react-date-pickers/validation/)

## Import

```jsx
import { StaticDateRangePicker } from '@mui/x-date-pickers-pro/StaticDateRangePicker';
// or
import { StaticDateRangePicker } from '@mui/x-date-pickers-pro';
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| autoFocus | `bool` | - | No |  |
| calendars | `1 \| 2 \| 3` | `1 if `displayStaticWrapperAs === 'mobile'`, 2 otherwise.` | No |  |
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
| displayStaticWrapperAs | `'desktop' \| 'mobile'` | `"mobile"` | No |  |
| displayWeekNumber | `bool` | - | No |  |
| fixedWeekNumber | `number` | - | No |  |
| loading | `bool` | `false` | No |  |
| localeText | `object` | - | No |  |
| maxDate | `object` | `2099-12-31` | No |  |
| minDate | `object` | `1900-01-01` | No |  |
| onAccept | `function(value: TValue, context: FieldChangeHandlerContext<TError>) => void` | - | No |  |
| onChange | `function(value: TValue, context: FieldChangeHandlerContext<TError>) => void` | - | No |  |
| onClose (deprecated) | `func` | - | No | ⚠️ Please avoid using as it will be removed in next major version. |
| onError | `function(error: TError, value: TValue) => void` | - | No |  |
| onMonthChange | `function(month: PickerValidDate) => void` | - | No |  |
| onRangePositionChange | `function(rangePosition: RangePosition) => void` | - | No |  |
| rangePosition | `'end' \| 'start'` | - | No |  |
| readOnly | `bool` | `false` | No |  |
| reduceAnimations | `bool` | ``@media(prefers-reduced-motion: reduce)` || `navigator.userAgent` matches Android <10 or iOS <13` | No |  |
| referenceDate | `Array<object> \| object` | `The closest valid date-time using the validation props, except callbacks like `shouldDisable<...>`.` | No |  |
| renderLoading | `function() => React.ReactNode` | `() => "..."` | No |  |
| shouldDisableDate | `function(day: PickerValidDate, position: string) => boolean` | - | No |  |
| showDaysOutsideCurrentMonth | `bool` | `false` | No |  |
| slotProps | `object` | `{}` | No |  |
| slots | `object` | `{}` | No |  |
| sx | `Array<func \| object \| bool> \| func \| object` | - | No | The system prop that allows defining system overrides as well as additional CSS styles. |
| timezone | `string` | `The timezone of the `value` or `defaultValue` prop is defined, 'default' otherwise.` | No |  |
| value | `Array<object>` | - | No |  |
| viewRenderers | `{ day?: func }` | - | No |  |

> **Note**: The `ref` is forwarded to the root element (HTMLDivElement).

## Slots

| Name | Default | Class | Description |
|------|---------|-------|-------------|
| actionBar | `PickersActionBar` | - | Custom component for the action bar, it is placed below the Picker views. |
| calendarHeader | `PickersCalendarHeader` | - | Custom component for calendar header.
Check the [PickersCalendarHeader](https://mui.com/x/api/date-pickers/pickers-calendar-header/) component. |
| day | `DateRangePickersDay` | - | Custom component for day in range pickers.
Check the [DateRangePickersDay](https://mui.com/x/api/date-pickers/date-range-picker-day/) component. |
| layout | `undefined` | - | Custom component for wrapping the layout.
It wraps the toolbar, views, action bar, and shortcuts. |
| leftArrowIcon | `ArrowLeft` | - | Icon displayed in the left view switch button. |
| nextIconButton | `IconButton` | - | Button allowing to switch to the right view. |
| previousIconButton | `IconButton` | - | Button allowing to switch to the left view. |
| rightArrowIcon | `ArrowRight` | - | Icon displayed in the right view switch button. |
| shortcuts | `PickersShortcuts` | - | Custom component for the shortcuts. |
| switchViewButton | `IconButton` | - | Button displayed to switch between different calendar views. |
| switchViewIcon | `ArrowDropDown` | - | Icon displayed in the SwitchViewButton. Rotated by 180° when the open view is `year`. |
| toolbar | `DateTimePickerToolbar` | - | Custom component for the toolbar rendered above the views. |

## Source code

If you did not find the information on this page, consider having a look at the implementation of the component for more detail.

- [/packages/x-date-pickers-pro/src/StaticDateRangePicker/StaticDateRangePicker.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-date-pickers-pro/src/StaticDateRangePicker/StaticDateRangePicker.tsx)