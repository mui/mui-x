---
productId: x-tree-view
title: Rich Tree View - Selection
components: RichTreeView, TreeItem
packageName: '@mui/x-tree-view'
githubLabel: 'component: tree view'
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
---

# Rich Tree View - Selection

<p class="description">Handle how users can select items.</p>

## Single selection

By default, the Tree View allows selecting a single item.

{{"demo": "SingleSelectTreeView.js"}}

:::success
When the Tree View uses single selection, you can select an item by clicking it,
or using the [keyboard shortcuts](/x/react-tree-view/accessibility/#on-single-select-trees).
:::

## Multi selection

Use the `multiSelect` prop to enable multi-selection.

{{"demo": "MultiSelectTreeView.js"}}

:::success
When the Tree View uses multi selection, you can select multiple items using the mouse in two ways:

- To select multiple independent items, hold <kbd class="key">Ctrl</kbd> (or <kbd class="key">⌘ Command</kbd> on macOS) and click the items.
- To select a range of items, click on the first item of the range, then hold the <kbd class="key">Shift</kbd> key while clicking on the last item of the range.

You can also use the [keyboard shortcuts](/x/react-tree-view/accessibility/#on-multi-select-trees) to select items.
:::

## Disable selection

Use the `disableSelection` prop if you don't want your items to be selectable:

{{"demo": "DisableSelection.js"}}

## Checkbox selection

To activate checkbox selection set `checkboxSelection={true}`:

{{"demo": "CheckboxSelection.js"}}

This is also compatible with multi selection:

{{"demo": "CheckboxMultiSelection.js"}}

## Controlled selection

Use the `selectedItems` prop to control the selected items.

You can use the `onSelectedItemsChange` prop to listen to changes in the selected items and update the prop accordingly.

{{"demo": "ControlledSelection.js"}}

:::info

- The selection is **controlled** when its parent manages it by providing a `selectedItems` prop.
- The selection is **uncontrolled** when it is managed by the component's own internal state. This state can be initialized using the `defaultSelectedItems` prop.

Learn more about the _Controlled and uncontrolled_ pattern in the [React documentation](https://react.dev/learn/sharing-state-between-components#controlled-and-uncontrolled-components).
:::

## Track item selection change

Use the `onItemSelectionToggle` prop if you want to react to an item selection change:

{{"demo": "TrackItemSelectionToggle.js"}}

## Parent / children selection relationship

Automatically select an item when all of its children are selected and automatically select all children when the parent is selected.

:::warning
This feature isn't implemented yet. It's coming.

👍 Upvote [issue #4821](https://github.com/mui/mui-x/issues/4821) if you want to see it land faster.

Don't hesitate to leave a comment on the same issue to influence what gets built.
Especially if you already have a use case for this component,
or if you are facing a pain point with your current solution.
:::

If you cannot wait for the official implementation,
you can create your own custom solution using the `selectedItems`,
`onSelectedItemsChange` and `onItemSelectionToggle` props:

{{"demo": "ParentChildrenSelectionRelationship.js"}}
