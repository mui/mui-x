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

{{"component": "file://./demos/basic-funnel/index.ts"}}

## Basics

A funnel chart series must include a `data` property with an array of objects.
Each object is one section and must have a `value` property.
You can add optional properties such as `label` and `id`.

### Legend

The funnel shows a legend by default.
Provide a `label` in each data object for the legend text.

Set `hideLegend` to `true` to hide the legend.

{{"component": "file://./demos/funnel-legend/index.ts"}}

## Pyramid chart

A pyramid chart is a funnel with an inverted profile.

Set the `curve` property to `'pyramid'` on the series.

{{"component": "file://./demos/pyramid-funnel/index.ts"}}

## Labels

The funnel shows labels by default (each section's `value`).
Use the `valueFormatter` prop to format them.

{{"component": "file://./demos/funnel-labels/index.ts"}}

### Styling labels

Use the `funnelSectionClasses.label` class to style labels.

{{"component": "file://./demos/funnel-label-styling/index.ts"}}

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

{{"component": "file://./demos/funnel-label-positioning/index.ts"}}

## Styling

### Curve interpolation

Use the `curve` property to choose the shape between sections.
It accepts `'linear'`, `'linear-sharp'`, `'bump'`, `'pyramid'`, `'step'`, or `'step-pyramid'`.

{{"component": "file://./demos/funnel-curves/index.ts"}}

### Gap

Use the `gap` property to set the space between sections (in pixels).

{{"component": "file://./demos/funnel-gap/index.ts"}}

### Border radius

Use the `borderRadius` property to round section corners (in pixels).

The `bump` curve ignores border radius.
The `linear`, `linear-sharp`, and `pyramid` curves respect it partly, depending on section angles.
The `step` and `step-pyramid` curves respect it fully.

See [Curve interpolation](#curve-interpolation) for how `curve` and `borderRadius` interact.

If `gap` is 0, radius applies only to corners not connected to another section.
If `gap` is greater than 0, radius applies to all corners.

{{"component": "file://./demos/funnel-border-radius/index.ts"}}

### Variant

Use the `variant` property to switch between styles:

- `'filled'` (default): solid fill, no stroke
- `'outlined'`: translucent fill with a colored stroke

The `outlined` variant is lighter visually.

{{"component": "file://./demos/funnel-variant/index.ts"}}

### Colors

You can customize funnel colors in two ways:

1. Pass a [color palette](/x/react-charts/styling/#built-in-color-palettes). Each section uses a color from the palette.
2. Set a `color` property on each data object to override the palette for that section.

{{"component": "file://./demos/funnel-color/index.ts"}}

### CSS

You can style the funnel with CSS.
Each section group has a `data-series` attribute for targeting.
Use `:nth-child` or `:nth-of-type` to target specific sections, as in the demo below.

{{"component": "file://./demos/funnel-data-attributes/index.ts"}}

## Multiple funnels

By default, multiple series are stacked.
Pass multiple series and use different colors or styles to tell them apart.
The first series is at the bottom, the last at the top.

{{"component": "file://./demos/funnel-stacked/index.ts"}}

## Highlight

Set `highlightScope.highlight` to `'item'` to highlight the hovered section.
Set `highlightScope.fade` to `'global'` to fade the other sections.

{{"component": "file://./demos/highlight-funnel/index.ts"}}

## Category axis

The funnel uses a category axis that follows the chart orientation.
By default, the axis is hidden.

To show it, pass `position` and `categories` to the `categoryAxis` prop.

{{"component": "file://./demos/funnel-category-axis/index.ts"}}

### Scaled sections

By default, sections use the `band` scale (equal width).
Set `scaleType` to `'linear'` in the `categoryAxis` configuration to scale section width by value.

{{"component": "file://./demos/funnel-linear-scale/index.ts"}}

### Auto-sizing axis

You can set the axis `size` to `'auto'` to automatically calculate the axis dimension based on tick label measurements.
This is useful when your tick labels have varying lengths.

{{"component": "file://./demos/funnel-axis-auto-size/index.ts"}}
