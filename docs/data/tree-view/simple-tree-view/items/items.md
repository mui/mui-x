---
productId: x-tree-view
title: Simple Tree View - Items
components: SimpleTreeView, TreeItem
packageName: '@mui/x-tree-view'
githubLabel: 'component: tree view'
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
---

# Simple Tree View - Items

<p class="description">Learn how to add simple data to the Tree View component.</p>

## Basics

```jsx
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
```

The Simple Tree View component enables you to pass its items as a direct JSX children.

{{"demo": "BasicSimpleTreeView.js"}}

### Item identifier

Each Tree Item must have a unique `nodeId`.
This identifier is used internally to identify the item in the various models, and to track them across updates.

```tsx
<SimpleTreeView>
  <TreeItem nodeId="item-unique-id" {...otherItemProps} />
</SimpleTreeView>
```

### Item label

Use the `label` prop to the Tree Item to add a label to each one of them.

```tsx
<SimpleTreeView>
  <TreeItem label="Item label" {...otherItemProps} />
</SimpleTreeView>
```

### Disabled items

Use the `disabled` prop on the Tree Item component to disable interaction and focus:

{{"demo": "DisabledItemsFocusable.js", "defaultCodeOpen": false}}

#### The disabledItemsFocusable prop

Note that the demo above also includes a switch.
It's toggling the `disabledItemsFocusable` prop, which controls whether or not a disabled Tree Item can be focused.

In case that prop is set to false:

- Navigating with keyboard arrow keys will not focus the disabled items, and the next non-disabled item will be focused instead.
- Typing the first character of a disabled item's label will not move the focus to it.
- Mouse or keyboard interaction will not expand/collapse disabled items.
- Mouse or keyboard interaction will not select disabled items.
- <kbd class="key">Shift</kbd> + arrow keys will skip disabled items, and the next non-disabled item will be selected instead.
- Programmatic focus will not focus disabled items.

But, if it's set to true:

- Navigating with keyboard arrow keys will focus disabled items.
- Typing the first character of a disabled item's label will move focus to it.
- Mouse or keyboard interaction will not expand/collapse disabled items.
- Mouse or keyboard interaction will not select disabled items.
- <kbd class="key">Shift</kbd> + arrow keys will not skip disabled items, but the disabled item will not be selected.
- Programmatic focus will focus disabled items.
