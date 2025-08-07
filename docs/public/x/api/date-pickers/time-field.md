# TimeField API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- [Fields component](/x/react-date-pickers/fields/)
- [Time Field](/x/react-date-pickers/time-field/)

## Import

```jsx
import { TimeField } from '@mui/x-date-pickers/TimeField';
// or
import { TimeField } from '@mui/x-date-pickers';
// or
import { TimeField } from '@mui/x-date-pickers-pro';
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| ampm | `bool` | `adapter.is12HourCycleInCurrentLocale()` | No |  |
| autoFocus | `bool` | `false` | No |  |
| clearable | `bool` | `false` | No |  |
| clearButtonPosition | `'end' \| 'start'` | `'end'` | No |  |
| color | `'error' \| 'info' \| 'primary' \| 'secondary' \| 'success' \| 'warning'` | `'primary'` | No |  |
| defaultValue | `object` | - | No |  |
| disabled | `bool` | `false` | No |  |
| disableFuture | `bool` | `false` | No |  |
| disableIgnoringDatePartForTimeValidation | `bool` | `false` | No |  |
| disablePast | `bool` | `false` | No |  |
| focused | `bool` | - | No |  |
| format | `string` | - | No |  |
| formatDensity | `'dense' \| 'spacious'` | `"dense"` | No |  |
| FormHelperTextProps (deprecated) | `object` | - | No | ⚠️ Use `slotProps.formHelperText` instead. This prop will be removed in a future major release. See [Migrating from deprecated APIs](https://mui.com/material-ui/migration/migrating-from-deprecated-apis/) for more details. |
| fullWidth | `bool` | `false` | No |  |
| helperText | `node` | - | No |  |
| hiddenLabel | `bool` | `false` | No |  |
| id | `string` | - | No |  |
| InputLabelProps (deprecated) | `object` | - | No | ⚠️ Use `slotProps.inputLabel` instead. This prop will be removed in a future major release. See [Migrating from deprecated APIs](https://mui.com/material-ui/migration/migrating-from-deprecated-apis/) for more details. |
| inputProps (deprecated) | `object` | - | No | ⚠️ Use `slotProps.htmlInput` instead. This prop will be removed in a future major release. See [Migrating from deprecated APIs](https://mui.com/material-ui/migration/migrating-from-deprecated-apis/) for more details. |
| InputProps (deprecated) | `object` | - | No | ⚠️ Use `slotProps.input` instead. This prop will be removed in a future major release. See [Migrating from deprecated APIs](https://mui.com/material-ui/migration/migrating-from-deprecated-apis/) for more details. |
| inputRef | `ref` | - | No |  |
| label | `node` | - | No |  |
| margin | `'dense' \| 'none' \| 'normal'` | `'none'` | No |  |
| maxTime | `object` | - | No |  |
| minTime | `object` | - | No |  |
| minutesStep | `number` | `1` | No |  |
| name | `string` | - | No |  |
| onChange | `function(value: TValue, context: FieldChangeHandlerContext<TError>) => void` | - | No |  |
| onClear | `func` | - | No |  |
| onError | `function(error: TError, value: TValue) => void` | - | No |  |
| onSelectedSectionsChange | `function(newValue: FieldSelectedSections) => void` | - | No |  |
| openPickerButtonPosition | `'end' \| 'start'` | `'end'` | No |  |
| readOnly | `bool` | `false` | No |  |
| referenceDate | `object` | `The closest valid date using the validation props, except callbacks such as `shouldDisableDate`. Value is rounded to the most granular section used.` | No |  |
| required | `bool` | `false` | No |  |
| selectedSections | `'all' \| 'day' \| 'empty' \| 'hours' \| 'meridiem' \| 'minutes' \| 'month' \| 'seconds' \| 'weekDay' \| 'year' \| number` | - | No |  |
| shouldDisableTime | `function(value: PickerValidDate, view: TimeView) => boolean` | - | No |  |
| shouldRespectLeadingZeros | `bool` | `false` | No |  |
| size | `'medium' \| 'small'` | `'medium'` | No |  |
| slotProps | `object` | `{}` | No |  |
| slots | `object` | `{}` | No |  |
| sx | `Array<func \| object \| bool> \| func \| object` | - | No | The system prop that allows defining system overrides as well as additional CSS styles. |
| timezone | `string` | `The timezone of the `value` or `defaultValue` prop is defined, 'default' otherwise.` | No |  |
| unstableFieldRef | `func \| object` | - | No |  |
| value | `object` | - | No |  |
| variant | `'filled' \| 'outlined' \| 'standard'` | `'outlined'` | No |  |

> **Note**: The `ref` is forwarded to the root element (HTMLDivElement).

> Any other props supplied will be provided to the root element (native element).

## Theme default props

You can use `MuiTimeField` to change the default props of this component with the theme.

## CSS

### Rule name

| Global class | Rule name | Description |
|--------------|-----------|-------------|
| - | root | Styles applied to the root element. |

## Source code

If you did not find the information on this page, consider having a look at the implementation of the component for more detail.

- [/packages/x-date-pickers/src/TimeField/TimeField.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-date-pickers/src/TimeField/TimeField.tsx)