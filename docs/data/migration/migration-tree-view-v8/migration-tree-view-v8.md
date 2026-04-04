---
title: Tree View - Migration from v8 to v9
productId: x-tree-view
---

# Migration from v8 to v9

<p class="description">This guide describes the changes needed to migrate the Tree View from v8 to v9.</p>

## Introduction

This is a reference guide for upgrading `@mui/x-tree-view` from v8 to v9.

## Start using the new release

In `package.json`, change the version of the Tree View package to `next`.

```diff
-"@mui/x-tree-view": "8.x.x",
+"@mui/x-tree-view": "next",

-"@mui/x-tree-view-pro": "8.x.x",
+"@mui/x-tree-view-pro": "next",
```

The `v9` major release contains changes that affect the public API.
These changes were done for consistency, improved stability and to make room for new features.
Described below are the steps needed to migrate from `v8` to `v9`.

## Breaking changes

## Hooks

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

### Restrict hook exports in pro package

The `useSimpleTreeViewApiRef` and `useRichTreeViewApiRef` hooks are no longer re-exported from `@mui/x-tree-view-pro`.
If you were importing them from the pro package, you need to import them from `@mui/x-tree-view` instead:

```diff
-import { useRichTreeViewApiRef } from '@mui/x-tree-view-pro';
+import { useRichTreeViewApiRef } from '@mui/x-tree-view';
```

```diff
-import { useSimpleTreeViewApiRef } from '@mui/x-tree-view-pro';
+import { useSimpleTreeViewApiRef } from '@mui/x-tree-view';
```

:::info
If you are using the `RichTreeViewPro` component, you should use the `useRichTreeViewProApiRef` hook which is exported from `@mui/x-tree-view-pro`:

```tsx
import { useRichTreeViewProApiRef } from '@mui/x-tree-view-pro';

const apiRef = useRichTreeViewProApiRef();

return <RichTreeViewPro apiRef={apiRef} items={items} />;
```

:::

## DOM and items rendering

### Item virtualization

The `RichTreeViewPro` component now uses virtualization to render its items.
This improves performance when rendering large datasets.

If you want to opt out of virtualization, use the `disableVirtualization` prop:

```diff
 <RichTreeViewPro
   items={items}
+  disableVirtualization
 />
```

When virtualization is enabled, the `RichTreeViewPro` component requires its parent container to have intrinsic dimensions.
Make sure to set a height on the container:

```tsx
<div style={{ height: 500 }}>
  <RichTreeViewPro items={items} />
</div>
```

:::success
See [Virtualization—Layout](/x/react-tree-view/rich-tree-view/virtualization/#layout) to learn more.
:::

### Item height

The three Tree View components now support a new `itemHeight` prop to customize the height each item takes.
For `RichTreeViewPro`, this prop defaults to `32px` because virtualization requires each item to have a fixed, known height in order to calculate scroll positions and determine which items are visible in the viewport.

You can customize it using the `itemHeight` prop:

```tsx
<RichTreeViewPro items={items} itemHeight={48} />
```

If you have custom tree items with elements that require variable item heights - such as avatars or multi-line labels - you can pass `itemHeight={null}` to remove the height restriction.
This requires disabling virtualization:

```tsx
<RichTreeViewPro items={items} itemHeight={null} disableVirtualization />
```

### DOM structure

The `RichTreeView` and `RichTreeViewPro` components now support a new `domStructure` prop to switch between a flat list and a nested tree to render the items in the DOM.
For `RichTreeViewPro`, this prop is set to `"flat"` by default.

If your styling required keeping the items nested, you can pass `domStructure="nested"` to go back to the old behavior.
This requires disabling virtualization:

```tsx
<RichTreeViewPro items={items} domStructure="nested" disableVirtualization />
```

## Types

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

## Customization

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
