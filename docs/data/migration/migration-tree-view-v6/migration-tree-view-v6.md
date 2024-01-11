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
-import { TreeView } from '@mui/x-tree-view';
+import { SimpleTreeView } from '@mui/x-tree-view';

-import { TreeView } from '@mui/x-tree-view/TreeView';
+import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';

   return (
-    <TreeView>
+    <SimpleTreeView>
       <TreeItem nodeId="1" label="First item" />
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

### Rename `onNodeToggle`, `expanded` and `defaultExpanded`

The expansion props have been renamed to better describe their behaviors:

| Old name          | New name                |
| :---------------- | :---------------------- |
| `onNodeToggle`    | `onExpandedNodesChange` |
| `expanded`        | `expandedNodes`         |
| `defaultExpanded` | `defaultExpandedNodes`  |

```diff
 <TreeView
-  onNodeToggle={handleExpansionChange}
+  onExpandedNodesChange={handleExpansionChange}

-  expanded={expandedNodes}
+  expandedNodes={expandedNodes}

-  defaultExpanded={defaultExpandedNodes}
+  defaultExpandedNodes={defaultExpandedNodes}
 />
```

:::info
If you were using the `onNodeToggle` prop to react to the expansion or collapse of a specific node,
you can use the new `onNodeExpansionToggle` prop which is called whenever a node is expanded or collapsed with its id and expansion status

```tsx
// It is also available on the deprecated `TreeView` component
<SimpleTreeView
  onNodeExpansionToggle={(event, nodeId, isExpanded) =>
    console.log(nodeId, isExpanded)
  }
/>
```

:::

### Rename `onNodeSelect`, `selected`, and `defaultSelected`

The selection props have been renamed to better describe their behaviors:

| Old name          | New name                |
| :---------------- | :---------------------- |
| `onNodeSelect`    | `onSelectedNodesChange` |
| `selected`        | `selectedNodes`         |
| `defaultSelected` | `defaultSelectedNodes`  |

```diff
 <TreeView
-  onNodeSelect={handleSelectionChange}
+  onSelectedNodesChange={handleSelectionChange}

-  selected={selectedNodes}
+  selectedNodes={selectedNodes}

-  defaultSelected={defaultSelectedNodes}
+  defaultSelectedNodes={defaultSelectedNodes}
 />
```

:::info
If you were using the `onNodeSelect` prop to react to the selection or deselection of a specific node,
you can use the new `onNodeSelectionToggle` prop which is called whenever a node is selected or deselected with its id and selection status.

```tsx
// It is also available on the deprecated `TreeView` component
<SimpleTreeView
  onNodeSelectionToggle={(event, nodeId, isSelected) =>
    console.log(nodeId, isSelected)
  }
/>
```

:::
