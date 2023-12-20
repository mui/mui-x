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

### Rename `onNodeToggle`, `expanded` and `defaultExpanded`

The expansion props have been renamed to better describe their behaviors:

| Old name          | New name                |
| :---------------- | :---------------------- |
| `onNodeToggle`    | `onExpandedNodesChange` |
| `expanded`        | `expandedNodes`         |
| `defaultExpanded` | `defaultExpandedNodes`  |

```diff
  <TreeView
-   onNodeToggle={handleExpansionChange}
+   onExpandedNodesChange={handleExpansionChange}

-   expanded={expandedNodes}
+   expandedNodes={expandedNodes}

-   defaultExpanded={defaultExpandedNodes}
+   defaultExpandedNodes={defaultExpandedNodes}
  />
```

:::info
If you were using the `onNodeToggle` prop to react to the expansion or collapse of a specific node,
you can use the new `onNodeExpansionToggle` prop which receives is called whenever a node is expanded or collapsed with its id and its expansion status

```tsx
<TreeView
  onNodeExpansionToggle={(event, nodeId, isExpanded) =>
    console.log(nodeId, isExpanded)
  }
/>
```

:::
