---
productId: x-tree-view
title: Tree Item Customization
components: SimpleTreeView, RichTreeView, TreeItem, TreeItem2
packageName: '@mui/x-tree-view'
githubLabel: 'component: tree view'
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
---

# Tree Item Customization

<p class="description">Learn how to customize the Tree Item component.</p>

## Anatomy

Each tree item is shaped by a series of composable slots. Hover over them in the demo below to see each slot.

<!-- TBD which option is the best: interactive or image -->
<!-- {{"demo": "CustomTreeItemDemo.js", "hideToolbar": true}} -->

{{"component": "modules/components/TreeItem2Anatomy.js"}}

### Content

Use the content slot to customize the content of the Tree Item or to replace it with a custom component.

#### Slot props

The `slotProps` prop allows you to pass props to the content component. The demo below shows how to pass an `sx` handler to the content of the Tree Item:

{{"demo": "ContentSlotProps.js"}}

#### Slot

You can entirely replace the slot with a new component.

{{"demo": "ContentSlot.js"}}

### Label

Use the label slot to customize the Tree Item label or to replace it with a custom component.

#### Slot props

The `slotProps` prop allows you to pass props to the label component. The demo below shows how to pass an id attribute to the Tree Item label:

{{"demo": "LabelSlotProps.js"}}

#### Slot

You can entirely replace the slot with a new component.

{{"demo": "LabelSlot.js"}}

### Checkbox

The checkbox is present on the items if `checkboxSelection` is enabled on the tree view.

#### Slot props

You can pass props to the checkbox slot using the `slotProps` on the `TreeItem2` component.

{{"demo": "CheckboxSlotProps.js"}}

#### Slot

You can entirely replace the slot with a new component.

{{"demo": "CheckboxSlot.js"}}

## Basics

### Change nested item's indentation

Use the `itemChildrenIndentation` prop to change the indentation of the nested items.
By default, a nested item is indented by `12px` from its parent item.

{{"demo": "ItemChildrenIndentationProp.js"}}

:::success
This feature is compatible with both the `TreeItem` and `TreeItem2` components
If you are using a custom Tree Item component, and you want to override the padding,
then apply the following padding to your `groupTransition` element:

```ts
const CustomTreeItem2GroupTransition = styled(TreeItem2GroupTransition)(({ theme }) => ({
  // ...other styles
  paddingLeft: `var(--TreeView-itemChildrenIndentation)`,
}
```

If you are using the `indentationAtItemLevel` prop, then instead apply the following padding to your `content` element:

```ts
const CustomTreeItem2Content = styled(TreeItem2Content)(({ theme }) => ({
  // ...other styles
  paddingLeft:
      `calc(${theme.spacing(1)} + var(--TreeView-itemChildrenIndentation) * var(--TreeView-itemDepth))`,
}
```

:::

### Apply the nested item's indentation at the item level

By default, the indentation of nested items is applied by the `groupTransition` slot of its parent (i.e.: the DOM element that wraps all the children of a given item).
This approach is not compatible with upcoming features like the reordering of items using drag & drop.

To apply the indentation at the item level (i.e.: have each item responsible for setting its own indentation using the `padding-left` CSS property on its `content` slot),
you can use the `indentationAtItemLevel` experimental feature.
It will become the default behavior in the next major version of the Tree View component.

{{"demo": "IndentationAtItemLevel.js"}}

:::success
This feature is compatible with both the `TreeItem` and `TreeItem2` components and with the `itemChildrenIndentation` prop.
If you are using a custom Tree Item component, and you want to override the padding,
then apply the following padding to your `content` element:

```ts
const CustomTreeItem2Content = styled(TreeItem2Content)(({ theme }) => ({
  // ...other styles
  paddingLeft:
      `calc(${theme.spacing(1)} + var(--TreeView-itemChildrenIndentation) * var(--TreeView-itemDepth))`,
}
```

:::

## Hooks

### `useTreeItem2`

The `useTreeItem2` allows you to manage and customize individual tree items. You can use it to get the properties needed for all the slots, the status of the item or to tap into the interactive API of the Tree View.

#### Slots properties

The `useTreeItem2` hook offers granular control over the item's layout by providing resolvers to get the appropriate props for each slot. This allows you to build an entirely cutom layout for the tree items.

The demo below shouls you how to get the props needed for each slot, and how to pass them correctly.

{{"demo": "useTreeItem2HookProperties.js"}}

You can pass additional props to a slot or override existing ones by passing an object an argument to the slot's props resolver.

```jsx
<CustomTreeItemContent
  {...getContentProps({
    className: 'overridingClassName',
    newProp: 'I am passing this to the content slot'
  })}
>
```

#### Item status

The `useTreeItem2` hook also returns a `status` object that holds boolean values for the different statuses of the tree item.

```jsx
const {
  status: {
    expanded, // True if he item is expanded.
    expandable, // True if the item has children.
    focused, // True if the item is focused.
    selected, // True if the item is selected.
    disabled, // True if the item is disabled.
    editable, // True if the item is editable.
    editing, // True if the item is being edited.
  },
} = useTreeItem2(props);
```

You can use these statuses to apply custom styling to the item, or conditionally render subcomponents.

{{"demo": "useTreeItem2HookStatus.js"}}

#### Imperative API

The `publicAPI` provides a number of methods to programatically interact with the Tree View. You can use the `useTreeItem2` hook to access the `publicAPI` object from within the Tree Item.

{{"demo": "useTreeItem2HookPublicAPI.js"}}

You can read more about the public API methods on each feature page of the Tree View.

### `useTreeItemUtils`

{{"demo": "HandleCheckboxSelectionDemo.js"}}
