# DateTimeRangePickerTabs API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- Date Time Range Picker

## Import

```jsx
import { DateTimeRangePickerTabs } from '@mui/x-date-pickers-pro/DateTimeRangePicker';
// or
import { DateTimeRangePickerTabs } from '@mui/x-date-pickers-pro';
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| classes | `object` | - | No | Override or extend the styles applied to the component. |
| dateIcon | `element` | `DateRangeIcon` | No |  |
| hidden | `bool` | ``window.innerHeight < 667` for `DesktopDateTimeRangePicker` and `MobileDateTimeRangePicker`` | No |  |
| sx | `Array<func \| object \| bool> \| func \| object` | - | No | The system prop that allows defining system overrides as well as additional CSS styles. |
| timeIcon | `element` | `TimeIcon` | No |  |

> **Note**: The `ref` is forwarded to the root element.

## CSS

### Rule name

| Global class | Rule name | Description |
|--------------|-----------|-------------|
| - | filler | Styles applied to the filler element, shown instead of a navigation arrow. |
| - | navigationButton | Styles applied to the tab navigation button elements. |
| - | root | Styles applied to the root element. |
| - | tabButton | Styles applied to the tab button element. |

## Source code

If you did not find the information on this page, consider having a look at the implementation of the component for more detail.

- [/packages/x-date-pickers-pro/src/DateTimeRangePicker/DateTimeRangePickerTabs.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-date-pickers-pro/src/DateTimeRangePicker/DateTimeRangePickerTabs.tsx)