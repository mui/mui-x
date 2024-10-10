---
productId: x-tree-view
title: Tree Item Customization
components: SimpleTreeView, RichTreeView, TreeItem, TreeItemIcon, TreeItemProvider
packageName: '@mui/x-tree-view'
githubLabel: 'component: tree view'
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
---

# Tree Item Customization

<p class="description">Learn how to customize the Tree Item component.</p>

## Anatomy

Each Tree Item component is shaped by a series of composable slots.
Hover over them in the demo below to see each slot.

<!-- TBD which option is the best: interactive or image -->
<!-- {{"demo": "CustomTreeItemDemo.js", "hideToolbar": true}} -->

{{"component": "modules/components/TreeItemAnatomy.js"}}

### Content

Use the content slot to customize the content of the Tree Item or replace it with a custom component.

#### Slot props

The `slotProps` prop lets you pass props to the content component.
The demo below shows how to pass an `sx` handler to the content of the Tree Item:

{{"demo": "ContentSlotProps.js"}}

#### Slot

The demo below shows how to replace the content slot with a custom component.

{{"demo": "ContentSlot.js"}}

### Label

Use the label slot to customize the Tree Item label or replace it with a custom component.

#### Slot props

The `slotProps` prop lets you pass props to the label component.
The demo below shows how to pass an `id` attribute to the Tree Item label:

{{"demo": "LabelSlotProps.js"}}

#### Slot

The demo below shows how to replace the label slot with a custom component.

{{"demo": "LabelSlot.js"}}

### Checkbox

The checkbox is present on the items when `checkboxSelection` is enabled on the Tree View.

#### Slot props

You can pass props to the checkbox slot using the `slotProps` on the Tree Item 2 component.

{{"demo": "CheckboxSlotProps.js"}}

#### Slot

The demo below shows how to replace the checkbox slot with a custom component.

{{"demo": "CheckboxSlot.js"}}

## Basics

### Change nested item's indentation

Use the `itemChildrenIndentation` prop to change the indentation of the nested items.
By default, a nested item is indented by `12px` from its parent item.

{{"demo": "ItemChildrenIndentationProp.js"}}

:::success
If you are using a custom Tree Item component, and you want to override the padding,
then apply the following padding to your `groupTransition` element:

```ts
const CustomTreeItemGroupTransition = styled(TreeItemGroupTransition)(({ theme }) => ({
  // ...other styles
  paddingLeft: `var(--TreeView-itemChildrenIndentation)`,
}
```

If you are using the `indentationAtItemLevel` prop, then instead apply the following padding to your `content` element:

```ts
const CustomTreeItemContent = styled(TreeItemContent)(({ theme }) => ({
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
If you are using a custom Tree Item component, and you want to override the padding,
then apply the following padding to your `content` element:

```ts
const CustomTreeItemContent = styled(TreeItemContent)(({ theme }) => ({
  // ...other styles
  paddingLeft:
      `calc(${theme.spacing(1)} + var(--TreeView-itemChildrenIndentation) * var(--TreeView-itemDepth))`,
}
```

:::

## Hooks

### useTreeItem

The `useTreeItem` hook lets you manage and customize individual Tree Items.
You can use it to get the properties needed for all slots, the status of any given Item, or to tap into the interactive API of the Tree View.

#### Slot properties

The `useTreeItem` hook gives you granular control over an Item's layout by providing resolvers to get the appropriate props for each slot.
This makes it possible to build a fully custom layout for your Tree Items.

The demo below shows how to get the props needed for each slot, and how to pass them correctly.

{{"demo": "useTreeItemHookProperties.js"}}

You can pass additional props to a slot—or override existing slots—by passing an object argument to the slot's props resolver, as shown below:

```jsx
<CustomTreeItemContent
  {...getContentProps({
    className: 'overridingClassName',
    newProp: 'I am passing this to the content slot'
  })}
>
```

#### Item status

The `useTreeItem` hook also returns a `status` object that holds boolean values for each possible state of a Tree Item.

```jsx
const {
  status: { expanded, expandable, focused, selected, disabled, editable, editing },
} = useTreeItem(props);
```

You can use these statuses to apply custom styling to the item or conditionally render subcomponents.

{{"demo": "useTreeItemHookStatus.js"}}

#### Imperative API

The `publicAPI` object provides a number of methods to programmatically interact with the Tree View.
You can use the `useTreeItem` hook to access the `publicAPI` object from within a Tree Item.

{{"demo": "useTreeItemHookPublicAPI.js"}}

See the **Imperative API** section on each feature page to learn more about the public API methods available on the Tree View.

### `useTreeItemUtils`

The `useTreeItemUtils` hook provides a set of interaction methods for implementing custom behaviors for the Tree View.
It also returns the status of the Item.

```jsx
const { interactions, status } = useTreeItemUtils({
  itemId: props.itemId,
  children: props.children,
});
```

To override the Tree Item's default interactions, set `event.defaultMuiPrevented` to `true` in the event handlers and then implement your own behavior.

#### Selection

You can select an Item in a Tree View by clicking its content slot.
The demo below shows how to handle selection when the user clicks on an icon.

{{"demo": "HandleSelectionDemo.js"}}

#### Checkbox selection

By default, checkbox selection is skipped if an Item is disabled or if `disableSelection` is `true` on the Tree View.
You can create a custom handler for the `onChange` event on the checkbox slot to bypass these conditions.
The demo below shows how to implement custom checkbox selection behavior.

{{"demo": "HandleCheckboxSelectionDemo.js"}}

Visit the [Rich Tree View](/x/react-tree-view/rich-tree-view/selection/) or [Simple Tree View](/x/react-tree-view/simple-tree-view/selection/) docs, respectively, for more details on the selection API.

#### Expansion

By default, a Tree Item is expanded when the user clicks on its contents.
You can change the expansion trigger using the `expansionTrigger` prop on the `iconContainer`.
For more details, see [Expansion—Limit expansion to icon container](/x/react-tree-view/rich-tree-view/expansion/#limit-expansion-to-icon-container).

Use the `handleExpansion` interaction method for deeper customization of the Item's expansion behavior.

The demo below shows how to introduce a new element that expands and collapses the Item.

{{"demo": "HandleExpansionDemo.js"}}

#### Label editing

The `useTreeItemUtils` hook provides the following interaction methods relevant to label editing behavior:

```jsx
const {
  interactions: {
    toggleItemEditing,
    handleCancelItemLabelEditing,
    handleSaveItemLabel,
  },
} = useTreeItemUtils({
  itemId: props.itemId,
  children: props.children,
});
```

See [Editing—enable editing using only icons](/x/react-tree-view/rich-tree-view/editing/#enable-editing-using-only-icons) for more details on customizing this behavior.
