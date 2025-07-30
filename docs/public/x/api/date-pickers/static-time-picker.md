# StaticTimePicker API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- [Time Picker](/x/react-date-pickers/time-picker/)
- [Date and Time Pickers - Validation](/x/react-date-pickers/validation/)

## Import

```jsx
import { StaticTimePicker } from '@mui/x-date-pickers/StaticTimePicker';
// or
import { StaticTimePicker } from '@mui/x-date-pickers';
// or
import { StaticTimePicker } from '@mui/x-date-pickers-pro';
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| ampm | `bool` | `adapter.is12HourCycleInCurrentLocale()` | No |  |
| ampmInClock | `bool` | `true on desktop, false on mobile` | No |  |
| autoFocus | `bool` | - | No |  |
| defaultValue | `object` | - | No |  |
| disabled | `bool` | `false` | No |  |
| disableFuture | `bool` | `false` | No |  |
| disableIgnoringDatePartForTimeValidation | `bool` | `false` | No |  |
| disablePast | `bool` | `false` | No |  |
| displayStaticWrapperAs | `'desktop' \| 'mobile'` | `"mobile"` | No |  |
| localeText | `object` | - | No |  |
| maxTime | `object` | - | No |  |
| minTime | `object` | - | No |  |
| minutesStep | `number` | `1` | No |  |
| onAccept | `function(value: TValue, context: FieldChangeHandlerContext<TError>) => void` | - | No |  |
| onChange | `function(value: TValue, context: FieldChangeHandlerContext<TError>) => void` | - | No |  |
| onClose (deprecated) | `func` | - | No | ⚠️ Please avoid using as it will be removed in next major version. |
| onError | `function(error: TError, value: TValue) => void` | - | No |  |
| onViewChange | `function(view: TView) => void` | - | No |  |
| openTo | `'hours' \| 'minutes' \| 'seconds'` | - | No |  |
| orientation | `'landscape' \| 'portrait'` | - | No |  |
| readOnly | `bool` | `false` | No |  |
| reduceAnimations | `bool` | ``@media(prefers-reduced-motion: reduce)` || `navigator.userAgent` matches Android <10 or iOS <13` | No |  |
| referenceDate | `object` | `The closest valid date-time using the validation props, except callbacks like `shouldDisable<...>`.` | No |  |
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
| layout | `undefined` | - | Custom component for wrapping the layout.
It wraps the toolbar, views, action bar, and shortcuts. |
| leftArrowIcon | `ArrowLeft` | - | Icon displayed in the left view switch button. |
| nextIconButton | `IconButton` | - | Button allowing to switch to the right view. |
| previousIconButton | `IconButton` | - | Button allowing to switch to the left view. |
| rightArrowIcon | `ArrowRight` | - | Icon displayed in the right view switch button. |
| shortcuts | `PickersShortcuts` | - | Custom component for the shortcuts. |
| toolbar | `TimePickerToolbar` | - | Custom component for the toolbar rendered above the views. |

## Source code

If you did not find the information on this page, consider having a look at the implementation of the component for more detail.

- [/packages/x-date-pickers/src/StaticTimePicker/StaticTimePicker.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-date-pickers/src/StaticTimePicker/StaticTimePicker.tsx)