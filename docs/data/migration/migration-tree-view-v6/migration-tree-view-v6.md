---
productId: x-tree-view
---

# Migration from v6 to v7

<!-- #default-branch-switch -->

<p class="description">This guide describes the changes needed to migrate the Tree View from v6 to v7.</p>

## Introduction

TBD

## Start using the alpha release

In `package.json`, change the version of the date pickers package to `next`.

```diff
-"@mui/x-tree-view": "6.x.x",
+"@mui/x-tree-view": "next",
```

## Breaking changes

Since `v7` is a major release, it contains changes that affect the public API.
These changes were done for consistency, improved stability and to make room for new features.
