# TreeItem API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- [Tree View - Quickstart](/x/react-tree-view/quickstart/)
- [Rich Tree View - Customization](/x/react-tree-view/rich-tree-view/customization/)
- [Rich Tree View - Label editing](/x/react-tree-view/rich-tree-view/editing/)
- [Rich Tree View - Expansion](/x/react-tree-view/rich-tree-view/expansion/)
- [Rich Tree View - Focus](/x/react-tree-view/rich-tree-view/focus/)
- [Rich Tree View - Items](/x/react-tree-view/rich-tree-view/items/)
- Rich Tree View - Lazy loading
- Rich Tree View - Ordering
- [Rich Tree View - Selection](/x/react-tree-view/rich-tree-view/selection/)
- [Simple Tree View - Customization](/x/react-tree-view/simple-tree-view/customization/)
- [Simple Tree View - Expansion](/x/react-tree-view/simple-tree-view/expansion/)
- [Simple Tree View - Focus](/x/react-tree-view/simple-tree-view/focus/)
- [Simple Tree View - Items](/x/react-tree-view/simple-tree-view/items/)
- [Simple Tree View - Selection](/x/react-tree-view/simple-tree-view/selection/)
- [Tree Item Customization](/x/react-tree-view/tree-item-customization/)

## Import

```jsx
import { TreeItem } from '@mui/x-tree-view/TreeItem';
// or
import { TreeItem } from '@mui/x-tree-view';
// or
import { TreeItem } from '@mui/x-tree-view-pro';
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| itemId | `string` | - | Yes |  |
| children | `any` | - | No |  |
| classes | `object` | - | No | Override or extend the styles applied to the component. |
| disabled | `bool` | `false` | No |  |
| id | `string` | - | No |  |
| label | `node` | - | No |  |
| onBlur | `func` | - | No |  |
| onFocus | `unsupportedProp` | - | No |  |
| onKeyDown | `func` | - | No |  |
| slotProps | `object` | `{}` | No |  |
| slots | `object` | `{}` | No |  |
| sx | `Array<func \| object \| bool> \| func \| object` | - | No | The system prop that allows defining system overrides as well as additional CSS styles. |

> **Note**: The `ref` is forwarded to the root element (HTMLLIElement).

> Any other props supplied will be provided to the root element (native element).

## Theme default props

You can use `MuiTreeItem` to change the default props of this component with the theme.

## Slots

| Name | Default | Class | Description |
|------|---------|-------|-------------|
| root | `TreeItemRoot` | `.MuiTreeItem-root` | The component that renders the root. |
| content | `TreeItemContent` | `.MuiTreeItem-content` | The component that renders the content of the item.
(e.g.: everything related to this item, not to its children). |
| groupTransition | `TreeItemGroupTransition` | `.MuiTreeItem-groupTransition` | The component that renders the children of the item. |
| iconContainer | `TreeItemIconContainer` | `.MuiTreeItem-iconContainer` | The component that renders the icon. |
| checkbox | `TreeItemCheckbox` | `.MuiTreeItem-checkbox` | The component that renders the item checkbox for selection. |
| label | `TreeItemLabel` | `.MuiTreeItem-label` | The component that renders the item label. |
| labelInput | `TreeItemLabelInput` | `.MuiTreeItem-labelInput` | The component that renders the input to edit the label when the item is editable and is currently being edited. |
| dragAndDropOverlay | `TreeItemDragAndDropOverlay` | `.MuiTreeItem-dragAndDropOverlay` | The component that renders the overlay when an item reordering is ongoing.
Warning: This slot is only useful when using the `` component. |
| errorIcon | `TreeItemErrorContainer` | `.MuiTreeItem-errorIcon` | The component that is rendered when the item is in an error state.
Warning: This slot is only useful when using the `` component is lazy loading is enabled. |
| loadingIcon | `TreeItemLoadingContainer` | `.MuiTreeItem-loadingIcon` | The component that is rendered when the item is in an loading state.
Warning: This slot is only useful when using the `` component is lazy loading is enabled. |
| collapseIcon | `undefined` | - | The icon used to collapse the item. |
| expandIcon | `undefined` | - | The icon used to expand the item. |
| endIcon | `undefined` | - | The icon displayed next to an end item. |
| icon | `undefined` | - | The icon to display next to the Tree Item's label. |

## CSS

### Rule name

| Global class | Rule name | Description |
|--------------|-----------|-------------|
| `.Mui-disabled` | - | State class applied to the content element when the item is disabled. |
| - | editable | State class applied to the content element when the item is editable. |
| - | editing | State class applied to the content element when the item is being edited. |
| `.Mui-expanded` | - | State class applied to the content element when the item is expanded. |
| `.Mui-focused` | - | State class applied to the content element when the item is focused. |
| `.Mui-selected` | - | State class applied to the content element when the item is selected. |

## Source code

If you did not find the information on this page, consider having a look at the implementation of the component for more detail.

- [/packages/x-tree-view/src/TreeItem/TreeItem.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-tree-view/src/TreeItem/TreeItem.tsx)