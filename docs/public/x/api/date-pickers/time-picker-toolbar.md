# TimePickerToolbar API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- [Custom slots and subcomponents](/x/react-date-pickers/custom-components/)

## Import

```jsx
import { TimePickerToolbar } from '@mui/x-date-pickers/TimePicker';
// or
import { TimePickerToolbar } from '@mui/x-date-pickers';
// or
import { TimePickerToolbar } from '@mui/x-date-pickers-pro';
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| classes | `object` | - | No | Override or extend the styles applied to the component. |
| hidden | `bool` | ``true` for Desktop, `false` for Mobile.` | No |  |
| sx | `Array<func \| object \| bool> \| func \| object` | - | No | The system prop that allows defining system overrides as well as additional CSS styles. |
| toolbarFormat | `string` | - | No |  |
| toolbarPlaceholder | `node` | `"––"` | No |  |

> **Note**: The `ref` is forwarded to the root element.

## CSS

### Rule name

| Global class | Rule name | Description |
|--------------|-----------|-------------|
| - | ampmLabel | Styles applied to the meridiem label element. |
| - | ampmLandscape | Styles applied to the meridiem selection element in landscape mode. |
| - | ampmSelection | Styles applied to the meridiem selection element. |
| - | hourMinuteLabel | Styles applied to the time sections element. |
| - | hourMinuteLabelLandscape | Styles applied to the time sections element in landscape mode. |
| - | hourMinuteLabelReverse | Styles applied to the time sections element in "rtl" theme mode. |
| - | root | Styles applied to the root element. |
| - | separator | Styles applied to the separator element. |

## Source code

If you did not find the information on this page, consider having a look at the implementation of the component for more detail.

- [/packages/x-date-pickers/src/TimePicker/TimePickerToolbar.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-date-pickers/src/TimePicker/TimePickerToolbar.tsx)