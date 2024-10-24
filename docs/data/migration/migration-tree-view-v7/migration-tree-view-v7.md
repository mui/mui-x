---
productId: x-tree-view
---

# Migration from v7 to v8

<p class="description">This guide describes the changes needed to migrate the Tree View from v7 to v8.</p>

## Introduction

This is a reference guide for upgrading `@mui/x-tree-view` from v7 to v8.

## Start using the new release

In `package.json`, change the version of the Tree View package to `next`.

```diff
-"@mui/x-tree-view": "7.x.x",
+"@mui/x-tree-view": "next",
```

Using `next` ensures that it will always use the latest v8 pre-release version, but you can also use a fixed version, like `8.0.0-alpha.0`.

Since `v8` is a major release, it contains changes that affect the public API.
These changes were done for consistency, improved stability and to make room for new features.
Described below are the steps needed to migrate from v7 to v8.

## Run codemods

The `preset-safe` codemod will automatically adjust the bulk of your code to account for breaking changes in v8. You can run `v8.0.0/tree-view/preset-safe` targeting only Tree View or `v8.0.0/preset-safe` to target the other packages as well.

You can either run it on a specific file, folder, or your entire codebase when choosing the `<path>` argument.

<!-- #default-branch-switch -->

```bash
// Tree View specific
npx @mui/x-codemod@latest v8.0.0/tree-view/preset-safe <path>

// Target the other packages as well
npx @mui/x-codemod@latest v8.0.0/preset-safe <path>
```

