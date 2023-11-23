---
productId: x-tree-view
title: Tree View - JSX children
packageName: '@mui/x-tree-view'
githubLabel: 'component: tree view'
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
---

# Tree View - JSX children

<p class="description">Pass data to your Tree View using JSX.</p>

If your Tree View has fixed data that do not come from a database, you can use the `SimpleTreeView` component that takes JSX children instead of a `items` prop.

However, if `SimpleTreeView` is too limited for your usage, have a look at the `TreeView` component and the other pages of this documentation.

## Basic usage

{{"demo": "BasicJSXTreeView.js"}}

## Disabled items

### Set disabled items

You can disable some of the items using the `disabled` prop on the `SimpleTreeItem` component:

```tsx
<SimpleTreeItem nodeId="@mui/x-scheduler" label="Scheduler" disabled />
```

{{"demo": "BasicDisabledJSXItems.js"}}

### Interact with disabled items

The behavior of disabled tree items depends on the `disabledItemsFocusable` prop.

If it is false:

- Arrow keys will not focus disabled items and, the next non-disabled item will be focused.
- Typing the first character of a disabled item's label will not focus the item.
- Mouse or keyboard interaction will not expand/collapse disabled items.
- Mouse or keyboard interaction will not select disabled items.
- Shift + arrow keys will skip disabled items and, the next non-disabled item will be selected.
- Programmatic focus will not focus disabled items.

If it is true:

- Arrow keys will focus disabled items.
- Typing the first character of a disabled item's label will focus the item.
- Mouse or keyboard interaction will not expand/collapse disabled items.
- Mouse or keyboard interaction will not select disabled items.
- Shift + arrow keys will not skip disabled items but, the disabled item will not be selected.
- Programmatic focus will focus disabled items.

{{"demo": "DisabledItemsFocusable.js", "defaultCodeOpen": false}}

s)
