---
productId: x-tree-view
title: Simple Tree View - Items
components: SimpleTreeView, TreeItem
packageName: '@mui/x-tree-view'
githubLabel: 'component: tree view'
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
---

# Simple Tree View - Items

<p class="description">Pass data to your Tree View.</p>

## Basic usage

The items can be defined as JSX children of the `SimpleTreeView` component:

{{"demo": "BasicSimpleTreeView.js"}}

## Item identifier

Each `TreeItem` must have a unique `nodeId`.

This identifier is used internally to identify the item in the various models and to track the item across updates.

```tsx
<SimpleTreeView>
  <TreeItem nodeId="tree-view-community" {...otherItemProps} />
</SimpleTreeView>
```

## Item label

You must pass a `label` prop to each `TreeItem` component:

```tsx
<SimpleTreeView>
  <TreeItem label="@mui/x-tree-view" {...otherItemProps} />
</SimpleTreeView>
```

## Disabled items

You can disable some of the items using the `disabled` prop on the `TreeItem` component:

```tsx
<SimpleTreeView>
  <TreeItem disabled {...otherItemProps} />
</SimpleTreeView>
```

{{"demo": "DisabledJSXItem.js", "defaultCodeOpen": false}}

### Interact with disabled items

The behavior of disabled tree items depends on the `disabledItemsFocusable` prop.

If it is false:

- Arrow keys will not focus disabled items, and the next non-disabled item will be focused.
- Typing the first character of a disabled item's label will not focus the item.
- Mouse or keyboard interaction will not expand/collapse disabled items.
- Mouse or keyboard interaction will not select disabled items.
- Shift + arrow keys will skip disabled items, and the next non-disabled item will be selected.
- Programmatic focus will not focus disabled items.

If it is true:

- Arrow keys will focus disabled items.
- Typing the first character of a disabled item's label will focus the item.
- Mouse or keyboard interaction will not expand/collapse disabled items.
- Mouse or keyboard interaction will not select disabled items.
- Shift + arrow keys will not skip disabled items but, the disabled item will not be selected.
- Programmatic focus will focus disabled items.

{{"demo": "DisabledItemsFocusable.js", "defaultCodeOpen": false}}
