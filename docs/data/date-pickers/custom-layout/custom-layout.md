---
product: date-pickers
title: Date and Time pickers - Custom layout
---

# Custom layout

<p class="description">The date picker lets you reorganize its layout</p>

## Default layout structure

By default, pickers are made of 3 sub elements present in the following order:

- The **toolbar** displaying the selected date. Can be enforced with `showToolbar` prop.
- The **content** that includes the current view, and the tabs to switch between views if necessary.
- The **action bar** allowing some interactions. Can be added with [`componentsProps.actionBar`](/x/react-date-pickers/custom-components/#action-bar) porp.

You can [customize those components](/x/react-date-pickers/custom-components/) individually by using `components` and `componentsProps`.

### Orientation

Toggling layout can be achieved by changing `orientation` prop value between `'portrait'` or `'landscape'`.

Here is a demonstration with the 3 components outlined with color borders.

{{"demo": "LayoutBlocks.js"}}

## Customize layout

### Understanding the structure

The layout is structured as follows:

A `<LayoutRoot />` component wraps all the sub-components to provide the structure.
By default it renders a `div` with `display: grid`.
Such that all sub-components take place into a 3 by 3 [CSS grid](https://developer.mozilla.org/fr/docs/Web/CSS/CSS_Grid_Layout).

Subcomponents are wrapped inside layout helper, responsible for placing it into the grid.
Here is an overview of the structure.

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

### Moving elements

To move an element—the easiest way is to override it's wrapper position with [`gridColumn`](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-column) and [`gridRow`](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-row) properties.

In the next example, the action bar is replaced by a list, and placed at the right of the component.
Placing at the right is achieved by applying `{ gridColumn: '3', gridRow: '2' }` style.

{{"demo": "MovingActions.js"}}

### Adding components

You can add components to the layout by overriding the `LayoutRoot` wrapper.

{{"demo": "AddComponent.js"}}
