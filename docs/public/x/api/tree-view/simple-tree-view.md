# SimpleTreeView API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- [Tree View - Quickstart](/x/react-tree-view/quickstart/)
- [Simple Tree View - Customization](/x/react-tree-view/simple-tree-view/customization/)
- [Simple Tree View - Expansion](/x/react-tree-view/simple-tree-view/expansion/)
- [Simple Tree View - Focus](/x/react-tree-view/simple-tree-view/focus/)
- [Simple Tree View - Items](/x/react-tree-view/simple-tree-view/items/)
- [Simple Tree View - Selection](/x/react-tree-view/simple-tree-view/selection/)
- [Tree Item Customization](/x/react-tree-view/tree-item-customization/)

## Import

```jsx
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
// or
import { SimpleTreeView } from '@mui/x-tree-view';
// or
import { SimpleTreeView } from '@mui/x-tree-view-pro';
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| apiRef | `{ current?: { focusItem: func, getItem: func, getItemDOMElement: func, getItemOrderedChildrenIds: func, getItemTree: func, getParentId: func, setIsItemDisabled: func, setItemExpansion: func, setItemSelection: func } }` | - | No |  |
| checkboxSelection | `bool` | `false` | No |  |
| children | `node` | - | No |  |
| classes | `object` | - | No | Override or extend the styles applied to the component. |
| defaultExpandedItems | `Array<string>` | `[]` | No |  |
| defaultSelectedItems | `any` | `[]` | No |  |
| disabledItemsFocusable | `bool` | `false` | No |  |
| disableSelection | `bool` | `false` | No |  |
| expandedItems | `Array<string>` | - | No |  |
| expansionTrigger | `'content' \| 'iconContainer'` | `'content'` | No |  |
| id | `string` | - | No |  |
| itemChildrenIndentation | `number \| string` | `12px` | No |  |
| multiSelect | `bool` | `false` | No |  |
| onExpandedItemsChange | `function(event: React.SyntheticEvent, itemIds: array) => void` | - | No |  |
| onItemClick | `function(event: React.MouseEvent, itemId: string) => void` | - | No |  |
| onItemExpansionToggle | `function(event: React.SyntheticEvent \| null, itemId: array, isExpanded: array) => void` | - | No |  |
| onItemFocus | `function(event: React.SyntheticEvent \| null, itemId: string) => void` | - | No |  |
| onItemSelectionToggle | `function(event: React.SyntheticEvent, itemId: array, isSelected: array) => void` | - | No |  |
| onSelectedItemsChange | `function(event: React.SyntheticEvent, itemIds: Array<string> \| string) => void` | - | No |  |
| selectedItems | `any` | - | No |  |
| selectionPropagation | `{ descendants?: bool, parents?: bool }` | `{ parents: false, descendants: false }` | No |  |
| slotProps | `object` | - | No |  |
| slots | `object` | - | No |  |
| sx | `Array<func \| object \| bool> \| func \| object` | - | No | The system prop that allows defining system overrides as well as additional CSS styles. |

> **Note**: The `ref` is forwarded to the root element (HTMLUListElement).

> Any other props supplied will be provided to the root element (native element).

## Theme default props

You can use `MuiSimpleTreeView` to change the default props of this component with the theme.

## Slots

| Name | Default | Class | Description |
|------|---------|-------|-------------|
| root | `SimpleTreeViewRoot` | `.MuiSimpleTreeView-root` | Element rendered at the root. |
| collapseIcon | `undefined` | - | The default icon used to collapse the item. |
| expandIcon | `undefined` | - | The default icon used to expand the item. |
| endIcon | `undefined` | - | The default icon displayed next to an end item.
This is applied to all Tree Items and can be overridden by the TreeItem `icon` slot prop. |

## CSS

### Rule name

| Global class | Rule name | Description |
|--------------|-----------|-------------|
| - | item | Styles applied to the item's root element. |
| - | itemCheckbox | Styles applied to the item's checkbox element. |
| - | itemContent | Styles applied to the item's content element. |
| - | itemGroupTransition | Styles applied to the item's transition element. |
| - | itemIconContainer | Styles applied to the item's icon container element icon. |
| - | itemLabel | Styles applied to the item's label element. |

## Source code

If you did not find the information on this page, consider having a look at the implementation of the component for more detail.

- [/packages/x-tree-view/src/SimpleTreeView/SimpleTreeView.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-tree-view/src/SimpleTreeView/SimpleTreeView.tsx)