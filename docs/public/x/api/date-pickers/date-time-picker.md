# DateTimePicker API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- [Date Time Picker](/x/react-date-pickers/date-time-picker/)
- [Date and Time Pickers - Validation](/x/react-date-pickers/validation/)

## Import

```jsx
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
// or
import { DateTimePicker } from '@mui/x-date-pickers';
// or
import { DateTimePicker } from '@mui/x-date-pickers-pro';
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| ampm | `bool` | `adapter.is12HourCycleInCurrentLocale()` | No |  |
| ampmInClock | `bool` | `true on desktop, false on mobile` | No |  |
| autoFocus | `bool` | - | No |  |
| closeOnSelect | `bool` | `false` | No |  |
| dayOfWeekFormatter | `function(date: PickerValidDate) => string` | `(date: PickerValidDate) => adapter.format(date, 'weekdayShort').charAt(0).toUpperCase()` | No |  |
| defaultValue | `object` | - | No |  |
| desktopModeMediaQuery | `string` | `'@media (pointer: fine)'` | No |  |
| disabled | `bool` | `false` | No |  |
| disableFuture | `bool` | `false` | No |  |
| disableHighlightToday | `bool` | `false` | No |  |
| disableIgnoringDatePartForTimeValidation | `bool` | `false` | No |  |
| disableOpenPicker (deprecated) | `bool` | `false` | No | ⚠️ Use the [field component](https://mui.com/x/react-date-pickers/fields/) instead. |
| disablePast | `bool` | `false` | No |  |
| displayWeekNumber | `bool` | - | No |  |
| fixedWeekNumber | `number` | - | No |  |
| format | `string` | - | No |  |
| formatDensity | `'dense' \| 'spacious'` | `"dense"` | No |  |
| inputRef | `ref` | - | No |  |
| label | `node` | - | No |  |
| loading | `bool` | `false` | No |  |
| localeText | `object` | - | No |  |
| maxDate | `object` | `2099-12-31` | No |  |
| maxDateTime | `object` | - | No |  |
| maxTime | `object` | - | No |  |
| minDate | `object` | `1900-01-01` | No |  |
| minDateTime | `object` | - | No |  |
| minTime | `object` | - | No |  |
| minutesStep | `number` | `1` | No |  |
| monthsPerRow | `3 \| 4` | `3` | No |  |
| name | `string` | - | No |  |
| onAccept | `function(value: TValue, context: FieldChangeHandlerContext<TError>) => void` | - | No |  |
| onChange | `function(value: TValue, context: FieldChangeHandlerContext<TError>) => void` | - | No |  |
| onClose | `func` | - | No |  |
| onError | `function(error: TError, value: TValue) => void` | - | No |  |
| onMonthChange | `function(month: PickerValidDate) => void` | - | No |  |
| onOpen | `func` | - | No |  |
| onSelectedSectionsChange | `function(newValue: FieldSelectedSections) => void` | - | No |  |
| onViewChange | `function(view: TView) => void` | - | No |  |
| onYearChange | `function(year: PickerValidDate) => void` | - | No |  |
| open | `bool` | `false` | No |  |
| openTo | `'day' \| 'hours' \| 'meridiem' \| 'minutes' \| 'month' \| 'seconds' \| 'year'` | - | No |  |
| orientation | `'landscape' \| 'portrait'` | - | No |  |
| readOnly | `bool` | `false` | No |  |
| reduceAnimations | `bool` | ``@media(prefers-reduced-motion: reduce)` || `navigator.userAgent` matches Android <10 or iOS <13` | No |  |
| referenceDate | `object` | `The closest valid date-time using the validation props, except callbacks like `shouldDisable<...>`.` | No |  |
| renderLoading | `function() => React.ReactNode` | `() => <span>...</span>` | No |  |
| selectedSections | `'all' \| 'day' \| 'empty' \| 'hours' \| 'meridiem' \| 'minutes' \| 'month' \| 'seconds' \| 'weekDay' \| 'year' \| number` | - | No |  |
| shouldDisableDate | `function(day: PickerValidDate) => boolean` | - | No |  |
| shouldDisableMonth | `function(month: PickerValidDate) => boolean` | - | No |  |
| shouldDisableTime | `function(value: PickerValidDate, view: TimeView) => boolean` | - | No |  |
| shouldDisableYear | `function(year: PickerValidDate) => boolean` | - | No |  |
| showDaysOutsideCurrentMonth | `bool` | `false` | No |  |
| skipDisabled | `bool` | `false` | No |  |
| slotProps | `object` | `{}` | No |  |
| slots | `object` | `{}` | No |  |
| sx | `Array<func \| object \| bool> \| func \| object` | - | No | The system prop that allows defining system overrides as well as additional CSS styles. |
| thresholdToRenderTimeInASingleColumn | `number` | `24` | No |  |
| timeSteps | `{ hours?: number, minutes?: number, seconds?: number }` | `{ hours: 1, minutes: 5, seconds: 5 }` | No |  |
| timezone | `string` | `The timezone of the `value` or `defaultValue` prop is defined, 'default' otherwise.` | No |  |
| value | `object` | - | No |  |
| view | `'day' \| 'hours' \| 'meridiem' \| 'minutes' \| 'month' \| 'seconds' \| 'year'` | - | No |  |
| viewRenderers | `{ day?: func, hours?: func, meridiem?: func, minutes?: func, month?: func, seconds?: func, year?: func }` | - | No |  |
| views | `Array<'day' \| 'hours' \| 'minutes' \| 'month' \| 'seconds' \| 'year'>` | - | No |  |
| yearsOrder | `'asc' \| 'desc'` | `'asc'` | No |  |
| yearsPerRow | `3 \| 4` | `4 on desktop, 3 on mobile` | No |  |

> **Note**: The `ref` is forwarded to the root element (HTMLDivElement).

## Slots

| Name | Default | Class | Description |
|------|---------|-------|-------------|
| actionBar | `PickersActionBar` | - | Custom component for the action bar, it is placed below the Picker views. |
| calendarHeader | `PickersCalendarHeader` | - | Custom component for calendar header.
Check the [PickersCalendarHeader](https://mui.com/x/api/date-pickers/pickers-calendar-header/) component. |
| clearButton | `IconButton` | - | Button to clear the value. |
| clearIcon | `ClearIcon` | - | Icon to display in the button used to clean the value. |
| day | `PickersDay` | - | Custom component for day.
Check the [PickersDay](https://mui.com/x/api/date-pickers/pickers-day/) component. |
| desktopPaper | `PickerPopperPaper` | - | Custom component for the paper rendered inside the desktop picker's Popper. |
| desktopTransition | `Grow or Fade from '@mui/material' when `reduceAnimations` is `true`.` | - | Custom component for the desktop popper [Transition](https://mui.com/material-ui/transitions/). |
| desktopTrapFocus | `TrapFocus from '@mui/material'.` | - | Custom component for trapping the focus inside the views on desktop. |
| dialog | `PickersModalDialogRoot` | - | Custom component for the dialog inside which the views are rendered on mobile. |
| digitalClockItem | `MenuItem from '@mui/material'` | - | Component responsible for rendering a single digital clock item. |
| digitalClockSectionItem | `MenuItem from '@mui/material'` | - | Component responsible for rendering a single multi section digital clock section item. |
| field | `undefined` | - | Component used to enter the date with the keyboard. |
| inputAdornment | `InputAdornment` | - | Component displayed on the start or end input adornment used to open the Picker. |
| layout | `undefined` | - | Custom component for wrapping the layout.
It wraps the toolbar, views, action bar, and shortcuts. |
| leftArrowIcon | `ArrowLeft` | - | Icon displayed in the left view switch button. |
| mobilePaper | `Paper from '@mui/material'.` | - | Custom component for the paper rendered inside the mobile picker's Dialog. |
| mobileTransition | `Fade from '@mui/material'.` | - | Custom component for the mobile dialog [Transition](https://mui.com/material-ui/transitions/). |
| monthButton | `MonthCalendarButton` | - | Button displayed to render a single month in the `month` view. |
| nextIconButton | `IconButton` | - | Button allowing to switch to the right view. |
| openPickerButton | `IconButton` | - | Button to open the Picker. |
| openPickerIcon | `undefined` | - | Icon to display in the button used to open the Picker. |
| popper | `Popper from '@mui/material'.` | - | Custom component for the popper inside which the views are rendered on desktop. |
| previousIconButton | `IconButton` | - | Button allowing to switch to the left view. |
| rightArrowIcon | `ArrowRight` | - | Icon displayed in the right view switch button. |
| shortcuts | `PickersShortcuts` | - | Custom component for the shortcuts. |
| switchViewButton | `IconButton` | - | Button displayed to switch between different calendar views. |
| switchViewIcon | `ArrowDropDown` | - | Icon displayed in the SwitchViewButton. Rotated by 180° when the open view is `year`. |
| tabs | `DateTimePickerTabs` | - | Tabs enabling toggling between date and time pickers. |
| textField | `<PickersTextField />, or <TextField /> from '@mui/material' if `enableAccessibleFieldDOMStructure` is `false`.` | - | Form control with an input to render the value. |
| toolbar | `DateTimePickerToolbar` | - | Custom component for the toolbar rendered above the views. |
| yearButton | `YearCalendarButton` | - | Button displayed to render a single year in the `year` view. |

## Source code

If you did not find the information on this page, consider having a look at the implementation of the component for more detail.

- [/packages/x-date-pickers/src/DateTimePicker/DateTimePicker.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-date-pickers/src/DateTimePicker/DateTimePicker.tsx)