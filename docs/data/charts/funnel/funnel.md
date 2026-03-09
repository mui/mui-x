---
title: React Funnel chart
productId: x-charts
components: FunnelChart, FunnelPlot, FocusedFunnelSection
---

# Charts - Funnel [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

<p class="description">Show how quantities change through a process, such as audience engagement or conversion stages.</p>

## Overview

A funnel chart shows how a quantity narrows or evolves through sequential steps.
Use it for processes like audience engagement, education levels, or conversion pipelines.

## Basics

A funnel chart series must include a `data` property with an array of objects.
Each object is one section and must have a `value`.
You can add optional properties such as `label` and `id`.

{{"demo": "BasicFunnel.js"}}

### Display legends

The funnel shows a legend by default.
Provide a `label` in each data object.

Set `hideLegend` to `true` to hide it.

{{"demo": "FunnelLegend.js"}}

## Pyramid chart

A pyramid chart is a funnel with an inverted shape.

Set the `curve` property to `'pyramid'` on the series.

{{"demo": "PyramidFunnel.js"}}

## Labels

The funnel shows labels by default (the `value` of each section).
Use the `valueFormatter` prop to format them.

{{"demo": "FunnelLabels.js"}}

### Styling labels

Use the `funnelSectionClasses.label` class to style labels.

{{"demo": "FunnelLabelStyling.js"}}

### Positioning labels

The `sectionLabel` property controls label position.
It accepts an object with:

- `position.vertical`: `'top'`, `'center'`, or `'bottom'`
- `position.horizontal`: `'start'`, `'middle'`, or `'end'`
- `margin`: space between label and section
- `dominantBaseline`: vertical text alignment
- `textAnchor`: horizontal text alignment

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

See the [curve interpolation](/x/react-charts/funnel/#curve-interpolation) section above for how `curve` and `borderRadius` interact.

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

Set `highlightScope.highlight` to highlight the hovered section.
Set `highlightScope.fade` to fade sections that are not hovered.

{{"demo": "HighlightFunnel.js"}}

## Category axis

The funnel uses a category axis that follows the chart orientation.
By default the axis is hidden.

To show it, pass `position` and `categories` to the `categoryAxis` prop.

{{"demo": "FunnelCategoryAxis.js"}}

### Scaled sections

By default sections use the `band` scale (equal width).
Set `scaleType` to `'linear'` in the `categoryAxis` to scale sections by their values.

{{"demo": "FunnelLinearScale.js"}}
