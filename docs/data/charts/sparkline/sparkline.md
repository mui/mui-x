---
title: Charts - Sparkline
---

# Charts - Sparkline

<p class="description">Sparkline charts can provide an overview of data trends.</p>

## Basics

A sparkline is a small chart drawn without axes or coordinates, that presents the general shape of a variation in a simplified way.
The `<SparklineChart />` requires only the `data` props which is an array of numbers.
You can also switch from line to a bar plot with `plotType="bar"`.

{{"demo": "BasicSparkLine.js"}}

## Line customization

You can fill the area below the sparkline curve with the `area` prop.
To modify the curve interpolation, use the `curve` prop. Read the full documentation for curves in the [line charts page](/x/react-charts/lines/#interpolation).

{{"demo": "AreaSparkLine.js"}}

## Interaction

Compared to line and bar charts, the sparkline chart has some additional props to simplify interaction configuration.
You can use `showTooltip` and `showHighlight` to display the default tooltip and highlight in your sparkline.

Those are helpers.
If you need more advanced customization, you can provide custom props for `tooltip` and `highlight` as described in the [Tooltip page](/x/react-charts/tooltip/).

{{"demo": "BasicSparkLineCustomization.js"}}

## Axis management

By default, the sparkline assigns `xAxis` values as an ascending integer sequence starting from 0 (0, 1, 2,...). These values are, in this case, hidden in the tooltip.
You can override this behavior if your data are not evenly distributed, or if you need to label them.

To do so, use the `xAxis` prop.
Notice that sparkline does not manage multiple axes, so `xAxis` prop takes an axis configuration object.
Whereas most of the other charts expect an array of axis configuration objects.

```jsx
<SparkLineChart data={[1, 4, 2, 5, 7, 2, 4, 6]} xAxis={{ scaleType, data }} />
```

{{"demo": "CustomAxis.js"}}
