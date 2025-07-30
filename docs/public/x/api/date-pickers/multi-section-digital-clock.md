# MultiSectionDigitalClock API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- [Date Time Picker](/x/react-date-pickers/date-time-picker/)
- Date Time Range Picker
- [Digital Clock](/x/react-date-pickers/digital-clock/)
- [Time Picker](/x/react-date-pickers/time-picker/)
- Time Range Picker

## Import

```jsx
import { MultiSectionDigitalClock } from '@mui/x-date-pickers/MultiSectionDigitalClock';
// or
import { MultiSectionDigitalClock } from '@mui/x-date-pickers';
// or
import { MultiSectionDigitalClock } from '@mui/x-date-pickers-pro';
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
| focusedView | `'hours' \| 'meridiem' \| 'minutes' \| 'seconds'` | - | No |  |
| maxTime | `object` | - | No |  |
| minTime | `object` | - | No |  |
| minutesStep | `number` | `1` | No |  |
| onChange | `function(value: TValue, selectionState: PickerSelectionState \| undefined, selectedView: TView \| undefined) => void` | - | No |  |
| onFocusedViewChange | `function(view: TView, hasFocus: boolean) => void` | - | No |  |
| onViewChange | `function(view: TView) => void` | - | No |  |
| openTo | `'hours' \| 'meridiem' \| 'minutes' \| 'seconds'` | - | No |  |
| readOnly | `bool` | `false` | No |  |
| referenceDate | `object` | `The closest valid time using the validation props, except callbacks such as `shouldDisableTime`.` | No |  |
| shouldDisableTime | `function(value: PickerValidDate, view: TimeView) => boolean` | - | No |  |
| skipDisabled | `bool` | `false` | No |  |
| slotProps | `object` | `{}` | No |  |
| slots | `object` | `{}` | No |  |
| sx | `Array<func \| object \| bool> \| func \| object` | - | No | The system prop that allows defining system overrides as well as additional CSS styles. |
| timeSteps | `{ hours?: number, minutes?: number, seconds?: number }` | `{ hours: 1, minutes: 5, seconds: 5 }` | No |  |
| timezone | `string` | `The timezone of the `value` or `defaultValue` prop is defined, 'default' otherwise.` | No |  |
| value | `object` | - | No |  |
| view | `'hours' \| 'meridiem' \| 'minutes' \| 'seconds'` | - | No |  |
| views | `Array<'hours' \| 'meridiem' \| 'minutes' \| 'seconds'>` | `['hours', 'minutes']` | No |  |

> **Note**: The `ref` is forwarded to the root element (HTMLDivElement).

> Any other props supplied will be provided to the root element (native element).

## Theme default props

You can use `MuiMultiSectionDigitalClock` to change the default props of this component with the theme.

## Slots

| Name | Default | Class | Description |
|------|---------|-------|-------------|
| digitalClockSectionItem | `MenuItem from '@mui/material'` | - | Component responsible for rendering a single multi section digital clock section item. |

## CSS

### Rule name

| Global class | Rule name | Description |
|--------------|-----------|-------------|
| - | root | Styles applied to the root element. |

## Source code

If you did not find the information on this page, consider having a look at the implementation of the component for more detail.

- [/packages/x-date-pickers/src/MultiSectionDigitalClock/MultiSectionDigitalClock.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-date-pickers/src/MultiSectionDigitalClock/MultiSectionDigitalClock.tsx)