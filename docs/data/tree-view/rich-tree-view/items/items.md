---
productId: x-tree-view
title: Rich Tree View - Items
components: RichTreeView, TreeItem
packageName: '@mui/x-tree-view'
githubLabel: 'component: tree view'
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
---

# Rich Tree View - Items

<p class="description">Pass data to your Tree View.</p>

## Basic usage

The items can be defined with the `items` prop, which expects an array of objects.

:::warning
The `items` prop should keep the same reference between two renders except if you want to apply new items.
Otherwise, the Tree View will re-generate its entire structure.
:::

{{"demo": "BasicRichTreeView.js"}}

## Item identifier

Each item must have a unique identifier.

This identifier is used internally to identify the item in the various models and to track the item across updates.

By default, the `RichTreeView` component looks for a property named `id` in the data set to get that identifier:

```tsx
const ITEMS = [{ id: 'tree-view-community' }];

<RichTreeView items={ITEMS} />;
```

If the item's identifier is not called `id`, then you need to use the `getItemId` prop to tell the `RichTreeView` component where it is located.

The following demo shows how to use `getItemId` to grab the unique identifier from a property named `internalId`:

```tsx
const ITEMS = [{ internalId: 'tree-view-community' }];

function getItemId(item) {
  return item.internalId;
}

<RichTreeView items={ITEMS} getItemId={getItemId} />;
```

{{"demo": "GetItemId.js", "defaultCodeOpen": false}}

:::warning
Just like the `items` prop, the `getItemId` function should keep the same JavaScript reference between two renders.
Otherwise, the Tree View will re-generate its entire structure.

It could be achieved by either defining the prop outside the component scope or by memoizing using the `React.useCallback` hook if the function reuses something from the component scope.
:::

## Item label

Each item must have a label which does not need to be unique.

By default, the `RichTreeView` component looks for a property named `label` in the data set to get that label:

```tsx
const ITEMS = [{ label: '@mui/x-tree-view' }];

<RichTreeView items={ITEMS} />;
```

If the item's label is not called `label`, then you need to use the `getItemLabel` prop to tell the `RichTreeView` component where it's located:

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
Just like the `items` prop, the `getItemLabel` function should keep the same JavaScript reference between two renders.
Otherwise, the Tree View will re-generate its entire structure.

It could be achieved by either defining the prop outside the component scope or by memoizing using the `React.useCallback` hook if the function reuses something from the component scope.
:::

:::warning
Unlike the `SimpleTreeView` component, the `RichTreeView` component only supports string labels, you cannot pass React nodes to it.
:::

## Disabled items

Use the `isItemDisabled` prop on the Rich Tree View to disable interaction and focus on a Tree Item:

```tsx
function isItemDisabled(item) {
  return item.disabled ?? false;
}

<RichTreeView isItemDisabled={isItemDisabled} />;
```

{{"demo": "DisabledPropItem.js", "defaultCodeOpen": false}}

:::warning
Just like the `items` prop, the `isItemDisabled` function should keep the same JavaScript reference between two renders.
Otherwise, the Tree View will re-generate its entire structure.

This can be achieved by either defining the prop outside the component scope or by memoizing using the `React.useCallback` hook if the function reuses something from the component scope.
:::

### Focus disabled items

Use the `disabledItemsFocusable` prop to control if disabled Tree Items can be focused.

When this prop is set to false:

- Navigating with keyboard arrow keys will not focus the disabled items, and the next non-disabled item will be focused instead.
- Typing the first character of a disabled item's label will not move the focus to it.
- Mouse or keyboard interaction will not expand/collapse disabled items.
- Mouse or keyboard interaction will not select disabled items.
- <kbd class="key">Shift</kbd> + arrow keys will skip disabled items, and the next non-disabled item will be selected instead.
- Programmatic focus will not focus disabled items.

When it's set to true:

- Navigating with keyboard arrow keys will focus disabled items.
- Typing the first character of a disabled item's label will move focus to it.
- Mouse or keyboard interaction will not expand/collapse disabled items.
- Mouse or keyboard interaction will not select disabled items.
- <kbd class="key">Shift</kbd> + arrow keys will not skip disabled items, but the disabled item will not be selected.
- Programmatic focus will focus disabled items.

{{"demo": "DisabledItemsFocusable.js", "defaultCodeOpen": false}}

## Imperative API

### Get an item by ID

Use the `getItem` API method to get an item by its ID.

```ts
const item = apiRef.current.getItem(
  // The ID of the item to retrieve
  itemId,
);
```

{{"demo": "ApiMethodGetItem.js", "defaultCodeOpen": false}}
