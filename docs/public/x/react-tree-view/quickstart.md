---
productId: x-tree-view
title: Tree View - Quickstart
components: SimpleTreeView, RichTreeView, TreeItem
packageName: '@mui/x-tree-view'
githubLabel: 'scope: tree view'
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
---

# Tree View - Quickstart

Install the MUI X Tree View package and start building.

## Installation

Install the Tree View package that best suits your needs—Community or Pro:



### Peer dependencies

#### Material UI

The Tree View packages have a peer dependency on `@mui/material`.
If you're not already using it, install it now:

<codeblock storageKey="package-manager">

```bash npm
npm install @mui/material @emotion/react @emotion/styled
```

```bash pnpm
pnpm add @mui/material @emotion/react @emotion/styled
```

```bash yarn
yarn add @mui/material @emotion/react @emotion/styled
```

</codeblock>

#### React

<!-- #react-peer-version -->

[`react`](https://www.npmjs.com/package/react) and [`react-dom`](https://www.npmjs.com/package/react-dom) are also peer dependencies:

```json
"peerDependencies": {
  "react": "^17.0.0 || ^18.0.0 || ^19.0.0",
  "react-dom": "^17.0.0 || ^18.0.0 || ^19.0.0"
},
```

## Rendering a Tree View

The package exposes two different versions of this component: `<SimpleTreeView />` and `<RichTreeView />`.
The [Simple version](#simple-tree-view) is recommended for hardcoded items, while the [Rich version](#rich-tree-view) is preferred for dynamically rendered items, larger trees, and more complex use cases that require features like editing and virtualization.

:::info
Currently, the Simple and Rich Tree View components share many of the same features.
As this package continues to mature, more advanced features and functionality will be prioritized for the Rich Tree View.
:::

### Simple Tree View

```jsx
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
```

The simple version of the Tree View component receives its items as JSX children.
This is the recommended version for hardcoded items.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';

export default function BasicSimpleTreeView() {
  return (
    <Box sx={{ minHeight: 352, minWidth: 250 }}>
      <SimpleTreeView>
        <TreeItem itemId="grid" label="Data Grid">
          <TreeItem itemId="grid-community" label="@mui/x-data-grid" />
          <TreeItem itemId="grid-pro" label="@mui/x-data-grid-pro" />
          <TreeItem itemId="grid-premium" label="@mui/x-data-grid-premium" />
        </TreeItem>
        <TreeItem itemId="pickers" label="Date and Time Pickers">
          <TreeItem itemId="pickers-community" label="@mui/x-date-pickers" />
          <TreeItem itemId="pickers-pro" label="@mui/x-date-pickers-pro" />
        </TreeItem>
        <TreeItem itemId="charts" label="Charts">
          <TreeItem itemId="charts-community" label="@mui/x-charts" />
          <TreeItem itemId="charts-pro" label="@mui/x-charts-pro" />
        </TreeItem>
        <TreeItem itemId="tree-view" label="Tree View">
          <TreeItem itemId="tree-view-community" label="@mui/x-tree-view" />
          <TreeItem itemId="tree-view-pro" label="@mui/x-tree-view-pro" />
        </TreeItem>
      </SimpleTreeView>
    </Box>
  );
}

```

### Rich Tree View

```jsx
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
```

The rich version of the Tree View component receives its items dynamically from an external data source.
This is the recommended version for larger trees, as well as those that require more advanced features like editing and virtualization.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';

const MUI_X_PRODUCTS: TreeViewBaseItem[] = [
  {
    id: 'grid',
    label: 'Data Grid',
    children: [
      { id: 'grid-community', label: '@mui/x-data-grid' },
      { id: 'grid-pro', label: '@mui/x-data-grid-pro' },
      { id: 'grid-premium', label: '@mui/x-data-grid-premium' },
    ],
  },
  {
    id: 'pickers',
    label: 'Date and Time Pickers',
    children: [
      { id: 'pickers-community', label: '@mui/x-date-pickers' },
      { id: 'pickers-pro', label: '@mui/x-date-pickers-pro' },
    ],
  },
  {
    id: 'charts',
    label: 'Charts',
    children: [
      { id: 'charts-community', label: '@mui/x-charts' },
      { id: 'charts-pro', label: '@mui/charts-pro' },
    ],
  },
  {
    id: 'tree-view',
    label: 'Tree View',
    children: [
      { id: 'tree-view-community', label: '@mui/x-tree-view' },
      { id: 'tree-view-pro', label: '@mui/x-tree-view-pro' },
    ],
  },
];

export default function BasicRichTreeView() {
  return (
    <Box sx={{ minHeight: 352, minWidth: 250 }}>
      <RichTreeView items={MUI_X_PRODUCTS} />
    </Box>
  );
}

```

### Accessibility

The MUI X Tree View follows the [WAI-ARIA authoring practices for a tree view](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/).
The component includes many built-in [accessibility features](/x/react-tree-view/accessibility/), but it's the developer's responsibilty to provide the component with a descriptive `aria-labelledby`or `aria-label` tag—otherwise, screen readers will announce it as "tree," making it difficult for the end user to understand the purpose of the tree items.

## TypeScript

### Theme augmentation

To benefit from [CSS overrides](/material-ui/customization/theme-components/#theme-style-overrides) and [default prop customization](/material-ui/customization/theme-components/#theme-default-props) with the theme, TypeScript users must import the following types.
These types use module augmentation to extend the default theme structure.

```tsx
// Pro users: add `-pro` suffix to package name
import type {} from '@mui/x-tree-view/themeAugmentation';

const theme = createTheme({
  components: {
    MuiRichTreeView: {
      styleOverrides: {
        root: {
          backgroundColor: 'red',
        },
      },
    },
  },
});
```

## Using this documentation

Although the Simple and Rich Tree View share many of the same features, each version's implementation of those features differs enough that they warrant their own separate docs in most cases.
Other features, such as accessibility, work the same in both versions and are documented in the main features section of the navigation bar.
