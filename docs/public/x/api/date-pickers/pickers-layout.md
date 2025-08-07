# PickersLayout API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- [Custom layout](/x/react-date-pickers/custom-layout/)

## Import

```jsx
import { PickersLayout } from '@mui/x-date-pickers/PickersLayout';
// or
import { PickersLayout } from '@mui/x-date-pickers';
// or
import { PickersLayout } from '@mui/x-date-pickers-pro';
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| classes | `object` | - | No | Override or extend the styles applied to the component. |
| slotProps | `object` | `{}` | No |  |
| slots | `object` | `{}` | No |  |
| sx | `Array<func \| object \| bool> \| func \| object` | - | No | The system prop that allows defining system overrides as well as additional CSS styles. |

> **Note**: The `ref` is forwarded to the root element.

## Slots

| Name | Default | Class | Description |
|------|---------|-------|-------------|
| actionBar | `PickersActionBar` | `.MuiPickersLayout-actionBar` | Custom component for the action bar, it is placed below the Picker views. |
| layout | `undefined` | - | Custom component for wrapping the layout.
It wraps the toolbar, views, action bar, and shortcuts. |
| shortcuts | `PickersShortcuts` | `.MuiPickersLayout-shortcuts` | Custom component for the shortcuts. |
| tabs | `undefined` | `.MuiPickersLayout-tabs` | Tabs enabling toggling between views. |
| toolbar | `undefined` | `.MuiPickersLayout-toolbar` | Custom component for the toolbar.
It is placed above the Picker views. |

## CSS

### Rule name

| Global class | Rule name | Description |
|--------------|-----------|-------------|
| - | contentWrapper | Styles applied to the contentWrapper element (which contains the tabs and the view itself). |
| - | landscape | Styles applied to the root element in landscape orientation. |
| - | root | Styles applied to the root element. |

## Source code

If you did not find the information on this page, consider having a look at the implementation of the component for more detail.

- [/packages/x-date-pickers/src/PickersLayout/PickersLayout.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-date-pickers/src/PickersLayout/PickersLayout.tsx)