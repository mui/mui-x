---
title: Charts - Axis customization
productId: x-charts
components: ChartsAxis, ChartsXAxis, ChartsYAxis
---

# Charts - Axis customization

<p class="description">Customize how chart axes are rendered and styled.</p>

Beyond the axis definition, there are several other ways to further customize how axes are rendered.

## Styling axes

To target a specific axis by its ID, use the `data-axis-id` attribute as a selector.
This is useful when you have multiple axes and want to style them differently.

In the example below, the revenue axis label is styled with a teal color and the profit axis label with a blue color to match their respective series.

{{"demo": "AxisIdStyling.js"}}

## Styling grouped axes

### Tick size

You can customize the tick size for each [grouped axis](/x/react-charts/axis/#grouped-axes) by providing a `tickSize` property in the `groups` array.
The `tickSize` also affects the tick label position.
Each item in the array corresponds to a group defined in the `getValue()` function.

{{"demo": "GroupedAxesTickSize.js", "defaultCodeOpen": false}}

### Selecting groups

To target a specific group, use the `data-group-index` attribute as a selector.
The example below has a yellow tick color for the last group and blue text for the first group.

{{"demo": "GroupedAxesStyling.js", "defaultCodeOpen": false}}

## Fixing tick label overflow issues

When your tick labels are too long, they're clipped to avoid overflowing.
To reduce clipping due to overflow, you can [apply an angle to the tick labels](/x/react-charts/axis-customization/#text-customization), use [auto-sizing](/x/react-charts/axis-customization/#auto-sizing-axes), or [increase the axis size](/x/react-charts/styling/#placement) to accommodate them.
In the demo below, the size of the x- and y-axes is modified to increase the space available for tick labels.

The first and last tick labels may bleed into the margin, and if that margin is not enough to display the label, it might be clipped.
To avoid this, you can use the `margin` prop to increase the space between the chart and the edge of the container.

{{"demo": "MarginAndLabelPosition.js"}}

## Passing props

The demo below illustrates all of the props available to customize axis rendering:

{{"demo": "AxisCustomization.js", "hideToolbar": true, "bg": "playground"}}

## Text customization

To customize the text elements (tick labels and axis labels), use the `tickLabelStyle` and `labelStyle` properties of the axis configuration.

When not set, the default values for the `textAnchor` and `dominantBaseline` properties depend on the value of the `angle` property.
You can test how these values behave and relate to one another in the demo below:

{{"demo": "AxisTextCustomization.js", "hideToolbar": true, "bg": "playground"}}

## Adding tick label icons

A `foreignObject` element can be used to render non-SVG elements inside SVGs. You can leverage this to create components that interact with the charts data. In the demo below, custom tick labels are built by displaying an icon below the text.

Bear in mind that using `foreignObject` might prevent charts from being [exported](/x/react-charts/export/).

{{"demo": "TickLabelImage.js"}}

## Custom axis rendering

You can fully customize how axis and their ticks are rendered by providing a component to the `xAxis` or `yAxis` slots.
For more information about how to create custom axes, refer to the [composition section](/x/react-charts/axis/#composition).

{{"demo": "CustomAxisTicks.js"}}
