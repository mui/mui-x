---
title: Charts - Toolbar
productId: x-charts
components: Toolbar, ToolbarButton, ChartsToolbarPro, ChartsToolbarZoomInTrigger, ChartsToolbarZoomOutTrigger, ChartsToolbarRangeButtonTrigger, ChartsToolbarPrintExportTrigger, ChartsToolbarImageExportTrigger
---

# Charts - Toolbar

<p class="description">Add a toolbar to charts for quick access to common features.</p>

You can enable a toolbar on charts to give users quick access to certain features.
The toolbar is available on scatter, bar, line, pie, and radar charts.

To enable the toolbar, set the `showToolbar` prop to `true` on the chart component.

:::info
The toolbar is only displayed if there are actions available.
For example, if the chart doesn't have zooming enabled, then the zoom buttons don't appear.
:::

{{"demo": "ChartsToolbar.js"}}

## Range buttons [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

Range buttons allow users to quickly zoom to predefined time ranges from the toolbar.
They are particularly useful for time-series charts where users need to switch between different time windows.

Pass the `rangeButtons` prop to the toolbar to configure the available ranges.
Each button zooms the chart to show a specific time period calculated from the end of the data.

{{"demo": "ChartsToolbarRangeButtons.js"}}

### Range button values

The `value` property of each range button supports the following formats:

#### Calendar interval

Use `{ unit, step }` to show a time period from the end of the data. The `step` defaults to `1`.
Supported units: `'year'`, `'month'`, `'week'`, `'day'`, `'hour'`, `'minute'`, `'second'`, `'millisecond'`, and `'microsecond'`.

```tsx
{ label: '1M', value: { unit: 'month' } }
{ label: '3M', value: { unit: 'month', step: 3 } }
{ label: '1Y', value: { unit: 'year' } }
```

#### Absolute date range

Use `[startDate, endDate]` to zoom to a fixed date range.

```tsx
{ label: '2024 H1', value: [new Date(2024, 0, 1), new Date(2024, 6, 1)] }
```

#### Function

Use a function to compute custom zoom percentages (0–100).
It receives the full domain bounds and the current zoomed-in bounds as timestamps.

```tsx
{ label: 'First half', value: () => ({ start: 0, end: 50 }) }
{ label: 'Last half', value: () => ({ start: 50, end: 100 }) }
```

#### Reset

Use `null` to reset zoom to show all data.

```tsx
{ label: 'All', value: null }
```

The following demo shows all value types together:

{{"demo": "ChartsToolbarRangeButtonValues.js"}}

### Custom toolbar with range buttons

You can use `ChartsToolbarRangeButtonTrigger` directly in a custom toolbar to have full control over layout and behavior.

{{"demo": "ChartsToolbarCustomRangeButtons.js"}}

## Custom toolbar elements

You can customize basic components, such as buttons and tooltips, by passing custom elements to the `slots` prop of the chart.
You can use this to replace the default buttons with components from your design system.

If you're composing a custom component, you can provide these basic components as slots to `ChartsDataProvider`.

{{"demo": "ChartsToolbarCustomElements.js"}}

## Custom element rendering

You can use the `render` prop to customize the rendering of the toolbar's elements.
Pass a React element to the `render` prop of the `ToolbarButton` component to replace the default button with your own component.

This is useful when you want to render a custom component but use the toolbar's [accessibility](#accessibility) features, such as keyboard navigation and ARIA attributes, without implementing them yourself.

```tsx
<ToolbarButton render={<MyButton />} />
```

Alternatively, you can pass a function to the `render` prop, which receives the props and state as arguments.

```tsx
<ToolbarButton render={(props, state) => <MyButton {...props} />} />
```

The section below provides an example of this.

## Fully custom toolbar

You can partially or entirely replace the toolbar with a custom implementation to further customize its functionality.
To do so, provide a custom component to the `toolbar` slot.

You can use components such as `Toolbar` and `ToolbarButton` to build your own toolbar using the default components as a base, or create your own custom toolbar from scratch.

{{"demo": "ChartsToolbarCustomToolbar.js"}}

:::info
If you're replacing the toolbar with a custom one, the container should have the CSS class `chartsToolbarClasses.root`.

The `ChartsWrapper` component uses this class to place the toolbar relative to the legend and the chart.
If you're composing a custom component without `ChartsWrapper`, you can ignore this information.
:::

## Accessibility

`Toolbar` follows the [WAI-ARIA authoring practices](https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/).

### ARIA

- The `Toolbar` component renders an element with the `toolbar` role
- The `Toolbar` component renders an element with `aria-orientation` set to `horizontal`
- You must apply a text label or an `aria-label` attribute to `ToolbarButton`

### Keyboard

The `Toolbar` component supports keyboard navigation.
It implements the roving tabindex pattern.

|                                                               Keys | Description                              |
| -----------------------------------------------------------------: | :--------------------------------------- |
|                                         <kbd class="key">Tab</kbd> | Moves focus into and out of the toolbar. |
| <kbd><kbd class="key">Shift</kbd>+<kbd class="key">Tab</kbd></kbd> | Moves focus into and out of the toolbar. |
|                                        <kbd class="key">Left</kbd> | Moves focus to the previous button.      |
|                                       <kbd class="key">Right</kbd> | Moves focus to the next button.          |
|                                        <kbd class="key">Home</kbd> | Moves focus to the first button.         |
|                                         <kbd class="key">End</kbd> | Moves focus to the last button.          |
