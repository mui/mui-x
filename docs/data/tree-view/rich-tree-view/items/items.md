---
productId: x-tree-view
components: RichTreeView, TreeItem
packageName: '@mui/x-tree-view'
githubLabel: 'scope: tree view'
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
---

# Rich Tree View - Items

<p class="description">Pass data to your Tree View.</p>

:::warning
The props described in this doc should always keep the same reference between two renders (unless you specifically intend to apply new items).
Otherwise, `RichTreeView` will re-generate its entire structure.

This can be accomplished either by defining the prop outside the component scope, or by memoizing using the `React.useCallback()` hook if the function reuses something from the component scope.
:::

## Basic usage

Use the `items` prop to define items.
This prop expects an array of objects.

{{"demo": "BasicRichTreeView.js"}}

## Item identifier

Each item must have a unique identifier.
This identifier is used internally to identify the item in the various models and to track the item across updates.

By default, `RichTreeView` looks for a property named `id` in the data set to get that identifier:

```tsx
const ITEMS = [{ id: 'tree-view-community' }];

<RichTreeView items={ITEMS} />;
```

If the item's identifier is not called `id`, then you must use the `getItemId` prop to tell `RichTreeView` where it is located.

The following demo shows how to use `getItemId` to grab the unique identifier from a property named `internalId`:

```tsx
const ITEMS = [{ internalId: 'tree-view-community' }];

function getItemId(item) {
  return item.internalId;
}

<RichTreeView items={ITEMS} getItemId={getItemId} />;
```

{{"demo": "GetItemId.js", "defaultCodeOpen": false}}

## Item label

Each item must have a label which does not need to be unique.

By default, `RichTreeView` looks for a property named `label` in the data set to get that label:

```tsx
const ITEMS = [{ label: '@mui/x-tree-view' }];

<RichTreeView items={ITEMS} />;
```

If the item's label is not called `label`, then you must use the `getItemLabel` prop to tell `RichTreeView` where it's located:

The following demo shows how to use `getItemLabel` to grab the unique identifier from a property named `name`:

```tsx
const ITEMS = [{ name: '@mui/x-tree-view' }];

function getItemLabel(item) {
  return item.name;
}

<RichTreeView items={ITEMS} getItemLabel={getItemLabel} />;
```

{{"demo": "GetItemLabel.js", "defaultCodeOpen": false}}

:::warning
Unlike `SimpleTreeView`, `RichTreeView` only supports string labels.
You cannot pass React nodes to it.
:::

## Item children

Each item can contain children, which are rendered as nested nodes in the tree.

By default, `RichTreeView` looks for a property named `children` in the data set to get the children:

```tsx
const ITEMS = [
  { children: [{ id: 'tree-view-community', label: '@mui/x-tree-view' }] },
];

<RichTreeView items={ITEMS} />;
```

If the item's children are not called `children`, then you must use the `getItemChildren` prop to tell `RichTreeView` where they're located:

The following demo shows how to use `getItemChildren` to grab the children from a property named `nodes`:

```tsx
const ITEMS = [
  { nodes: [{ id: 'tree-view-community', label: '@mui/x-tree-view' }] },
];

function getItemChildren(item) {
  return item.nodes;
}

<RichTreeView items={ITEMS} getItemChildren={getItemChildren} />;
```

{{"demo": "GetItemChildren.js", "defaultCodeOpen": false}}

## Disabled items

Use the `isItemDisabled` prop on `RichTreeView` to disable interaction and focus on a `TreeItem`:

```tsx
function isItemDisabled(item) {
  return item.disabled ?? false;
}

<RichTreeView isItemDisabled={isItemDisabled} />;
```

{{"demo": "DisabledPropItem.js", "defaultCodeOpen": false}}

### Focus disabled items

Use the `disabledItemsFocusable` prop to control if disabled `TreeItem` components can be focused.

When this prop is set to false:

