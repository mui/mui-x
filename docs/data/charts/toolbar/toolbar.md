---
title: Charts - Toolbar
productId: x-charts
components: Toolbar, ToolbarButton, ChartsToolbarPro, ChartsToolbarZoomInTrigger, ChartsToolbarZoomOutTrigger, ChartsToolbarPrintExportTrigger, ChartsToolbarImageExportTrigger
---

# Charts - Toolbar

<p class="description">Charts can display a toolbar for easier access to certain functionality.</p>

Charts provide a toolbar that can be enabled to give users quick access to certain features.

The toolbar is available on scatter, bar, line, pie, and radar charts.

To enable the toolbar, set the `showToolbar` prop to `true` on the chart component.

:::info
The toolbar is only displayed if there are actions available.

For example, if the chart is not zoomable, the zoom buttons will not be displayed.
:::

{{"demo": "ChartsToolbar.js"}}

## Customization

The toolbar is highly customizable, built to integrate with any design system.

:::info
If you're replacing the toolbar by a custom one, the container should have the CSS class `chartsToolbarClasses.root`.

This class is used by the `<ChartsWrapper />` to place the toolbar relatively to the legend and the chart.
If you use composition without `<ChartsWrapper />` you can ignore this info.
:::

### Slots

You can customize basic components, such as buttons and tooltips, by passing custom elements to the `slots` prop of the chart.
You can use this to replace the default buttons with components from your design system.

If you're creating a chart using [composition](/x/react-charts/composition/), these basic components can be provided as slots to the `ChartDataProvider`.

{{"demo": "ChartsToolbarCustomElements.js"}}

### Render prop

The `render` prop can be used to customize the rendering of the toolbar's elements.

You can pass a React element to the `render` prop of the `ToolbarButton` component to replace the default button with your own component.

This is useful when you want to render a custom component but want to use the toolbar's [accessibility](#accessibility) features, such as keyboard navigation and ARIA attributes, without having to implement them yourself.

```tsx
<ToolbarButton render={<MyButton />} />
```

Alternatively, you can pass a function to the `render` prop, which receives the props and state as arguments.

```tsx
<ToolbarButton render={(props, state) => <MyButton {...props} />} />
```

You can see an example in the [composition](#composition) section.

### Composition

If you want to further customize the toolbar's functionality, you can also partially or entirely replace it with a custom implementation.

You can achieve this by providing a custom component to the `toolbar` slot.

Components such as `Toolbar` and `ToolbarButton` can be used to build your own toolbar using the default components as a base, or you can create your own custom toolbar from scratch.

{{"demo": "ChartsToolbarCustomToolbar.js"}}

## Accessibility

(WAI-ARIA: https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/)

The component follows the WAI-ARIA authoring practices.

### ARIA

- The element rendered by the `<Toolbar />` component has the `toolbar` role.
- The element rendered by the `<Toolbar />` component has `aria-orientation` set to `horizontal`.
- You must apply a text label or an `aria-label` attribute to the `<ToolbarButton />`.

### Keyboard

The Toolbar component supports keyboard navigation.
It implements the roving tabindex pattern.

|                                                               Keys | Description                              |
| -----------------------------------------------------------------: | :--------------------------------------- |
|                                         <kbd class="key">Tab</kbd> | Moves focus into and out of the toolbar. |
| <kbd><kbd class="key">Shift</kbd>+<kbd class="key">Tab</kbd></kbd> | Moves focus into and out of the toolbar. |
|                                        <kbd class="key">Left</kbd> | Moves focus to the previous button.      |
|                                       <kbd class="key">Right</kbd> | Moves focus to the next button.          |
|                                        <kbd class="key">Home</kbd> | Moves focus to the first button.         |
|                                         <kbd class="key">End</kbd> | Moves focus to the last button.          |
