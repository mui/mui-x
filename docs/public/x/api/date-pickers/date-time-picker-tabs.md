# DateTimePickerTabs API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- [Custom slots and subcomponents](/x/react-date-pickers/custom-components/)

## Import

```jsx
import { DateTimePickerTabs } from '@mui/x-date-pickers/DateTimePicker';
// or
import { DateTimePickerTabs } from '@mui/x-date-pickers';
// or
import { DateTimePickerTabs } from '@mui/x-date-pickers-pro';
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| classes | `object` | - | No | Override or extend the styles applied to the component. |
| dateIcon | `node` | `DateRange` | No |  |
| hidden | `bool` | ``window.innerHeight < 667` for `DesktopDateTimePicker` and `MobileDateTimePicker`, `displayStaticWrapperAs === 'desktop'` for `StaticDateTimePicker`` | No |  |
| sx | `Array<func \| object \| bool> \| func \| object` | - | No | The system prop that allows defining system overrides as well as additional CSS styles. |
| timeIcon | `node` | `Time` | No |  |

> **Note**: The `ref` is forwarded to the root element.

## CSS

### Rule name

| Global class | Rule name | Description |
|--------------|-----------|-------------|
| - | root | Styles applied to the root element. |

## Source code

If you did not find the information on this page, consider having a look at the implementation of the component for more detail.

- [/packages/x-date-pickers/src/DateTimePicker/DateTimePickerTabs.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-date-pickers/src/DateTimePicker/DateTimePickerTabs.tsx)