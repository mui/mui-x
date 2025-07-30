# TimeRangePickerToolbar API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- Time Range Picker

## Import

```jsx
import { TimeRangePickerToolbar } from '@mui/x-date-pickers-pro/TimeRangePicker';
// or
import { TimeRangePickerToolbar } from '@mui/x-date-pickers-pro';
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| classes | `object` | - | No | Override or extend the styles applied to the component. |
| hidden | `bool` | ``true` for Desktop, `false` for Mobile.` | No |  |
| sx | `Array<func \| object \| bool> \| func \| object` | - | No | The system prop that allows defining system overrides as well as additional CSS styles. |
| toolbarPlaceholder | `node` | `"––"` | No |  |

> **Note**: The `ref` is forwarded to the root element.

## CSS

### Rule name

| Global class | Rule name | Description |
|--------------|-----------|-------------|
| - | container | Styles applied to the container element. |
| - | root | Styles applied to the root element. |
| - | separator | Styles applied to the separator element. |
| - | timeContainer | Styles applied to the time container element. |

## Source code

If you did not find the information on this page, consider having a look at the implementation of the component for more detail.

- [/packages/x-date-pickers-pro/src/TimeRangePicker/TimeRangePickerToolbar.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-date-pickers-pro/src/TimeRangePicker/TimeRangePickerToolbar.tsx)