---
productId: x-tree-view
title: Tree View - Getting started
packageName: '@mui/x-tree-view'
githubLabel: 'component: tree view'
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
---

# Tree View - Getting Started

<p class="description">Get started with the Tree View. Install the package, configure your application and start using the components.</p>

## Installation

Using your favorite package manager, install `@mui/x-tree-view`:

:::warning
The `next` tag is used to download the latest v7 **pre-release** version.
:::

<codeblock storageKey="package-manager">
```bash npm
npm install @mui/x-tree-view@next
```

```bash yarn
yarn add @mui/x-tree-view@next
```

```bash pnpm
pnpm add @mui/x-tree-view@next
```

</codeblock>

The Tree View package has a peer dependency on `@mui/material`.
If you are not already using it in your project, you can install it with:

<codeblock storageKey="package-manager">
```bash npm
npm install @mui/material @emotion/react @emotion/styled
```
```bash yarn
yarn add @mui/material @emotion/react @emotion/styled
```
```bash pnpm
pnpm add @mui/material @emotion/react @emotion/styled
```
</codeblock>

<!-- #react-peer-version -->

Please note that [react](https://www.npmjs.com/package/react) and [react-dom](https://www.npmjs.com/package/react-dom) are peer dependencies too:

```json
"peerDependencies": {
  "react": "^17.0.0 || ^18.0.0",
  "react-dom": "^17.0.0 || ^18.0.0"
},
```

### Style engine

Material UI is using [Emotion](https://emotion.sh/docs/introduction) as a styling engine by default. If you want to use [`styled-components`](https://styled-components.com/) instead, run:

<codeblock storageKey="package-manager">
```bash npm
npm install @mui/styled-engine-sc styled-components
```

```bash yarn
yarn add @mui/styled-engine-sc styled-components
```

```bash pnpm
pnpm add @mui/styled-engine-sc styled-components
```

</codeblock>

Take a look at the [Styled engine guide](/material-ui/guides/styled-components/) for more information about how to configure `styled-components` as the style engine.

## Render your first component

To make sure that everything is set up correctly, try rendering a simple `TreeView` component:

{{"demo": "FirstComponent.js"}}
