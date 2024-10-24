---
productId: x-charts
---

# Migration from v7 to v8

<p class="description">This guide describes the changes needed to migrate Charts from v7 to v8.</p>

## Introduction

This is a reference guide for upgrading `@mui/x-charts` from v7 to v8.
The change between v7 and v8 is mostly here to match the version with other MUI X packages.
No big breaking changes are expected.

## Start using the new release

In `package.json`, change the version of the charts package to `next`.

```diff
-"@mui/x-charts": "^7.0.0",
+"@mui/x-charts": "next",
```

Using `next` ensures that it will always use the latest v8 pre-release version, but you can also use a fixed version, like `8.0.0-alpha.0`.

## Breaking changes

Since v8 is a major release, it contains some changes that affect the public API.
These changes were done for consistency, improve stability and make room for new features.
Below are described the steps you need to make to migrate from v7 to v8.

:::info
The list is currently empty, but as we move forward with development during the alpha and beta phases, we'll feed this page with all changes in the API.
:::
