---
productId: x-tree-view
title: Tree View - Quickstart
components: SimpleTreeView, RichTreeView, TreeItem
packageName: '@mui/x-tree-view'
githubLabel: 'component: tree view'
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
---

# Tree View - Quickstart

<p class="description">Install the MUI X Tree View package and start building.</p>

## Installation

Install the Tree View package that best suits your needs—Community or Pro:

{{"component": "modules/components/TreeViewInstallationInstructions.js"}}

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

{{"demo": "BasicSimpleTreeView.js"}}

### Rich Tree View

```jsx
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
```

The rich version of the Tree View component receives its items dynamically from an external data source.
This is the recommended version for larger trees, as well as those that require more advanced features like editing and virtualization.

{{"demo": "BasicRichTreeView.js"}}

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
