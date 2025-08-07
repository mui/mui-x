# PickersShortcuts API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- [Custom slots and subcomponents](/x/react-date-pickers/custom-components/)
- [Shortcuts](/x/react-date-pickers/shortcuts/)

## Import

```jsx
import { PickersShortcuts } from '@mui/x-date-pickers/PickersShortcuts';
// or
import { PickersShortcuts } from '@mui/x-date-pickers';
// or
import { PickersShortcuts } from '@mui/x-date-pickers-pro';
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| changeImportance | `'accept' \| 'set'` | `"accept"` | No |  |
| dense | `bool` | `false` | No |  |
| disablePadding | `bool` | `false` | No |  |
| items | `Array<{ getValue: func, id?: string, label: string }>` | `[]` | No |  |
| subheader | `node` | - | No |  |
| sx | `Array<func \| object \| bool> \| func \| object` | - | No | The system prop that allows defining system overrides as well as additional CSS styles. |

> **Note**: The `ref` is forwarded to the root element.

## CSS

### Rule name

| Global class | Rule name | Description |
|--------------|-----------|-------------|
| - | dense | Styles applied to the root element if dense. |
| - | padding | Styles applied to the root element unless `disablePadding={true}`. |
| - | root | Styles applied to the root element. |
| - | subheader | Styles applied to the root element if a `subheader` is provided. |

## Source code

If you did not find the information on this page, consider having a look at the implementation of the component for more detail.

- [/packages/x-date-pickers/src/PickersShortcuts/PickersShortcuts.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-date-pickers/src/PickersShortcuts/PickersShortcuts.tsx)