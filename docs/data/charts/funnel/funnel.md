---
title: React Funnel chart
productId: x-charts
components: FunnelChart, FunnelPlot
---

# Charts - Funnel [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')🚧

<p class="description">Funnel charts allow to express quantity evolution along a process, such as audience engagement, population education levels or yields of multiple processes.</p>

## Basics

The funnel accepts a series which must have a data property containing an array of objects. Those objects should contain a property `value`. They can also have other optional properties, like `label` and `id`.

{{"demo": "BasicFunnel.js"}}

### Display legends

The funnel chart displays a legend by default. The only requirement is to provide a `label` value in the data objects.

To disable the legend, set the `hideLegend` property to `true`.

{{"demo": "FunnelLegend.js"}}

## Customization

### Curve interpolation

The interpolation between data points can be customized by the `curve` property.
This property expects one of the following string values, corresponding to the interpolation method: ``'linear'`, `'bumpX'`, `'bumpY'` and `'step'`.

This series property adds the option to control the interpolation of a series.
Different series could even have different interpolations.

{{"demo": "FunnelCurvesNoSnap.js"}}

### Colors

The funnel colors can be customized in two ways.

1. You can provide a [color palette](/x/react-charts/styling/#color-palette). Each slice of the funnel will be colored according to this palette.
2. You can provide a `color` property in `data` objects which overrides the palette.

```jsx
<FunnelChart
  colors={['red', 'blue', 'green']} // Use palette
  series={[
    {
      data: [
        { value: 10, color: 'orange' }, // Use color property
        // ...
      ],
    },
  ]}
/>
```

{{"demo": "FunnelColor.js"}}

### Highlight

The hovered element can be highlighted by setting `highlightScope.highlight` property to one of the possible values.

To fade elements which are not hovered, set the `highlightScope.fade` property.

{{"demo": "HighlightFunnel.js"}}
