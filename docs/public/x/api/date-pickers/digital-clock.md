# DigitalClock API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- [Date Time Picker](/x/react-date-pickers/date-time-picker/)
- Date Time Range Picker
- [Digital Clock](/x/react-date-pickers/digital-clock/)
- [Time Picker](/x/react-date-pickers/time-picker/)
- Time Range Picker

## Import

```jsx
import { DigitalClock } from '@mui/x-date-pickers/DigitalClock';
// or
import { DigitalClock } from '@mui/x-date-pickers';
// or
import { DigitalClock } from '@mui/x-date-pickers-pro';
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| ampm | `bool` | `adapter.is12HourCycleInCurrentLocale()` | No |  |
| autoFocus | `bool` | - | No |  |
| classes | `object` | - | No | Override or extend the styles applied to the component. |
| defaultValue | `object` | - | No |  |
| disabled | `bool` | `false` | No |  |
| disableFuture | `bool` | `false` | No |  |
| disableIgnoringDatePartForTimeValidation | `bool` | `false` | No |  |
| disablePast | `bool` | `false` | No |  |
| focusedView | `'hours'` | - | No |  |
| maxTime | `object` | - | No |  |
| minTime | `object` | - | No |  |
| minutesStep | `number` | `1` | No |  |
| onChange | `function(value: TValue, selectionState: PickerSelectionState \| undefined, selectedView: TView \| undefined) => void` | - | No |  |
| onFocusedViewChange | `function(view: TView, hasFocus: boolean) => void` | - | No |  |
| onViewChange | `function(view: TView) => void` | - | No |  |
| openTo | `'hours'` | - | No |  |
| readOnly | `bool` | `false` | No |  |
| referenceDate | `object` | `The closest valid time using the validation props, except callbacks such as `shouldDisableTime`.` | No |  |
| shouldDisableTime | `function(value: PickerValidDate, view: TimeView) => boolean` | - | No |  |
| skipDisabled | `bool` | `false` | No |  |
| slotProps | `object` | `{}` | No |  |
| slots | `object` | `{}` | No |  |
| sx | `Array<func \| object \| bool> \| func \| object` | - | No | The system prop that allows defining system overrides as well as additional CSS styles. |
| timeStep | `number` | `30` | No |  |
| timezone | `string` | `The timezone of the `value` or `defaultValue` prop is defined, 'default' otherwise.` | No |  |
| value | `object` | - | No |  |
| view | `'hours'` | - | No |  |
| views | `Array<'hours'>` | `['hours']` | No |  |

> **Note**: The `ref` is forwarded to the root element (HTMLDivElement).

> Any other props supplied will be provided to the root element (native element).

## Theme default props

You can use `MuiDigitalClock` to change the default props of this component with the theme.

## Slots

| Name | Default | Class | Description |
|------|---------|-------|-------------|
| digitalClockItem | `MenuItem from '@mui/material'` | - | Component responsible for rendering a single digital clock item. |

## CSS

### Rule name

| Global class | Rule name | Description |
|--------------|-----------|-------------|
| - | item | Styles applied to the list item (by default: MenuItem) element. |
| - | list | Styles applied to the list (by default: MenuList) element. |
| - | root | Styles applied to the root element. |

## Source code

If you did not find the information on this page, consider having a look at the implementation of the component for more detail.

- [/packages/x-date-pickers/src/DigitalClock/DigitalClock.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-date-pickers/src/DigitalClock/DigitalClock.tsx)