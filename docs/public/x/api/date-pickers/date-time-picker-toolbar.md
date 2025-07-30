# DateTimePickerToolbar API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- [Custom slots and subcomponents](/x/react-date-pickers/custom-components/)

## Import

```jsx
import { DateTimePickerToolbar } from '@mui/x-date-pickers/DateTimePicker';
// or
import { DateTimePickerToolbar } from '@mui/x-date-pickers';
// or
import { DateTimePickerToolbar } from '@mui/x-date-pickers-pro';
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| classes | `object` | - | No | Override or extend the styles applied to the component. |
| hidden | `bool` | ``true` for Desktop, `false` for Mobile.` | No |  |
| sx | `Array<func \| object \| bool> \| func \| object` | - | No | The system prop that allows defining system overrides as well as additional CSS styles. |
| toolbarFormat | `string` | - | No |  |
| toolbarPlaceholder | `node` | `"––"` | No |  |
| toolbarTitle | `node` | - | No |  |

> **Note**: The `ref` is forwarded to the root element.

## CSS

### Rule name

| Global class | Rule name | Description |
|--------------|-----------|-------------|
| - | ampmLabel | Styles applied to am/pm labels. |
| - | ampmLandscape | Styles applied to am/pm section in landscape mode. |
| - | ampmSelection | Styles applied to the am/pm section. |
| - | dateContainer | Styles applied to the date container element. |
| - | root | Styles applied to the root element. |
| - | separator | Styles applied to the separator element. |
| - | timeContainer | Styles applied to the time container element. |
| - | timeDigitsContainer | Styles applied to the time (except am/pm) container element. |
| - | timeLabelReverse | Styles applied to the time container if rtl. |

## Source code

If you did not find the information on this page, consider having a look at the implementation of the component for more detail.

- [/packages/x-date-pickers/src/DateTimePicker/DateTimePickerToolbar.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-date-pickers/src/DateTimePicker/DateTimePickerToolbar.tsx)