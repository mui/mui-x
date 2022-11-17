---
product: date-pickers
title: Date and Time pickers - Custom layout
---

# Custom layout

<p class="description">The date picker lets you reorganize its layout</p>

## Default layout structure

By default, pickers are made of 3 sub elements present in the following order:

- The **toolbar** displaying the selected date. Can be enforced with `showToolbar` porp.
- The **content** that includes the current view, and the tabs to swicth between views if necessary.
- The **action bar** allowings some interactions. Can be added with [`componentsProps.actionBar`](/x/react-date-pickers/custom-components/#action-bar) porp.

You can [customize those components](/x/react-date-pickers/custom-components/) individualy by using `components` and `componentsProps`.

### Orientation

The layout can be switch between two modes by using props `orientation`.
This prop value can either be `'portrait'` or `'landscape'`.

Here is a demonstration with the 3 components highligted with color full borders

{{"demo": "LayoutBlocks.js"}}

## Customize layout

### Understanding the structure

The layout is structured as follow:

A `<LayoutRoot />` component wrapp all the sub components to provide the structure.
By default it renders a `div` with `display: grid`.
Such that all sub-components take place into a 3 by 3 [CSS grid](https://developer.mozilla.org/fr/docs/Web/CSS/CSS_Grid_Layout).

Subcomponents are wrapped into layout helper, responsible for placing it into the grid.
Here is an otherview of the structure.

```jsx
<LayoutRoot>
  // Toolbar
  <LayoutToolbar>
    <Toolbar />
  </LayoutToolbar>
  // Content
  <LayoutContent>
    <Tabs />
    <View />
  </LayoutContent>
  // Action bar
  <LayoutActionBar>
    <ActionBar />
  </LayoutActionBar>
</LayoutRoot>
```

### Moving components

To move an element, the easiest way is to override it's wrapper position with properties [`gridColumn`](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-column) and [`gridRow`](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-row).

In the next example, the action bar is replaced by a list, and placed at the right of the component.
To place it at the right, we use style `{ gridColumn: '3', gridRow: '2' }`.

{{"demo": "MovingActions.js"}}

### Adding components

You can add componnents to the layout by overriding the `LayoutRoot` wrapper.

{{"demo": "AddComponent.js"}}
