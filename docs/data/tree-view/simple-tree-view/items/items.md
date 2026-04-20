---
productId: x-tree-view
title: Simple Tree View - Items
components: SimpleTreeView, TreeItem
packageName: '@mui/x-tree-view'
githubLabel: 'scope: tree view'
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
---

# Simple Tree View - Items

<p class="description">Learn how to add simple data to the Tree View component.</p>

## Basics

```jsx
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
```

`SimpleTreeView` receives its items directly as JSX children.

{{"demo": "BasicSimpleTreeView.js"}}

### Item identifier

Each `TreeItem` must have a unique `itemId`.
This is used internally to identify the item in various models and to track it across updates.

```tsx
<SimpleTreeView>
  <TreeItem itemId="item-unique-id" {...otherItemProps} />
</SimpleTreeView>
```

### Item label

You must pass a `label` prop to each `TreeItem`, as shown below:

```tsx
<SimpleTreeView>
  <TreeItem label="Item label" {...otherItemProps} />
</SimpleTreeView>
```

### Disabled items

Use the `disabled` prop on `TreeItem` to disable interaction and focus:

{{"demo": "DisabledJSXItem.js", "defaultCodeOpen": false}}

#### Focusable disabled items

The demo below includes a switch that toggles the `disabledItemsFocusable` prop, which controls whether or not a disabled `TreeItem` can be focused.

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

## Track item clicks

Use the `onItemClick` prop to track the clicked item:

{{"demo": "OnItemClick.js"}}

## Item height

Use the `itemHeight` prop to set the height of each item in the tree.
If not provided, no height restriction is applied to the tree item content element.

{{"demo": "ItemHeight.js"}}

## Imperative API

To use the `apiRef` object, you need to initialize it using the `useSimpleTreeViewApiRef()` hook as follows:

```tsx
const apiRef = useSimpleTreeViewApiRef();

return <SimpleTreeView apiRef={apiRef} items={ITEMS} />;
```

When your component first renders, `apiRef.current` is `undefined`.
After the initial render, `apiRef` holds methods to interact imperatively with the Tree View.

### Get an item's DOM element by ID

Use the `getItemDOMElement()` API method to get an item's DOM element by its ID.

```ts
const itemElement = apiRef.current.getItemDOMElement(
  // The id of the item to get the DOM element of
  itemId,
);
```

{{"demo": "ApiMethodGetItemDOMElement.js", "defaultCodeOpen": false}}
