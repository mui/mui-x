# PickersSectionList API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- [Custom field](/x/react-date-pickers/custom-field/)

## Import

```jsx
import { PickersSectionList } from '@mui/x-date-pickers/PickersSectionList';
// or
import { PickersSectionList } from '@mui/x-date-pickers';
// or
import { PickersSectionList } from '@mui/x-date-pickers-pro';
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| contentEditable | `bool` | - | Yes |  |
| elements | `Array<{ after: object, before: object, container: object, content: object }>` | - | Yes |  |
| classes | `object` | - | No | Override or extend the styles applied to the component. |
| slotProps | `object` | - | No |  |
| slots | `object` | - | No |  |

> **Note**: The `ref` is forwarded to the root element.

## Slots

| Name | Default | Class | Description |
|------|---------|-------|-------------|
| root | `undefined` | `.MuiPickersSectionList-root` |  |
| section | `undefined` | `.MuiPickersSectionList-section` |  |
| sectionContent | `undefined` | `.MuiPickersSectionList-sectionContent` |  |
| sectionSeparator | `undefined` | - |  |

## Source code

If you did not find the information on this page, consider having a look at the implementation of the component for more detail.

- [/packages/x-date-pickers/src/PickersSectionList/PickersSectionList.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-date-pickers/src/PickersSectionList/PickersSectionList.tsx)