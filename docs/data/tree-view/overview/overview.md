---
productId: x-tree-view
title: Tree View React component
githubLabel: 'component: tree view'
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
packageName: '@mui/x-tree-view'
---

# MUI X Tree View

<p class="description">The Tree View component lets users navigate hierarchical lists of data with nested levels that can be expanded and collapsed.</p>

{{"component": "@mui/docs/ComponentLinkHeader"}}

## Available components

The MUI X Tree View package exposes two different versions of the component:

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

:::info
At the moment, the Simple and Rich Tree Views are similar in terms of feature support. But as the component grows, you can expect to see the more advanced ones appear primarily on the Rich Tree View.
:::

### Tree Item components

The `@mui/x-tree-view` package exposes two different components to define your tree items:

- `TreeItem`
- `TreeItem2`

#### `TreeItem`

This is the long-standing component that is very similar to the one used in previous versions (`@mui/x-tree-view@6` and `@mui/lab`).

When using `SimpleTreeView`,
you can import it from `@mui/x-tree-view/TreeItem` and use it as a child of the `SimpleTreeView` component:

```tsx
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';

export default function App() {
  return (
    <SimpleTreeView>
      <TreeItem itemId="1" label="Item 1" />
      <TreeItem itemId="2" label="Item 2" />
    </SimpleTreeView>
  );
}
```

When using `RichTreeView`,
you don't have to import anything; it's the default component used to render the items:

```tsx
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';

export default function App() {
  return <RichTreeView items={ITEMS} />;
}
```

#### `TreeItem2`

This is a new component that provides a more powerful customization API, and will eventually replace `TreeItem`.

When using `SimpleTreeView`,
you can import it from `@mui/x-tree-view/TreeItem2` and use it as a child of the `SimpleTreeView` component:

```tsx
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem2 } from '@mui/x-tree-view/TreeItem2';

export default function App() {
  return (
    <SimpleTreeView>
      <TreeItem2 itemId="1" label="Item 1" />
      <TreeItem2 itemId="2" label="Item 2" />
    </SimpleTreeView>
  );
}
```

When using `RichTreeView`,
you can import it from `@mui/x-tree-view/TreeItem2` and pass it as a slot of the `RichTreeView` component:

```tsx
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeItem2 } from '@mui/x-tree-view/TreeItem2';

export default function App() {
  return <RichTreeView items={ITEMS} slots={{ item: TreeItem2 }} />;
}
```
