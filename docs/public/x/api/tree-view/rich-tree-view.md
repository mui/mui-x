# RichTreeView API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- [Tree View - Quickstart](/x/react-tree-view/quickstart/)
- [Rich Tree View - Customization](/x/react-tree-view/rich-tree-view/customization/)
- [Rich Tree View - Label editing](/x/react-tree-view/rich-tree-view/editing/)
- [Rich Tree View - Expansion](/x/react-tree-view/rich-tree-view/expansion/)
- [Rich Tree View - Focus](/x/react-tree-view/rich-tree-view/focus/)
- [Rich Tree View - Items](/x/react-tree-view/rich-tree-view/items/)
- [Rich Tree View - Selection](/x/react-tree-view/rich-tree-view/selection/)
- [Tree Item Customization](/x/react-tree-view/tree-item-customization/)

## Import

```jsx
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
// or
import { RichTreeView } from '@mui/x-tree-view';
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| apiRef | `{ current?: { focusItem: func, getItem: func, getItemDOMElement: func, getItemOrderedChildrenIds: func, getItemTree: func, getParentId: func, setEditedItem: func, setIsItemDisabled: func, setItemExpansion: func, setItemSelection: func, updateItemLabel: func } }` | - | No |  |
| checkboxSelection | `bool` | `false` | No |  |
| classes | `object` | - | No | Override or extend the styles applied to the component. |
| defaultExpandedItems | `Array<string>` | `[]` | No |  |
| defaultSelectedItems | `any` | `[]` | No |  |
| disabledItemsFocusable | `bool` | `false` | No |  |
| disableSelection | `bool` | `false` | No |  |
| expandedItems | `Array<string>` | - | No |  |
| expansionTrigger | `'content' \| 'iconContainer'` | `'content'` | No |  |
| getItemChildren | `function(item: R) => Array<R>` | `(item) => item.children` | No |  |
| getItemId | `function(item: R) => string` | `(item) => item.id` | No |  |
| getItemLabel | `function(item: R) => string` | `(item) => item.label` | No |  |
| id | `string` | - | No |  |
| isItemDisabled | `function(item: R) => boolean` | - | No |  |
| isItemEditable | `func \| bool` | `() => false` | No |  |
| itemChildrenIndentation | `number \| string` | `12px` | No |  |
| multiSelect | `bool` | `false` | No |  |
| onExpandedItemsChange | `function(event: React.SyntheticEvent, itemIds: array) => void` | - | No |  |
| onItemClick | `function(event: React.MouseEvent, itemId: string) => void` | - | No |  |
| onItemExpansionToggle | `function(event: React.SyntheticEvent \| null, itemId: array, isExpanded: array) => void` | - | No |  |
| onItemFocus | `function(event: React.SyntheticEvent \| null, itemId: string) => void` | - | No |  |
| onItemLabelChange | `function(itemId: TreeViewItemId, newLabel: string) => void` | - | No |  |
| onItemSelectionToggle | `function(event: React.SyntheticEvent, itemId: array, isSelected: array) => void` | - | No |  |
| onSelectedItemsChange | `function(event: React.SyntheticEvent, itemIds: Array<string> \| string) => void` | - | No |  |
| selectedItems | `any` | - | No |  |
| selectionPropagation | `{ descendants?: bool, parents?: bool }` | `{ parents: false, descendants: false }` | No |  |
| slotProps | `object` | `{}` | No |  |
| slots | `object` | `{}` | No |  |
| sx | `Array<func \| object \| bool> \| func \| object` | - | No | The system prop that allows defining system overrides as well as additional CSS styles. |

> **Note**: The `ref` is forwarded to the root element (HTMLUListElement).

> Any other props supplied will be provided to the root element (native element).

## Theme default props

You can use `MuiRichTreeView` to change the default props of this component with the theme.

## Slots

| Name | Default | Class | Description |
|------|---------|-------|-------------|
| root | `RichTreeViewRoot` | `.MuiRichTreeView-root` | Element rendered at the root. |
| collapseIcon | `undefined` | - | The default icon used to collapse the item. |
| expandIcon | `undefined` | - | The default icon used to expand the item. |
| endIcon | `undefined` | - | The default icon displayed next to an end item.
This is applied to all Tree Items and can be overridden by the TreeItem `icon` slot prop. |
| item | `TreeItem.` | `.MuiRichTreeView-item` | Custom component to render a Tree Item. |

## CSS

### Rule name

| Global class | Rule name | Description |
|--------------|-----------|-------------|
| - | itemCheckbox | Styles applied to the item's checkbox element. |
| - | itemContent | Styles applied to the item's content element. |
| - | itemGroupTransition | Styles applied to the item's transition element. |
| - | itemIconContainer | Styles applied to the item's icon container element icon. |
| - | itemLabel | Styles applied to the item's label element. |
| - | itemLabelInput | Styles applied to the item's label input element (visible only when editing is enabled). |

## Source code

If you did not find the information on this page, consider having a look at the implementation of the component for more detail.

- [/packages/x-tree-view/src/RichTreeView/RichTreeView.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-tree-view/src/RichTreeView/RichTreeView.tsx)