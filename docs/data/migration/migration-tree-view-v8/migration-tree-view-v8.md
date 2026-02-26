---
title: Tree View - Migration from v8 to v9
productId: x-tree-view
---

# Migration from v8 to v9

<p class="description">This guide describes the changes needed to migrate the Tree View from v8 to v9.</p>

## Introduction

This is a reference guide for upgrading `@mui/x-tree-view` from v8 to v9.

:::success
This guide is also available in <a href="https://raw.githubusercontent.com/mui/mui-x/refs/heads/master/docs/data/migration/migration-tree-view-v8/migration-tree-view-v8.md" target="_blank">Markdown format</a> to be referenced by AI tools like Copilot or Cursor to help you with the migration.
:::

## Start using the new release

In `package.json`, change the version of the Tree View package to `latest`.

```diff
-"@mui/x-tree-view": "^8.x.x",
+"@mui/x-tree-view": "latest",

-"@mui/x-tree-view-pro": "^8.x.x",
+"@mui/x-tree-view-pro": "latest",
```

Since `v9` is a major release, it contains changes that affect the public API.
These changes were done for consistency, improved stability and to make room for new features.
Described below are the steps needed to migrate from `v8` to `v9`.

## Hook exports restricted in `@mui/x-tree-view-pro`

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

## Virtualization enabled by default in `RichTreeViewPro`

The `RichTreeViewPro` component now has virtualization enabled by default.
This improves performance when rendering large datasets.

### Disable virtualization

If you want to opt out of virtualization, use the `disableVirtualization` prop:

```diff
 <RichTreeViewPro
   items={items}
+  disableVirtualization
 />
```

### Set dimensions on the parent container

When virtualization is enabled, the `RichTreeViewPro` component requires its parent container to have intrinsic dimensions.
Make sure to set a height on the container:

```tsx
<div style={{ height: 500 }}>
  <RichTreeViewPro items={items} />
</div>
```

### Customize item height

The default height of each item is `32px`.
You can customize it using the `itemHeight` prop:

```tsx
<RichTreeViewPro items={items} itemHeight={48} />
```

### DOM structure

When virtualization is enabled (default), the DOM structure defaults to `'flat'`.
When virtualization is disabled, it defaults to `'nested'`.

You can explicitly control the DOM structure using the `domStructure` prop:

```tsx
<RichTreeViewPro items={items} domStructure="nested" />
```
