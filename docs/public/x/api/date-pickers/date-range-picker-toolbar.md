# DateRangePickerToolbar API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- [Custom slots and subcomponents](/x/react-date-pickers/custom-components/)

## Import

```jsx
import { DateRangePickerToolbar } from '@mui/x-date-pickers-pro/DateRangePicker';
// or
import { DateRangePickerToolbar } from '@mui/x-date-pickers-pro';
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
| - | container | Styles applied to the container element. |
| - | root | Styles applied to the root element. |

## Source code

If you did not find the information on this page, consider having a look at the implementation of the component for more detail.

- [/packages/x-date-pickers-pro/src/DateRangePicker/DateRangePickerToolbar.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-date-pickers-pro/src/DateRangePicker/DateRangePickerToolbar.tsx)