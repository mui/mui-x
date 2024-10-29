---
productId: x-tree-view
title: Tree View - Getting started
components: SimpleTreeView, RichTreeView, TreeItem, TreeView
packageName: '@mui/x-tree-view'
githubLabel: 'component: tree view'
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
---

# Tree View - Getting started

<p class="description">Get started with the Tree View. Install the package, configure your application and start using the components.</p>

## Installation

Run one of the following commands to install the free Community version or the paid Pro version of the MUI X Tree View:

<!-- #default-branch-switch -->

{{"component": "modules/components/TreeViewInstallationInstructions.js"}}

The Tree View packages have a peer dependency on `@mui/material`.
If you're not already using it, install it with the following command:

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

<!-- #react-peer-version -->

[`react`](https://www.npmjs.com/package/react) and [`react-dom`](https://www.npmjs.com/package/react-dom) are also peer dependencies:

```json
"peerDependencies": {
  "react": "^17.0.0 || ^18.0.0",
  "react-dom": "^17.0.0 || ^18.0.0"
},
```

## Render a Tree View

:::info
Currently, the Simple and Rich Tree View components share many of the same features.
As this package continues to mature, more advanced features and functionality are more likely to land on the Rich Tree View.
:::

### Simple Tree View



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

## Accessibility

(WAI-ARIA: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/)

The component follows the WAI-ARIA authoring practices.

To have an accessible Tree View you must use `aria-labelledby`
or `aria-label` to reference or provide a label on the TreeView,
otherwise, screen readers will announce it as "tree", making it hard to understand the context of a specific tree item.

## TypeScript

To benefit from the [CSS overrides](/material-ui/customization/theme-components/#theme-style-overrides) and [default prop customization](/material-ui/customization/theme-components/#theme-default-props) with the theme, TypeScript users must import the following types.
These types use module augmentation to extend the default theme structure.

```tsx
// only one import is necessary,
// from the version you're currently using.
import type {} from '@mui/x-tree-view/themeAugmentation';
import type {} from '@mui/x-tree-view-pro/themeAugmentation';

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
