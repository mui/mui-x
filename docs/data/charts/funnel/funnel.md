---
title: React Funnel chart
productId: x-charts
components: FunnelChart, FunnelPlot, FocusedFunnelSection
---

# Charts - Funnel [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

<p class="description">Use funnel charts to show how quantities change through sequential steps, such as conversion or engagement stages.</p>

## Overview

A funnel chart shows how a quantity narrows or grows through sequential steps.
Use it for flows like audience engagement, education levels, or conversion pipelines.

The demo below shows a simple funnel with four decreasing values.

{{"demo": "BasicFunnel.js"}}

## Basics

A funnel chart series must include a `data` property with an array of objects.
Each object is one section and must have a `value` property.
You can add optional properties such as `label` and `id`.

### Legend

The funnel shows a legend by default.
Provide a `label` in each data object for the legend text.

Set `hideLegend` to `true` to hide the legend.

{{"demo": "FunnelLegend.js"}}

## Pyramid chart

A pyramid chart is a funnel with an inverted profile.

Set the `curve` property to `'pyramid'` on the series.

{{"demo": "PyramidFunnel.js"}}

## Labels

The funnel shows labels by default (each section's `value`).
Use the `valueFormatter` prop to format them.

{{"demo": "FunnelLabels.js"}}

### Styling labels

Use the `funnelSectionClasses.label` class to style labels.

{{"demo": "FunnelLabelStyling.js"}}

### Positioning labels

The `sectionLabel` property controls label position.
It accepts an object with:

- `position.vertical`: `'top'`, `'middle'`, or `'bottom'`
- `position.horizontal`: `'start'`, `'center'`, or `'end'`
- `offset`: space between the label and the section anchor. Pass a number for both axes, or `{ x?, y? }`.

`textAnchor` and `dominantBaseline` are forwarded to the SVG `text` element.
They behave like the SVG attributes of the same names, not like CSS properties, and the funnel chart only accepts the values below.
See [text-anchor](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/text-anchor) and [dominant-baseline](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/dominant-baseline) on MDN for what each keyword does.

- `textAnchor`: `'start'`, `'middle'`, or `'end'`
- `dominantBaseline`: `'auto'`, `'baseline'`, `'hanging'`, `'middle'`, `'central'`, `'text-after-edge'`, or `'text-before-edge'`

Set `sectionLabel` to `false` to hide labels.
You can also pass a function that receives the data object and returns the label config.

{{"demo": "FunnelLabelPositioning.js"}}

## Styling

### Curve interpolation

Use the `curve` property to choose the shape between sections.
It accepts `'linear'`, `'linear-sharp'`, `'bump'`, `'pyramid'`, `'step'`, or `'step-pyramid'`.

{{"demo": "FunnelCurves.js"}}

### Gap

Use the `gap` property to set the space between sections (in pixels).

{{"demo": "FunnelGap.js"}}

### Border radius

Use the `borderRadius` property to round section corners (in pixels).

The `bump` curve ignores border radius.
The `linear`, `linear-sharp`, and `pyramid` curves respect it partly, depending on section angles.
The `step` and `step-pyramid` curves respect it fully.

See [Curve interpolation](#curve-interpolation) for how `curve` and `borderRadius` interact.

If `gap` is 0, radius applies only to corners not connected to another section.
If `gap` is greater than 0, radius applies to all corners.

{{"demo": "FunnelBorderRadius.js"}}

### Variant

Use the `variant` property to switch between styles:

- `'filled'` (default): solid fill, no stroke
- `'outlined'`: translucent fill with a colored stroke

The `outlined` variant is lighter visually.

{{"demo": "FunnelVariant.js"}}

### Colors

You can customize funnel colors in two ways:

1. Pass a [color palette](/x/react-charts/styling/#built-in-color-palettes). Each section uses a color from the palette.
2. Set a `color` property on each data object to override the palette for that section.

{{"demo": "FunnelColor.js"}}

### CSS

You can style the funnel with CSS.
Each section group has a `data-series` attribute for targeting.
Use `:nth-child` or `:nth-of-type` to target specific sections, as in the demo below.

{{"demo": "FunnelDataAttributes.js"}}

## Multiple funnels

By default, multiple series are stacked.
Pass multiple series and use different colors or styles to tell them apart.
The first series is at the bottom, the last at the top.

{{"demo": "FunnelStacked.js"}}

## Highlight

Set `highlightScope.highlight` to `'item'` to highlight the hovered section.
Set `highlightScope.fade` to `'global'` to fade the other sections.

{{"demo": "HighlightFunnel.js"}}

## Category axis

The funnel uses a category axis that follows the chart orientation.
By default, the axis is hidden.

To show it, pass `position` and `categories` to the `categoryAxis` prop.

{{"demo": "FunnelCategoryAxis.js"}}

### Scaled sections

By default, sections use the `band` scale (equal width).
Set `scaleType` to `'linear'` in the `categoryAxis` configuration to scale section width by value.

{{"demo": "FunnelLinearScale.js"}}

### Auto-sizing axis

You can set the axis `size` to `'auto'` to automatically calculate the axis dimension based on tick label measurements.
This is useful when your tick labels have varying lengths.

{{"demo": "FunnelAxisAutoSize.js"}}
