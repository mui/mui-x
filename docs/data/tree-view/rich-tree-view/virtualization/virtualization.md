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

Virtualization is enabled by default on the `<RichTreeViewPro />` component.
Here is an example of a Tree View with 100 000 items:

{{"demo": "BasicVirtualizedRichTreeViewPro.js"}}

You can disable virtualization using the `disableVirtualization` prop:

```tsx
<RichTreeViewPro items={ITEMS} disableVirtualization />
```

## Item height

When virtualization is enabled, the Tree View needs to know the height of each item to calculate which items are visible.
If not provided, the `itemHeight` prop defaults to `32px`.

You can customize the item height by passing a different value:

```tsx
<RichTreeViewPro items={ITEMS} itemHeight={48} />
```

:::warning
Virtualization is not compatible with `itemHeight={null}`.
If your items have different heights, you need to disable virtualization using the `disableVirtualization` prop.
:::

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

## Layout

:::error
When virtualization is enabled, the Tree View has no intrinsic dimensions: you must set the dimensions using one of the approaches below or else it may not display correctly.
By default, the virtualized Tree View fills the space of its parent container, so that container must have intrinsic dimensions.
In other words, if the container has no child elements, then it still must have non-zero dimensions.
:::

### Flex parent container

:::success
When to use:

- You want the Tree View to take its content's height, but with a minimum or maximum height constraints.
- You want the Tree View height to be dynamic, and use item virtualization when items do not fit the Tree View viewport.

When not to use:

- You want the Tree View to always take the height of its content, with no vertical scrollbar, and no item virtualization.
  In this case, use the `disableVirtualization` prop.

:::

The Tree View can be placed inside a flex container with `flex-direction: column`.
Without setting the minimum and maximum height, the Tree View takes as much space as it needs to display all rows.

:::warning
Consider setting `maxHeight` on the flex parent container, otherwise item virtualization will not be able to improve performance by limiting the number of elements rendered in the DOM.
:::

{{"demo": "FlexRichTreeView.js", "bg": "inline"}}

### Minimum and maximum height

In the demo below, the Tree View is placed inside a flex container with a minimum height of `200px` and a maximum height of `400px` and adapts its height when the number of items changes.

{{"demo": "MinMaxHeightRichTreeView.js", "bg": "inline"}}

## Percentage dimensions

When using percentages (%) for height or width, make sure that the Tree View's parent container has intrinsic dimensions.
Browsers adjust the element based on a percentage of its parent's size.
If the parent has no size, the percentage will be zero.

## Predefined dimensions

You can predefine dimensions for the parent of the Tree View.

{{"demo": "FixedSizeRichTreeView.js", "bg": "inline"}}
