---
productId: x-charts
---

# Migration from v6 to v7

<p class="description">This guide describes the changes needed to migrate Charts from v6 to v7.</p>

## Introduction

TBD

## Start using the new release

In `package.json`, change the version of the charts package to `next`.

```diff
-"@mui/x-charts": "6.x.x",
+"@mui/x-charts": "next",
```

## Breaking changes

Since `v7` is a major release, it contains changes that affect the public API.
These changes were done for consistency, improved stability and to make room for new features.
