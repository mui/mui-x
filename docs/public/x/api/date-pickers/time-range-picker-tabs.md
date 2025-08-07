# TimeRangePickerTabs API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- Time Range Picker

## Import

```jsx
import { TimeRangePickerTabs } from '@mui/x-date-pickers-pro/TimeRangePicker';
// or
import { TimeRangePickerTabs } from '@mui/x-date-pickers-pro';
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| classes | `object` | - | No | Override or extend the styles applied to the component. |
| hidden | `bool` | ``window.innerHeight < 667` for `DesktopTimeRangePicker` and `MobileTimeRangePicker`, `displayStaticWrapperAs === 'desktop'` for `StaticTimeRangePicker`` | No |  |
| sx | `Array<func \| object \| bool> \| func \| object` | - | No | The system prop that allows defining system overrides as well as additional CSS styles. |
| timeIcon | `element` | `Time` | No |  |

> **Note**: The `ref` is forwarded to the root element.

## CSS

### Rule name

| Global class | Rule name | Description |
|--------------|-----------|-------------|
| - | root | Styles applied to the root element. |
| - | tab | Styles applied to the tab element. |

## Source code

If you did not find the information on this page, consider having a look at the implementation of the component for more detail.

- [/packages/x-date-pickers-pro/src/TimeRangePicker/TimeRangePickerTabs.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-date-pickers-pro/src/TimeRangePicker/TimeRangePickerTabs.tsx)