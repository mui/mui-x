---
productId: x-tree-view
components: RichTreeView, TreeItem
packageName: '@mui/x-tree-view'
githubLabel: 'scope: tree view'
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
---

# Rich Tree View - Virtualization

<p class="description">Handle large datasets in your Tree View.</p>

## Basic usage

Use the `virtualization` prop to enable virtualization on the `RichTreeViewPro` component.
Here is an example of a Tree View with 100 000 items:

{{"demo": "BasicVirtualizedRichTreeViewPro.js"}}

## Item height

When virtualization is enabled, the Tree View needs to know the height of each item to calculate which items are visible.
If not provided, the `itemHeight` prop defaults to `32px`.

You can customize the item height by passing a different value:

```tsx
<RichTreeViewPro items={ITEMS} virtualization itemHeight={48} />
```

See the [Item height](/x/react-tree-view/rich-tree-view/items/#item-height) documentation for more details.

## DOM structure

Virtualization requires a flat DOM structure where all items are rendered as siblings, regardless of their hierarchy in the tree.
This is automatically enforced, when virtualization is enabled the `domStructure` prop is set to `"flat"` and cannot be changed.

```html
<ul>
  <li>Item 1</li>
  <li>Item 1.1</li>
  <li>Item 1.2</li>
  <li>Item 2</li>
</ul>
```

See the [DOM structure](/x/react-tree-view/rich-tree-view/items/#dom-structure) documentation for more details.
