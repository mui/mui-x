---
title: Charts - Legend
productId: x-charts
components: ChartsLegend, ChartsText, ContinuousColorLegend, PiecewiseColorLegend
---

# Charts - Legend

<p class="description">Legend is the UI element mapping symbols and colors to the series' label.</p>

## Basic display

In chart components, the legend links series with `label` properties and their color.

{{"demo": "BasicLegend.js"}}

## Customization

This section explains how to customize the legend using classes and properties.

### Dimensions

Much of the customization can be done using CSS properties.
There is a main class for the legend container, `.MuiChartsLegend-root`.
Alternatively the `legendClasses` variable can be used if using CSS-in-JS to target the elements.

Each legend item is composed of two main elements: the `mark` and the `label`.

The example below explains how it is possible to customize some parts the legend.
And shows how to use both the `legendClasses` variable and the CSS class directly.

{{"demo": "LegendDimension.js", "hideToolbar": true, "bg": "playground"}}

### Position

The legend can either be displayed in a `'vertical'` or `'horizontal'` layout controlled with the `direction` property.

It can also be moved with the `position: { vertical, horizontal }` property which defines how the legend aligns itself in the parent container.

- `vertical` can be `'top'`, `'middle'`, or `'bottom'`.
- `horizontal` can be `'left'`, `'middle'`, or `'right'`.

By default, the legend is placed above the charts.

:::warning
The `position` property is only available in the `slotProps`, but not in the `<ChartsLegend />` props.
In the second case, you are free to place the legend where you want.
:::

{{"demo": "LegendPosition.js", "hideToolbar": true, "bg": "playground"}}

### Hiding

You can hide the legend with the `hideLegend` prop of the Chart.

{{"demo": "HiddenLegend.js"}}

### Label styling

Changing the `label` style can be done by targeting the root component's font properties.

To change the `mark` color or shape, the `fill` class is used instead.
Keep in mind that the `mark` is an SVG element, so the `fill` property is used to change its color.

{{"demo": "LegendTextStyling.js", "hideToolbar": true, "bg": "playground"}}

### Change mark shape

To change the mark shape, you can use the `labelMarkType` property of the series item.
For the `pie` series, the `labelMarkType` property is available for each of the pie slices too.

{{"demo": "LegendMarkType.js", "hideToolbar": true, "bg": "playground"}}

#### Custom shapes

For more advanced use cases, you can also provide a component to the `labelMarkType` property of each series to fully customize the mark.

{{"demo": "LegendCustomLabelMark.js" }}

Passing a component to `labelMarkType` affects not only the legend but other places where the label mark is shown, such as tooltips.

Customizing the mark shape of a pie chart depending on the series is slightly different. You can find how to do it in [this example](/x/react-charts/pie-demo/#pie-chart-with-custom-mark-in-legend-and-tooltip).

To ensure compatibility with [gradients and patterns](/x/react-charts/styling/#gradients-and-patterns), consider using SVG instead of HTML in the `labelMarkType`.

### Scrollable legend

The legend can be made scrollable by setting the `overflowY` for vertical legends or `overflowX` for horizontal legends.
Make sure that the legend container has a fixed height or width to enable scrolling.

{{"demo": "ScrollableLegend.js"}}

### Series styling

You can use CSS to style the series in the legend.
Each legend item has a `data-series` attribute where its value is the ID of the series it represents.

{{"demo": "LegendStyleSeries.js"}}

### Custom component

For advanced customization, you can create your own legend with `useLegend`.
This hook returns the items that the default legend would plot.
Allowing you to focus on the rendering.

This demo also shows how to use `labelMarkType` together with a custom legend to create a legend with custom shapes.

This approach uses slots to render the legend items.
Another demo in [HTML components docs](/x/react-charts/components/#html-components) shows how to use it with composition.

{{"demo": "CustomLegend.js"}}

## Color legend

To display legend associated to a [colorMap](https://mui.com/x/react-charts/styling/#values-color), you can use:

- `<ContinuousColorLegend />` if you're using `colorMap.type='continuous'`
- `<PiecewiseColorLegend />` if you're using `colorMap.type='piecewise'`.

Then it is possible to override the `legend` slot to display the wanted legend, or use the [composition API](https://mui.com/x/react-charts/composition/) to add as many legends as needed.

{{"demo": "VeryBasicColorLegend.js"}}

### Select data

To select the color mapping to represent, use the following props:

- `axisDirection` can be `'x'`, `'y'`, or `'z'`. It indicates which axis contain the `colorMap` definition.
- `axisId` The id of the axis to use in case the selected direction contains multiple ones.

{{"demo": "BasicColorLegend.js"}}

### Position

This component position is done exactly the same way as the [legend for series](#position).

### Label position

The labels can be positioned in relation to the marks or gradient with the `labelPosition` prop.
The values accepted are `'start'`, `'end'` or `'extremes'`.

- With `direction='horizontal'`, using `'start'` places the labels above the visual marker, while `end` places them below.
- When `direction='vertical'`, is `'start'` or `'end'` the labels are positioned `left` and `right` of the visual markers, respectively.
- With the `'extremes'` value, the labels are positioned at both the beginning and end of the visual marker.

{{"demo": "LegendLabelPositions.js"}}

### Continuous color mapping

To modify the shape of the gradient, use the `length` and `thickness` props.
The `length` can either be a number (in px) or a percentage string. The `"100%"` corresponds to the parent dimension.

To format labels use the `minLabel`/`maxLabel`.
They accept either a string to display.
Or a function `({value, formattedValue}) => string`.

It is also possible to reverse the gradient with the `reverse` prop.

{{"demo": "ContinuousInteractiveDemo.js", "hideToolbar": true, "bg": "playground"}}

### Piecewise color mapping

The piecewise Legend is quite similar to the series legend.
It accepts the same props for [customization](#dimensions).

To override labels generated by default, provide a `labelFormatter` prop.
It takes the min/max of the piece and returns the label.

Values can be `null` for the first and last pieces.
And returning `null` removes the piece from the legend.
Returning an empty string removes any label, but still display the `mark`.

```ts
labelFormatter = ({ index, length, min, max, formattedMin, formattedMax }) =>
  string | null;
```

The `markType` can be changed with the `markType` prop.
Since the color values are based on the axis, and not the series, the `markType` has to be set directly on the legend.

{{"demo": "PiecewiseInteractiveDemo.js", "hideToolbar": true, "bg": "playground"}}

## Click event

You can pass an `onItemClick` function to the `ChartsLegend` or `PiecewiseColorLegend` components to handle click events.
They both provide the following signature.

```js
const clickHandler = (
  event, // The click event.
  context, // An object that identifies the clicked item.
  index, // The index of the clicked item.
) => {};
```

The `context` object contains different properties depending on the legend type.
Click the legend items to see their content.

{{"demo": "LegendClick.js"}}
