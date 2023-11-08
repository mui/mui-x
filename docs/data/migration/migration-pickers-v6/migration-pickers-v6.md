---
productId: x-date-pickers
---

# Migration from v6 to v7

<!-- #default-branch-switch -->

<p class="description">This guide describes the changes needed to migrate the Date and Time Pickers from v6 to v7.</p>

## Introduction

TBD

## Start using the new release

In `package.json`, change the version of the date pickers package to `next`.

```diff
-"@mui/x-date-pickers": "6.x.x",
+"@mui/x-date-pickers": "next",
```

## Breaking changes

Since `v7` is a major release, it contains changes that affect the public API.
These changes were done for consistency, improved stability and to make room for new features.
