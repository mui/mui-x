# MobileTimePicker API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- [Time Picker](/x/react-date-pickers/time-picker/)
- [Date and Time Pickers - Validation](/x/react-date-pickers/validation/)

## Import

```jsx
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
// or
import { MobileTimePicker } from '@mui/x-date-pickers';
// or
import { MobileTimePicker } from '@mui/x-date-pickers-pro';
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| ampm | `bool` | `adapter.is12HourCycleInCurrentLocale()` | No |  |
| ampmInClock | `bool` | `true on desktop, false on mobile` | No |  |
| autoFocus | `bool` | - | No |  |
| closeOnSelect | `bool` | `false` | No |  |
| defaultValue | `object` | - | No |  |
| disabled | `bool` | `false` | No |  |
| disableFuture | `bool` | `false` | No |  |
| disableIgnoringDatePartForTimeValidation | `bool` | `false` | No |  |
| disableOpenPicker (deprecated) | `bool` | `false` | No | ⚠️ Use the [field component](https://mui.com/x/react-date-pickers/fields/) instead. |
| disablePast | `bool` | `false` | No |  |
| format | `string` | - | No |  |
| formatDensity | `'dense' \| 'spacious'` | `"dense"` | No |  |
| inputRef | `ref` | - | No |  |
| label | `node` | - | No |  |
| localeText | `object` | - | No |  |
| maxTime | `object` | - | No |  |
| minTime | `object` | - | No |  |
| minutesStep | `number` | `1` | No |  |
| name | `string` | - | No |  |
| onAccept | `function(value: TValue, context: FieldChangeHandlerContext<TError>) => void` | - | No |  |
| onChange | `function(value: TValue, context: FieldChangeHandlerContext<TError>) => void` | - | No |  |
| onClose | `func` | - | No |  |
| onError | `function(error: TError, value: TValue) => void` | - | No |  |
| onOpen | `func` | - | No |  |
| onSelectedSectionsChange | `function(newValue: FieldSelectedSections) => void` | - | No |  |
| onViewChange | `function(view: TView) => void` | - | No |  |
| open | `bool` | `false` | No |  |
| openTo | `'hours' \| 'minutes' \| 'seconds'` | - | No |  |
| orientation | `'landscape' \| 'portrait'` | - | No |  |
| readOnly | `bool` | `false` | No |  |
| reduceAnimations | `bool` | ``@media(prefers-reduced-motion: reduce)` || `navigator.userAgent` matches Android <10 or iOS <13` | No |  |
| referenceDate | `object` | `The closest valid date-time using the validation props, except callbacks like `shouldDisable<...>`.` | No |  |
| selectedSections | `'all' \| 'day' \| 'empty' \| 'hours' \| 'meridiem' \| 'minutes' \| 'month' \| 'seconds' \| 'weekDay' \| 'year' \| number` | - | No |  |
| shouldDisableTime | `function(value: PickerValidDate, view: TimeView) => boolean` | - | No |  |
| slotProps | `object` | `{}` | No |  |
| slots | `object` | `{}` | No |  |
| sx | `Array<func \| object \| bool> \| func \| object` | - | No | The system prop that allows defining system overrides as well as additional CSS styles. |
| timezone | `string` | `The timezone of the `value` or `defaultValue` prop is defined, 'default' otherwise.` | No |  |
| value | `object` | - | No |  |
| view | `'hours' \| 'minutes' \| 'seconds'` | - | No |  |
| viewRenderers | `{ hours?: func, minutes?: func, seconds?: func }` | - | No |  |
| views | `Array<'hours' \| 'minutes' \| 'seconds'>` | - | No |  |

> **Note**: The `ref` is forwarded to the root element (HTMLDivElement).

## Slots

| Name | Default | Class | Description |
|------|---------|-------|-------------|
| actionBar | `PickersActionBar` | - | Custom component for the action bar, it is placed below the Picker views. |
| clearButton | `IconButton` | - | Button to clear the value. |
| clearIcon | `ClearIcon` | - | Icon to display in the button used to clean the value. |
| dialog | `PickersModalDialogRoot` | - | Custom component for the dialog inside which the views are rendered on mobile. |
| field | `undefined` | - | Component used to enter the date with the keyboard. |
| inputAdornment | `InputAdornment` | - | Component displayed on the start or end input adornment used to open the Picker. |
| layout | `undefined` | - | Custom component for wrapping the layout.
It wraps the toolbar, views, action bar, and shortcuts. |
| leftArrowIcon | `ArrowLeft` | - | Icon displayed in the left view switch button. |
| mobilePaper | `Paper from '@mui/material'.` | - | Custom component for the paper rendered inside the mobile picker's Dialog. |
| mobileTransition | `Fade from '@mui/material'.` | - | Custom component for the mobile dialog [Transition](https://mui.com/material-ui/transitions/). |
| nextIconButton | `IconButton` | - | Button allowing to switch to the right view. |
| openPickerButton | `IconButton` | - | Button to open the Picker. |
| openPickerIcon | `undefined` | - | Icon to display in the button used to open the Picker. |
| previousIconButton | `IconButton` | - | Button allowing to switch to the left view. |
| rightArrowIcon | `ArrowRight` | - | Icon displayed in the right view switch button. |
| shortcuts | `PickersShortcuts` | - | Custom component for the shortcuts. |
| textField | `<PickersTextField />, or <TextField /> from '@mui/material' if `enableAccessibleFieldDOMStructure` is `false`.` | - | Form control with an input to render the value. |
| toolbar | `TimePickerToolbar` | - | Custom component for the toolbar rendered above the views. |

## Source code

If you did not find the information on this page, consider having a look at the implementation of the component for more detail.

- [/packages/x-date-pickers/src/MobileTimePicker/MobileTimePicker.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-date-pickers/src/MobileTimePicker/MobileTimePicker.tsx)