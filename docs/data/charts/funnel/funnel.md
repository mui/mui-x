---
title: React Funnel chart
productId: x-charts
components: FunnelChart, FunnelPlot, FocusedFunnelSection
---

# Charts - Funnel [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

<p class="description">Funnel charts let you express quantity evolution along a process, such as audience engagement, population education levels, or yields of multiple processes.</p>

## Basics

Funnel charts series must contain a `data` property containing an array of objects.
Each object corresponds to a section of the funnel.
It must contain a property `value` and can have other optional properties, like `label` and `id`.

{{"demo": "BasicFunnel.js"}}

### Display legends

The funnel chart displays a legend by default.
The only requirement is to provide a `label` value in the data objects.

To hide the legend, set the `hideLegend` prop to `true`.

{{"demo": "FunnelLegend.js"}}

## Pyramid Chart

The pyramid chart is a variation of the funnel chart.

To create a pyramid chart, set the `curve` property to `pyramid` in the series.

{{"demo": "PyramidFunnel.js"}}

## Labels

The funnel chart displays labels by default.
It shows the `value` of the data item in each section.
To format the labels, a `valueFormatter` function can be provided.

{{"demo": "FunnelLabels.js"}}

### Styling labels

The labels can be styled by using the `funnelSectionClasses.label` helper.

{{"demo": "FunnelLabelStyling.js"}}

### Positioning labels

The labels can be positioned relative to the section they represent.
The `sectionLabel` property accepts an object with the following properties:

- `position.vertical`: The vertical position of the label. It can be `top`, `center` or `bottom`.
- `position.horizontal`: The horizontal position of the label. It can be `start`, `middle` or `end`.
- `margin`: The margin between the label and the section.
- `dominantBaseline`: The vertical alignment of the text. It can be `auto`, `baseline`, `text-before-edge`, `text-after-edge`, `central`, `hanging`, or `middle`.
- `textAnchor`: The horizontal alignment of the text. It can be `start`, `middle` or `end`.

The `sectionLabel` property can be set to `false` to hide the labels.
It also accepts a function that receives the data object and should return the label configuration.

{{"demo": "FunnelLabelPositioning.js"}}

## Styling

### Curve interpolation

The interpolation between data points can be customized by the `curve` property.
This property expects one of the following string values, corresponding to the interpolation method: `'linear'`, `'linear-sharp'`, `'bump'`, `'pyramid'`, `'step'` and `'step-pyramid'`.

This series property adds the option to control the interpolation of a series.

{{"demo": "FunnelCurves.js"}}

### Gap

The gap between the sections can be customized by the `gap` property.
It accepts a number that represents the gap in pixels.

{{"demo": "FunnelGap.js"}}

### Border radius

The border radius of the sections can be customized by the `borderRadius` property.
It accepts a number that represents the radius in pixels.

- The `bump` curve interpolation will not respect the border radius.
- The `linear`, `linear-sharp` and `pyramid` curves respect the border radius to some extent due to the angle of the sections.
- The `step` and `step-pyramid` curves respect the border radius.

To understand how the border radius interacts with the `curve` prop, see the [curve interpolation example](/x/react-charts/funnel/#curve-interpolation) above.

The `borderRadius` property will also behave differently depending on whether the `gap` property is greater than 0.

- If the `gap` is 0, the border radius will be applied to the corners of the sections that are not connected to another section.
- If the `gap` is greater than 0, the border radius will be applied to all the corners of the sections.

{{"demo": "FunnelBorderRadius.js"}}

### Variant

The funnel sections can be displayed in two different styles using the `variant` property:

- `'filled'` (default): Sections have a solid fill and no stroke.
- `'outlined'`: Sections have a translucent fill with a colored stroke around them.

The `outlined` variant creates a more lightweight visual style.

{{"demo": "FunnelVariant.js"}}

### Colors

The funnel colors can be customized in two ways.

1. You can provide a [color palette](/x/react-charts/styling/#built-in-color-palettes). Each section of the funnel will be colored according to this palette.
2. You can provide a `color` property in `data` objects, which overrides the palette.

{{"demo": "FunnelColor.js"}}

### CSS

The funnel chart can be styled using CSS.

Each section group has a `data-series` attribute that can be used to target specific series sections.

In order to target specific sections, you can use the `:nth-child` or `:nth-child-of-type` selectors as shown in the example below.

{{"demo": "FunnelDataAttributes.js"}}

## Multiple funnels

By default, multiple series are displayed on top of each other.

Simply provide multiple series to the funnel chart and make sure that they have different colors or styles to differentiate them.

The order of the series determines the display order.
The first series is at the bottom and the last is at the top.

{{"demo": "FunnelStacked.js"}}

## Highlight

The hovered element can be highlighted by setting `highlightScope.highlight` property to one of the possible values.

To fade elements which are not hovered, set the `highlightScope.fade` property.

{{"demo": "HighlightFunnel.js"}}

## Category axis

The funnel chart uses a category axis as the default axis.
This axis always follows the orientation of the chart.

The funnel chart does not display an axis by default.
To display a category axis, pass a `position` and a list of `categories` to the `categoryAxis` props.

{{"demo": "FunnelCategoryAxis.js"}}

### Scaled sections

By default, the sections have the same size because they use the `band` scale type.
A linear scale is also available, and scales the sections based on their values.
To do so, set the `scaleType` property to `linear` in the `categoryAxis`.

{{"demo": "FunnelLinearScale.js"}}