- Disabled items will not receive focus when navigating with keyboard arrow keys—they next non-disabled item is focused instead.
- Typing the first character of a disabled item's label will not move the focus to it.
- Mouse or keyboard interactions will not expand or collapse disabled items.
- Mouse or keyboard interactions will not select disabled items.
- <kbd class="key">Shift</kbd> + arrow keys will skip disabled items, and the next non-disabled item will be selected instead.
- Programmatic focus will not focus disabled items.

When it's set to true:

- Disabled items will receive focus when navigating with keyboard arrow keys.
- Typing the first character of a disabled item's label will move focus to it.
- Mouse or keyboard interactions will not expand or collapse disabled items.
- Mouse or keyboard interactions will not select disabled items.
- <kbd class="key">Shift</kbd> + arrow keys will not skip disabled items, but the disabled item will not be selected.
- Programmatic focus will focus disabled items.

{{"demo": "DisabledItemsFocusable.js", "defaultCodeOpen": false}}

## Item height

Use the `itemHeight` prop to set the height of each item in the tree.
If not provided, no height restriction is applied to the tree item content element.

{{"demo": "ItemHeight.js"}}

:::info
When [virtualization](/x/react-tree-view/rich-tree-view/virtualization/) is enabled, the `itemHeight` defaults to `32px` if this prop is not defined.
:::

## Track item clicks

Use the `onItemClick` prop to track the clicked item:

{{"demo": "OnItemClick.js"}}

## Imperative API

To use the `apiRef` object, you need to initialize it using the `useRichTreeViewApiRef()` or `useRichTreeViewProApiRef()` hook as follows:

```tsx
// Community package
const apiRef = useRichTreeViewApiRef();

return <RichTreeView apiRef={apiRef} items={ITEMS} />;

// Pro package
const apiRef = useRichTreeViewProApiRef();

return <RichTreeViewPro apiRef={apiRef} items={ITEMS} />;
```

When your component first renders, `apiRef.current` is `undefined`.
After the initial render, `apiRef` holds methods to interact imperatively with `RichTreeView`.

### Get an item by ID

Use the `getItem()` API method to get an item by its ID.

```ts
const item = apiRef.current.getItem(
  // The id of the item to retrieve
  itemId,
);
```

{{"demo": "ApiMethodGetItem.js", "defaultCodeOpen": false}}

### Get an item's DOM element by ID

Use the `getItemDOMElement()` API method to get an item's DOM element by its ID.

```ts
const itemElement = apiRef.current.getItemDOMElement(
  // The id of the item to get the DOM element of
  itemId,
);
```

{{"demo": "ApiMethodGetItemDOMElement.js", "defaultCodeOpen": false}}

### Get the current item tree

Use the `getItemTree()` API method to get the current item tree.

```ts
const itemTree = apiRef.current.getItemTree();
```

{{"demo": "ApiMethodGetItemTree.js", "defaultCodeOpen": false}}

:::info
This method is mostly useful when `RichTreeView` has some internal updates on the items.
For now, the only features causing updates on the items is the [reordering](/x/react-tree-view/rich-tree-view/ordering/).
:::

### Get an item's children by ID

Use the `getItemOrderedChildrenIds()` API method to get an item's children by its ID.

```ts
const childrenIds = apiRef.current.getItemOrderedChildrenIds(
  // The id of the item to retrieve the children from
  itemId,
);
```

{{"demo": "ApiMethodGetItemOrderedChildrenIds.js", "defaultCodeOpen": false}}

### Get an item's parent id

Use the `getParentId()` API method to get the ID of the item's parent.

```ts
publicAPI.getParentId(itemId);
```

{{"demo": "GetParentIdPublicAPI.js", "defaultCodeOpen": false}}

### Imperatively disable an item

Use the `setIsItemDisabled()` API method to imperatively toggle the item's disabled state.

```ts
publicAPI.setIsItemDisabled({
  // The id of the item to disable or enable
  itemId,
  // If `true` the item will be disabled
  // If `false` the item will be enabled
  // If not defined, the item's new disable status will be the opposite of its current one
  shouldBeDisabled: true,
});
```

{{"demo": "DisableTreeItemPublicAPI.js", "defaultCodeOpen": false}}
