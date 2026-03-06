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

## Hooks

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

If your items have different heights, you can pass `itemHeight={null}` to remove the height restriction.
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
