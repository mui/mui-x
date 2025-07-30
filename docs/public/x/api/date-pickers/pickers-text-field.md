# PickersTextField API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- [Custom field](/x/react-date-pickers/custom-field/)

## Import

```jsx
import { PickersTextField } from '@mui/x-date-pickers/PickersTextField';
// or
import { PickersTextField } from '@mui/x-date-pickers';
// or
import { PickersTextField } from '@mui/x-date-pickers-pro';
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| areAllSectionsEmpty | `bool` | - | Yes |  |
| contentEditable | `bool` | - | Yes |  |
| elements | `Array<{ after: object, before: object, container: object, content: object }>` | - | Yes |  |
| color | `'error' \| 'info' \| 'primary' \| 'secondary' \| 'success' \| 'warning'` | `'primary'` | No |  |
| focused | `bool` | - | No |  |
| helperText | `node` | - | No |  |
| hiddenLabel | `bool` | `false` | No |  |
| InputProps | `object` | - | No |  |
| margin | `'dense' \| 'none' \| 'normal'` | `'none'` | No |  |
| required | `bool` | `false` | No |  |
| size | `'medium' \| 'small'` | `'medium'` | No |  |
| sx | `Array<func \| object \| bool> \| func \| object` | - | No | The system prop that allows defining system overrides as well as additional CSS styles. |
| variant | `'filled' \| 'outlined' \| 'standard'` | `'outlined'` | No |  |

> **Note**: The `ref` is forwarded to the root element.

## CSS

### Rule name

| Global class | Rule name | Description |
|--------------|-----------|-------------|
| - | fullWidth | Styles applied to the root element if `fullWidth={true}`. |
| - | marginDense | Styles applied to the root element if `margin="dense"`. |
| - | marginNormal | Styles applied to the root element if `margin="normal"`. |
| - | root | Styles applied to the root element. |

## Source code

If you did not find the information on this page, consider having a look at the implementation of the component for more detail.

- [/packages/x-date-pickers/src/PickersTextField/PickersTextField.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-date-pickers/src/PickersTextField/PickersTextField.tsx)