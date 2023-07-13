---
title: Charts - Sparkline
---

# Charts - Sparkline 🚧

<p class="description">Sparkline charts can provide an overview of data trends.</p>

## Basics

The `<SparklineCharts />` requires only the `data` props which is an array of numbers.
You can also choose between spark ann line plot with `plotType="bar"`.

{{"demo": "BasicSparkLine.js"}}

## Interaction

Compared to line and bar charts, the spark-line chart has some additional props to simplify interaction configuration.
You can use `showTooltip` and `showHighlight` to add the default tooltip and highlight to your spark-line component.

Those are helpers.
If you need more advanced customization, you can still provide the tooltip and highlight props described on the [dedicated docs page](/x/react-charts/tooltip/).

{{"demo": "BasicSparkLineCustomization.js"}}

## Axis management

By default, the sparkline will set x values to 0, 1, 2, ... and hide it in the tooltip.
You can override this behavior if your data are not evenly distributed, or if their value matter.

To do so, use the `xAxis` prop.
Notice that sparkline does not manage multiple axes, so `xAxis` prop takes an axis configuration object.
Whereas most of the other charts expect an array of axis configuration objects.

```jsx
<SparkLineChart
  data={[1, 4, 2, 5, 7, 2, 4, 6]}
  xAxis={{ scaleType, data, tooltipHiden }}
/>
```

{{"demo": "CustomAxis.js"}}
