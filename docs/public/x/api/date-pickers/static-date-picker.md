# StaticDatePicker API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- [Date Picker](/x/react-date-pickers/date-picker/)
- [Date and Time Pickers - Validation](/x/react-date-pickers/validation/)

## Import

```jsx
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
// or
import { StaticDatePicker } from '@mui/x-date-pickers';
// or
import { StaticDatePicker } from '@mui/x-date-pickers-pro';
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| autoFocus | `bool` | - | No |  |
| dayOfWeekFormatter | `function(date: PickerValidDate) => string` | `(date: PickerValidDate) => adapter.format(date, 'weekdayShort').charAt(0).toUpperCase()` | No |  |
| defaultValue | `object` | - | No |  |
| disabled | `bool` | `false` | No |  |
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
| monthsPerRow | `3 \| 4` | `3` | No |  |
| onAccept | `function(value: TValue, context: FieldChangeHandlerContext<TError>) => void` | - | No |  |
| onChange | `function(value: TValue, context: FieldChangeHandlerContext<TError>) => void` | - | No |  |
| onClose (deprecated) | `func` | - | No | ⚠️ Please avoid using as it will be removed in next major version. |
| onError | `function(error: TError, value: TValue) => void` | - | No |  |
| onMonthChange | `function(month: PickerValidDate) => void` | - | No |  |
| onViewChange | `function(view: TView) => void` | - | No |  |
| onYearChange | `function(year: PickerValidDate) => void` | - | No |  |
| openTo | `'day' \| 'month' \| 'year'` | - | No |  |
| orientation | `'landscape' \| 'portrait'` | - | No |  |
| readOnly | `bool` | `false` | No |  |
| reduceAnimations | `bool` | ``@media(prefers-reduced-motion: reduce)` || `navigator.userAgent` matches Android <10 or iOS <13` | No |  |
| referenceDate | `object` | `The closest valid date-time using the validation props, except callbacks like `shouldDisable<...>`.` | No |  |
| renderLoading | `function() => React.ReactNode` | `() => <span>...</span>` | No |  |
| shouldDisableDate | `function(day: PickerValidDate) => boolean` | - | No |  |
| shouldDisableMonth | `function(month: PickerValidDate) => boolean` | - | No |  |
| shouldDisableYear | `function(year: PickerValidDate) => boolean` | - | No |  |
| showDaysOutsideCurrentMonth | `bool` | `false` | No |  |
| slotProps | `object` | `{}` | No |  |
| slots | `object` | `{}` | No |  |
| sx | `Array<func \| object \| bool> \| func \| object` | - | No | The system prop that allows defining system overrides as well as additional CSS styles. |
| timezone | `string` | `The timezone of the `value` or `defaultValue` prop is defined, 'default' otherwise.` | No |  |
| value | `object` | - | No |  |
| view | `'day' \| 'month' \| 'year'` | - | No |  |
| viewRenderers | `{ day?: func, month?: func, year?: func }` | - | No |  |
| views | `Array<'day' \| 'month' \| 'year'>` | - | No |  |
| yearsOrder | `'asc' \| 'desc'` | `'asc'` | No |  |
| yearsPerRow | `3 \| 4` | ``4` when `displayStaticWrapperAs === 'desktop'`, `3` otherwise.` | No |  |

> **Note**: The `ref` is forwarded to the root element (HTMLDivElement).

## Slots

| Name | Default | Class | Description |
|------|---------|-------|-------------|
| actionBar | `PickersActionBar` | - | Custom component for the action bar, it is placed below the Picker views. |
| calendarHeader | `PickersCalendarHeader` | - | Custom component for calendar header.
Check the [PickersCalendarHeader](https://mui.com/x/api/date-pickers/pickers-calendar-header/) component. |
| day | `PickersDay` | - | Custom component for day.
Check the [PickersDay](https://mui.com/x/api/date-pickers/pickers-day/) component. |
| layout | `undefined` | - | Custom component for wrapping the layout.
It wraps the toolbar, views, action bar, and shortcuts. |
| leftArrowIcon | `ArrowLeft` | - | Icon displayed in the left view switch button. |
| monthButton | `MonthCalendarButton` | - | Button displayed to render a single month in the `month` view. |
| nextIconButton | `IconButton` | - | Button allowing to switch to the right view. |
| previousIconButton | `IconButton` | - | Button allowing to switch to the left view. |
| rightArrowIcon | `ArrowRight` | - | Icon displayed in the right view switch button. |
| shortcuts | `PickersShortcuts` | - | Custom component for the shortcuts. |
| switchViewButton | `IconButton` | - | Button displayed to switch between different calendar views. |
| switchViewIcon | `ArrowDropDown` | - | Icon displayed in the SwitchViewButton. Rotated by 180° when the open view is `year`. |
| toolbar | `DatePickerToolbar` | - | Custom component for the toolbar rendered above the views. |
| yearButton | `YearCalendarButton` | - | Button displayed to render a single year in the `year` view. |

## Source code

If you did not find the information on this page, consider having a look at the implementation of the component for more detail.

- [/packages/x-date-pickers/src/StaticDatePicker/StaticDatePicker.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-date-pickers/src/StaticDatePicker/StaticDatePicker.tsx)