:::info
If you want to run the transformers one by one, check out the transformers included in the [preset-safe codemod for the Tree View](https://github.com/mui/mui-x/blob/HEAD/packages/x-codemod/README.md#preset-safe-for-tree-view-v800) for more details.
:::

Breaking changes that are handled by this codemod are denoted by a ✅ emoji in the table of contents on the right side of the screen.

If you have already applied the `v8.0.0/tree-view/preset-safe` (or `v8.0.0/preset-safe`) codemod, then you should not need to take any further action on these items.

All other changes must be handled manually.

:::warning
Not all use cases are covered by codemods. In some scenarios, like props spreading, cross-file dependencies, etc., the changes are not properly identified and therefore must be handled manually.

For example, if a codemod tries to rename a prop, but this prop is hidden with the spread operator, it won't be transformed as expected.

```tsx
<RichTreeView {...pickerProps} />
```

After running the codemods, make sure to test your application and that you don't have any console errors.

Feel free to [open an issue](https://github.com/mui/mui-x/issues/new/choose) for support if you need help to proceed with your migration.
:::

### ✅ Use Simple Tree View instead of Tree View

The `<TreeView />` component has been renamed `<SimpleTreeView />` which has exactly the same API:

```diff
-import { TreeView } from '@mui/x-tree-view';
+import { SimpleTreeView } from '@mui/x-tree-view';

-import { TreeView } from '@mui/x-tree-view/TreeView';
+import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';

   return (
-    <TreeView>
+    <SimpleTreeView>
       <TreeItem itemId="1" label="First item" />
-    </TreeView>
+    </SimpleTreeView>
   );
```

If you were using theme augmentation, you will also need to migrate it:

```diff
 const theme = createTheme({
   components: {
-    MuiTreeView: {
+    MuiSimpleTreeView: {
       styleOverrides: {
         root: {
           opacity: 0.5,
         },
       },
     },
   },
 });
```

If you were using the `treeViewClasses` object, you can replace it with the new `simpleTreeViewClasses` object:

```diff
 import { treeViewClasses } from '@mui/x-tree-view/TreeView';
 import { simpleTreeViewClasses } from '@mui/x-tree-view/SimpleTreeView';

-const rootClass = treeViewClasses.root;
+const rootClass = simpleTreeViewClasses.root;
```

## New API to customize the Tree Item

The `ContentComponent` or `ContentProps` props of the `TreeItem` component have been removed in favor of the new `slots`, `slotProps` props and of the `useTreeItem` hook.

Learn more about the anatomy of the Tree Items and the customization utilities provided on the [Tree Item Customization page](/x/react-tree-view/tree-item-customization/).

## Behavior change on the `onClick` and `onMouseDown` props of `TreeItem`

The `onClick` and `onMouseDown` were the only event callback that were passed to the content of the Tree Item instead of its root.
The goal was to make sure that the callback was not fired when clicking on a descendant of a giving item.
This inconsistency has been solved, all the event manager now target the root of the item, and you can use the `onItemClick` prop on the Tree View component to target the content of an item:

```diff
-<SimpleTreeView>
+<SimpleTreeView onItemClick={handleItemClick}>
-  <TreeItem onClick={handleItemClick}>
+  <TreeItem >
 </SimpleTreeView>
```

## ✅ Rename the `TreeItem2` (and related utils)

All the new Tree Item-related components and utils (introduced in the previous major to improve the DX of the Tree Item component) are becoming the default way of using the Tree Item and are therefore losing their `2` suffix:

```diff
 import * as React from 'react';
 import {
-  TreeItem2,
+  TreeItem,
-  TreeItem2Root,
+  TreeItemRoot,
-  TreeItem2Content,
+  TreeItemContent,
-  TreeItem2IconContainer,
+  TreeItemIconContainer,
-  TreeItem2GroupTransition,
+  TreeItemGroupTransition,
-  TreeItem2Checkbox,
+  TreeItemCheckbox,
-  TreeItem2Label,
+  TreeItemLabel,
-  TreeItem2Props,
+  TreeItemProps,
-  TreeItem2Slots,
+  TreeItemSlots,
-  TreeItem2SlotProps,
+  TreeItemSlotProps,
- } from '@mui/x-tree-view/TreeItem2';
+ } from '@mui/x-tree-view/TreeItem';
 import {
-  useTreeItem2,
+  useTreeItem,
-  unstable_useTreeItem2 as useAliasedTreeItem,
+  unstable_useTreeItem as useAliasedTreeItem,
-  UseTreeItem2Parameters,
+  UseTreeItemParameters,
-  UseTreeItem2ReturnValue,
+  UseTreeItemReturnValue,
-  UseTreeItem2Status,
+  UseTreeItemStatus,
-  UseTreeItem2RootSlotOwnProps,
+  UseTreeItemRootSlotOwnProps,
-  UseTreeItem2ContentSlotOwnProps,
+  UseTreeItemContentSlotOwnProps,
-  UseTreeItem2LabelInputSlotOwnProps,
+  UseTreeItemLabelInputSlotOwnProps,
-  UseTreeItem2LabelSlotOwnProps,
+  UseTreeItemLabelSlotOwnProps,
-  UseTreeItem2CheckboxSlotOwnProps,
+  UseTreeItemCheckboxSlotOwnProps,
-  UseTreeItem2IconContainerSlotOwnProps,
+  UseTreeItemIconContainerSlotOwnProps,
-  UseTreeItem2GroupTransitionSlotOwnProps,
+  UseTreeItemGroupTransitionSlotOwnProps,
-  UseTreeItem2DragAndDropOverlaySlotOwnProps,
+  UseTreeItemDragAndDropOverlaySlotOwnProps,
- } from '@mui/x-tree-view/useTreeItem2';
+ } from '@mui/x-tree-view/useTreeItem';
- import { useTreeItem2Utils } from '@mui/x-tree-view/hooks';
+ import { useTreeItemUtils } from '@mui/x-tree-view/hooks';
 import {
-  TreeItem2Provider,
+  TreeItemProvider,
-  TreeItem2ProviderProps,
+  TreeItemProviderProps,
- } from '@mui/x-tree-view/TreeItem2Provider';
+ } from '@mui/x-tree-view/TreeItemProvider';
 import {
-  TreeItem2Icon,
+  TreeItemIcon,
-  TreeItem2IconProps,
+  TreeItemIconProps,
-  TreeItem2IconSlots,
+  TreeItemIconSlots,
-  TreeItem2IconSlotProps,
+  TreeItemIconSlotProps,
- } from '@mui/x-tree-view/TreeItem2Icon';
+ } from '@mui/x-tree-view/TreeItemIcon';
 import {
-  TreeItem2DragAndDropOverlay,
+  TreeItemDragAndDropOverlay,
-  TreeItem2DragAndDropOverlayProps,
+  TreeItemDragAndDropOverlayProps,
- } from '@mui/x-tree-view/TreeItem2DragAndDropOverlay';
+ } from '@mui/x-tree-view/TreeItemDragAndDropOverlay';
 import {
-  TreeItem2LabelInput,
+  TreeItemLabelInput,
-  TreeItem2LabelInputProps,
+  TreeItemLabelInputProps,
- } from '@mui/x-tree-view/TreeItem2LabelInput';
+ } from '@mui/x-tree-view/TreeItemLabelInput';
```
