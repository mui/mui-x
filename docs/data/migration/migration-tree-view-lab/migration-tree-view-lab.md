---
productId: x-tree-view
---

# Migration from the lab

<p class="description">Material UI Tree View is now available on MUI X!</p>

## Introduction

This is a reference for migrating your site's tree view from `@mui/lab` to `@mui/x-tree-view`.
This migration is about the npm packages used, it **does not** affect the behavior of the components in your application.

[//]: # 'You can find why we are moving in this direction in the [announcement blog post](/blog/lab-tree-view-to-mui-x/).'

## Migration steps

### 1. Install MUI X package

<codeblock storageKey="package-manager">

```bash npm
npm install @mui/x-tree-view
```

```bash pnpm
pnpm add @mui/x-tree-view
```

```bash yarn
yarn add @mui/x-tree-view
```

</codeblock>

### 2. Run the code mod

We have prepared a codemod to help you migrate your codebase.

You can either run it on a specific file, folder, or your entire codebase when choosing the `<path>` argument.

```bash
npx @mui/codemod v5.0.0/tree-view-moved-to-x <path>
```

Which will transform the imports like this:

```diff
-import TreeView from '@mui/lab/TreeView';
+import { TreeView } from '@mui/x-tree-view/TreeView';

-import { TreeView, TreeItem } from '@mui/lab';
+import { TreeView, TreeItem } from '@mui/x-tree-view';
```
