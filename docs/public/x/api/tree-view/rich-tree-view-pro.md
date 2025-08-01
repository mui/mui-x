# RichTreeViewPro API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- Rich Tree View - Lazy loading
- Rich Tree View - Ordering

## Import

```jsx
import { RichTreeViewPro } from '@mui/x-tree-view-pro/RichTreeViewPro';
// or
import { RichTreeViewPro } from '@mui/x-tree-view-pro';
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| apiRef | `{ current?: { focusItem: func, getItem: func, getItemDOMElement: func, getItemOrderedChildrenIds: func, getItemTree: func, getParentId: func, setEditedItem: func, setIsItemDisabled: func, setItemExpansion: func, setItemSelection: func, updateItemLabel: func } }` | - | No |  |
| canMoveItemToNewPosition | `function(params: object, params.itemId: string, params.oldPosition: TreeViewItemReorderPosition, params.newPosition: TreeViewItemReorderPosition) => boolean` | - | No |  |
| checkboxSelection | `bool` | `false` | No |  |
| classes | `object` | - | No | Override or extend the styles applied to the component. |
| dataSource | `{ getChildrenCount: func, getTreeItems: func }` | - | No |  |
| dataSourceCache | `{ clear: func, get: func, set: func }` | - | No |  |
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
| isItemReorderable | `function(itemId: string) => boolean` | `() => true` | No |  |
| itemChildrenIndentation | `number \| string` | `12px` | No |  |
| itemsReordering | `bool` | `false` | No |  |
| multiSelect | `bool` | `false` | No |  |
| onExpandedItemsChange | `function(event: React.SyntheticEvent, itemIds: array) => void` | - | No |  |
| onItemClick | `function(event: React.MouseEvent, itemId: string) => void` | - | No |  |
| onItemExpansionToggle | `function(event: React.SyntheticEvent \| null, itemId: array, isExpanded: array) => void` | - | No |  |
| onItemFocus | `function(event: React.SyntheticEvent \| null, itemId: string) => void` | - | No |  |
| onItemLabelChange | `function(itemId: TreeViewItemId, newLabel: string) => void` | - | No |  |
| onItemPositionChange | `function(params: object, params.itemId: string, params.oldPosition: TreeViewItemReorderPosition, params.newPosition: TreeViewItemReorderPosition) => void` | - | No |  |
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

You can use `MuiRichTreeViewPro` to change the default props of this component with the theme.

## Slots

| Name | Default | Class | Description |
|------|---------|-------|-------------|
| root | `RichTreeViewProRoot` | `.MuiRichTreeViewPro-root` | Element rendered at the root. |
| collapseIcon | `undefined` | - | The default icon used to collapse the item. |
| expandIcon | `undefined` | - | The default icon used to expand the item. |
| endIcon | `undefined` | - | The default icon displayed next to an end item.
This is applied to all Tree Items and can be overridden by the TreeItem `icon` slot prop. |
| item | `TreeItem.` | `.MuiRichTreeViewPro-item` | Custom component to render a Tree Item. |

## CSS

### Rule name

| Global class | Rule name | Description |
|--------------|-----------|-------------|
| - | itemCheckbox | Styles applied to the item's checkbox element. |
| - | itemContent | Styles applied to the item's content element. |
| - | itemDragAndDropOverlay | Styles applied to the item's drag and drop overlay element. |
| - | itemErrorIcon | Styles applied to the item's error icon element |
| - | itemGroupTransition | Styles applied to the item's transition element. |
| - | itemIconContainer | Styles applied to the item's icon container element icon. |
| - | itemLabel | Styles applied to the item's label element. |
| - | itemLabelInput | Styles applied to the item's label input element (visible only when editing is enabled). |
| - | itemLoadingIcon | Styles applied to the item's loading icon element |

## Source code

If you did not find the information on this page, consider having a look at the implementation of the component for more detail.

- [/packages/x-tree-view-pro/src/RichTreeViewPro/RichTreeViewPro.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-tree-view-pro/src/RichTreeViewPro/RichTreeViewPro.tsx)