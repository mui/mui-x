---
title: Tree View - Migration from v8 to v9
productId: x-tree-view
---

# Migration from v8 to v9

<p class="description">This guide describes the changes needed to migrate the Tree View from v8 to v9.</p>

## Introduction

This is a reference guide for upgrading `@mui/x-tree-view` from v8 to v9.

## Start using the new release

In `package.json`, change the version of the Tree View package to `latest`.

```diff
-"@mui/x-tree-view": "8.x.x",
+"@mui/x-tree-view": "latest",

-"@mui/x-tree-view-pro": "8.x.x",
+"@mui/x-tree-view-pro": "latest",
```

Since `v9` is a major release, it contains changes that affect the public API.
These changes were done for consistency, improved stability and to make room for new features.
Described below are the steps needed to migrate from `v8` to `v9`.

## Breaking changes

### Replace `TreeViewBaseItem` with `TreeViewDefaultItemModelProperties`

The `TreeViewBaseItem` type has been removed.
You can use `TreeViewDefaultItemModelProperties` instead, or define your own item model interface.

```diff
-import { TreeViewBaseItem } from '@mui/x-tree-view';
+import { TreeViewDefaultItemModelProperties } from '@mui/x-tree-view';

-const items: TreeViewBaseItem[] = [
+const items: TreeViewDefaultItemModelProperties[] = [
   { id: '1', label: 'Item 1', children: [{ id: '1.1', label: 'Item 1.1' }] },
 ];
```

If you were using `TreeViewBaseItem` with a generic parameter, you need to define your own type with an explicit `children` field:

```diff
-import { TreeViewBaseItem } from '@mui/x-tree-view';

 type MyItem = {
   id: string;
   label: string;
   isActive: boolean;
+  children?: MyItem[];
 };

-const items: TreeViewBaseItem<MyItem>[] = [
+const items: MyItem[] = [
   { id: '1', label: 'Item 1', isActive: true, children: [] },
 ];
```

### Replace `useTreeViewApiRef` with component-specific hooks

The `useTreeViewApiRef` hook has been removed.
Use the component-specific hooks instead:

```diff
-import { useTreeViewApiRef } from '@mui/x-tree-view';
+import { useRichTreeViewApiRef } from '@mui/x-tree-view';
 // or
+import { useSimpleTreeViewApiRef } from '@mui/x-tree-view';
 // or
+import { useRichTreeViewProApiRef } from '@mui/x-tree-view-pro';
```

### Remove `status` from content slot props

The `status` property is no longer passed to the content slot props from `getContentProps()`.
Use the `data-*` attributes instead to style based on item state:

```diff
 const MyContent = React.forwardRef(function MyContent(props, ref) {
-  const { status, ...other } = props;
+  const { ...other } = props;

   return (
-    <div className={status.expanded ? 'expanded' : ''} ref={ref} {...other} />
+    <div ref={ref} {...other} />
   );
 });
```

The content element now receives the following data attributes that can be used for styling:

- `data-expanded` — when the item is expanded
- `data-selected` — when the item is selected
- `data-focused` — when the item is focused
- `data-disabled` — when the item is disabled
- `data-editable` — when the item is editable
- `data-editing` — when the item is being edited

```css
/* Before */
.MyContent.Mui-expanded {
  background-color: red;
}

/* After */
.MyContent[data-expanded] {
  background-color: red;
}
```

:::info
The `status` property is still available on the return value of `useTreeItem`.
Only the `status` on the content slot props has been removed.
:::

### Remove deprecated CSS state classes from `treeItemClasses`

The following state classes have been removed from `treeItemClasses`:

- `treeItemClasses.expanded` — use `[data-expanded]` selector instead
- `treeItemClasses.selected` — use `[data-selected]` selector instead
- `treeItemClasses.focused` — use `[data-focused]` selector instead
- `treeItemClasses.disabled` — use `[data-disabled]` selector instead
- `treeItemClasses.editable` — use `[data-editable]` selector instead
- `treeItemClasses.editing` — use `[data-editing]` selector instead

If you were using these classes to style the Tree Item, update your CSS selectors:

```diff
 import { treeItemClasses } from '@mui/x-tree-view/TreeItem';

 const StyledTreeItem = styled(TreeItem)({
-  [`& .${treeItemClasses.content}.${treeItemClasses.expanded}`]: {
+  [`& .${treeItemClasses.content}[data-expanded]`]: {
     backgroundColor: 'red',
   },
-  [`& .${treeItemClasses.content}.${treeItemClasses.selected}`]: {
+  [`& .${treeItemClasses.content}[data-selected]`]: {
     color: 'blue',
   },
 });
```

If you were using the global CSS class names directly (for example, `Mui-expanded`, `Mui-selected`), replace them with data attribute selectors:

```diff
 const StyledTreeItem = styled(TreeItem)({
-  '& .MuiTreeItem-content.Mui-expanded': {
+  '& .MuiTreeItem-content[data-expanded]': {
     backgroundColor: 'red',
   },
 });
```
