---
productId: x-tree-view
---

# Migration from v6 to v7

<!-- #default-branch-switch -->

<p class="description">This guide describes the changes needed to migrate the Tree View from v6 to v7.</p>

## Introduction

TBD

## Start using the alpha release

In `package.json`, change the version of the tree view package to `next`.

```diff
-"@mui/x-tree-view": "6.x.x",
+"@mui/x-tree-view": "next",
```

## Breaking changes

Since `v7` is a major release, it contains changes that affect the public API.
These changes were done for consistency, improved stability and to make room for new features.

### ✅ Use `SimpleTreeView` instead of `TreeView`

The `TreeView` component has been deprecated and will be removed in the next major.
You can start replacing it with the new `SimpleTreeView` component which has exactly the same API:

```diff
- import { TreeView } from '@mui/x-tree-view';
+ import { SimpleTreeView } from '@mui/x-tree-view';

- import { TreeView } from '@mui/x-tree-view/TreeView';
+ import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';

  return (
-   <TreeView>
+   <SimpleTreeView>
      <TreeItem nodeId="1" label="First item" />
-   </TreeView>
+   </SimpleTreeView>
  )
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

- const rootClass = treeViewClasses.root;
+ const rootClass = simpleTreeViewClasses.root;
```
