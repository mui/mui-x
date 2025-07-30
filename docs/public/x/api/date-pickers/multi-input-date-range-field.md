# MultiInputDateRangeField API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- Date Range Field
- [Fields component](/x/react-date-pickers/fields/)

## Import

```jsx
import { MultiInputDateRangeField } from '@mui/x-date-pickers-pro/MultiInputDateRangeField';
// or
import { MultiInputDateRangeField } from '@mui/x-date-pickers-pro';
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| autoFocus | `bool` | `false` | No |  |
| classes | `object` | - | No | Override or extend the styles applied to the component. |
| dateSeparator | `string` | `"–"` | No |  |
| defaultValue | `Array<object>` | - | No |  |
| direction | `'column-reverse' \| 'column' \| 'row-reverse' \| 'row' \| Array<'column-reverse' \| 'column' \| 'row-reverse' \| 'row'> \| object` | `'column'` | No |  |
| disabled | `bool` | `false` | No |  |
| disableFuture | `bool` | `false` | No |  |
| disablePast | `bool` | `false` | No |  |
| divider | `node` | - | No |  |
| format | `string` | - | No |  |
| formatDensity | `'dense' \| 'spacious'` | `"dense"` | No |  |
| maxDate | `object` | `2099-12-31` | No |  |
| minDate | `object` | `1900-01-01` | No |  |
| onChange | `function(value: TValue, context: FieldChangeHandlerContext<TError>) => void` | - | No |  |
| onError | `function(error: TError, value: TValue) => void` | - | No |  |
| onSelectedSectionsChange | `function(newValue: FieldSelectedSections) => void` | - | No |  |
| readOnly | `bool` | `false` | No |  |
| referenceDate | `Array<object> \| object` | `The closest valid date using the validation props, except callbacks such as `shouldDisableDate`. Value is rounded to the most granular section used.` | No |  |
| selectedSections | `'all' \| 'day' \| 'empty' \| 'hours' \| 'meridiem' \| 'minutes' \| 'month' \| 'seconds' \| 'weekDay' \| 'year' \| number` | - | No |  |
| shouldDisableDate | `function(day: PickerValidDate, position: string) => boolean` | - | No |  |
| shouldRespectLeadingZeros | `bool` | `false` | No |  |
| slotProps | `object` | `{}` | No |  |
| slots | `object` | `{}` | No |  |
| spacing | `Array<number \| string> \| number \| object \| string` | `0` | No |  |
| sx | `Array<func \| object \| bool> \| func \| object` | - | No | The system prop that allows defining system overrides as well as additional CSS styles. |
| timezone | `string` | `The timezone of the `value` or `defaultValue` prop is defined, 'default' otherwise.` | No |  |
| useFlexGap | `bool` | `false` | No |  |
| value | `Array<object>` | - | No |  |

> **Note**: The `ref` is forwarded to the root element (HTMLDivElement).

> Any other props supplied will be provided to the root element (native element).

## Theme default props

You can use `MuiMultiInputDateRangeField` to change the default props of this component with the theme.

## Slots

| Name | Default | Class | Description |
|------|---------|-------|-------------|
| root | `MultiInputRangeFieldRoot` | `.MuiMultiInputDateRangeField-root` | Element rendered at the root. |
| separator | `MultiInputRangeFieldSeparator` | `.MuiMultiInputDateRangeField-separator` | Element rendered between the two inputs. |
| textField | `<PickersTextField />, or <TextField /> from '@mui/material' if `enableAccessibleFieldDOMStructure` is `false`.` | - | Form control with an input to render a date.
It is rendered twice: once for the start date and once for the end date. |

## Source code

If you did not find the information on this page, consider having a look at the implementation of the component for more detail.

- [/packages/x-date-pickers-pro/src/MultiInputDateRangeField/MultiInputDateRangeField.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-date-pickers-pro/src/MultiInputDateRangeField/MultiInputDateRangeField.tsx)