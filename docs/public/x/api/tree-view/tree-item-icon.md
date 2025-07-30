# TreeItemIcon API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- [Tree Item Customization](/x/react-tree-view/tree-item-customization/)

## Import

```jsx
import { TreeItemIcon } from '@mui/x-tree-view/TreeItemIcon';
// or
import { TreeItemIcon } from '@mui/x-tree-view';
// or
import { TreeItemIcon } from '@mui/x-tree-view-pro';
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| slotProps | `object` | `{}` | No |  |
| slots | `object` | `{}` | No |  |

> **Note**: The `ref` is forwarded to the root element.

## Slots

| Name | Default | Class | Description |
|------|---------|-------|-------------|
| collapseIcon | `undefined` | - | The icon used to collapse the item. |
| expandIcon | `undefined` | - | The icon used to expand the item. |
| endIcon | `undefined` | - | The icon displayed next to an end item. |
| icon | `undefined` | - | The icon to display next to the Tree Item's label. |

## Source code

If you did not find the information on this page, consider having a look at the implementation of the component for more detail.

- [/packages/x-tree-view/src/TreeItemIcon/TreeItemIcon.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-tree-view/src/TreeItemIcon/TreeItemIcon.tsx)