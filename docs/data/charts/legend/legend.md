---
title: Charts - Legend
productId: x-charts
components: ChartsLegend, ChartsText, ContinuousColorLegend, PiecewiseColorLegend
---

# Charts - Legend

<p class="description">Customize how series and data are identified in chart legends.</p>

A legend is a UI element that maps symbols and colors to series labels, helping users identify different data series in a chart.

In chart components, the legend links series with `label` properties and their colors.

{{"demo": "BasicLegend.js"}}

## Toggle visibility

You can enable interactive visibility toggling by setting the `toggleVisibilityOnClick` prop to `true`.
When enabled, clicking on a legend item hides or shows the corresponding series or data item in the chart.

Hidden items are visually indicated in the legend with reduced opacity.

{{"demo": "ToggleSeriesVisibility.js"}}

### Visibility change callback

You can listen to visibility changes using the `onHiddenItemsChange` prop on the chart component.
This callback receives an array of hidden item identifiers whenever the visibility state changes.

To set the initial hidden items, you can use the `initialHiddenItems` prop.

The following demo shows a line chart where you can toggle series' visibility and see the count of currently visible series.

{{"demo": "VisibilityOnChange.js"}}

:::info
The `toggleVisibilityOnClick` prop can be combined with the `onItemClick` handler.
When both are in use, the `onItemClick` callback is called first, followed by `onHiddenItemsChange`.
:::

### Controlled visibility

You can control the visibility state externally using the `hiddenItems` prop.
This prop accepts an array of item identifiers that should be hidden in the chart.

Different chart types have different identifier formats:

- All identifiers require a `type` field indicating the series type (for example, `'line'`, `'bar'`, `'pie'`, etc.).
- Use `VisibilityIdentifier` type to build such identifiers.
  - It accepts a series type as generic parameter, and can be used as `VisibilityIdentifier<'line'>` in order to narrow the allowed values.

The demo below shows how to control which items are visible using buttons.

{{"demo": "ControlledVisibility.js"}}

## Customization

You can customize a legend's dimensions, position, and styles using the classes and properties described below.

### Dimensions

You can customize much of the legend using CSS properties.
The main class for the legend container is `.MuiChartsLegend-root`.

Alternatively, you can use the `legendClasses` variable if using CSS-in-JS (such as Emotion with Material UI) to target the elements.

Each legend item is composed of two main elements: the `mark` and the `label`.

The example below shows how to customize parts of the legend and how to use both the `legendClasses` variable and the CSS class directly.

{{"demo": "LegendDimension.js", "hideToolbar": true, "bg": "playground"}}

### Position

You can display the legend in a `'vertical'` or `'horizontal'` layout using the `direction` property.

You can also move it with the `position: { vertical, horizontal }` property, which defines how the legend aligns in the parent container.

- `vertical`: `'top'`, `'middle'`, or `'bottom'`
- `horizontal`: `'left'`, `'middle'`, or `'right'`

By default, the legend is placed above the chart.

Position management relies on the [`grid-template` CSS property](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/grid-template).
If you create a custom legend component, you need to set the CSS property `grid-area` to `'legend'` to position your component correctly.

:::warning
For [self-contained charts](/x/react-charts/quickstart/#self-contained-charts), the `position` property is available in `slotProps.legend`.

When [composing custom charts](/x/react-charts/quickstart/#composable-charts), this behavior is handled by the `legendPosition` prop of the `ChartsWrapper`.
Or you can place the legend wherever you prefer.
:::

{{"demo": "LegendPosition.js", "hideToolbar": true, "bg": "playground"}}

### Hiding

You can hide the legend with the `hideLegend` prop of the Chart.

{{"demo": "HiddenLegend.js"}}

### Label styling

You can change the `label` style by targeting the root component's font properties.

The mark is an SVG element, so you can use the `fill` property to change its color.
You can do this via the `sx` prop, CSS modules, or other CSS approaches, as shown in the demo below:

{{"demo": "LegendTextStyling.js", "hideToolbar": true, "bg": "playground"}}

### Change mark shape

You can change the mark shape using the `labelMarkType` property of the series item.
For the `pie` series, the `labelMarkType` property is also available for each pie slice.

{{"demo": "LegendMarkType.js", "hideToolbar": true, "bg": "playground"}}

#### Custom shapes

For more advanced use cases, you can provide a component to the `labelMarkType` property of each series to fully customize the mark.

{{"demo": "LegendCustomLabelMark.js" }}

Passing a component to `labelMarkType` affects not only the legend but also other places where the label mark is shown, such as tooltips.

Customizing the mark shape of a pie chart based on the series is slightly different.
See [this example](/x/react-charts/pie-demo/#pie-chart-with-custom-mark-in-legend-and-tooltip) for details.

To ensure compatibility with [gradients and patterns](/x/react-charts/styling/#gradients-and-patterns), consider using SVG instead of HTML in the `labelMarkType`.

### Scrollable legend

You can make the legend scrollable by setting `overflowY` for vertical legends or `overflowX` for horizontal legends.
Make sure the legend container has a fixed height or width to enable scrolling.

{{"demo": "ScrollableLegend.js"}}

### Series styling

You can use CSS to style the series in the legend.
Each legend item has a `data-series` attribute where its value is the ID of the series it represents.

{{"demo": "LegendStyleSeries.js"}}

### Custom component

For advanced customization, you can create your own legend with the `useLegend()` hook.
This hook returns the items that the default legend would plot so you can focus on the rendering.

The demo below shows how to use `labelMarkType` together with `useLegend()` to create a legend with custom shapes.

This approach uses slots to render the legend items.
See [HTML components](/x/react-charts/components/#html-components) for a demo that shows how to implement it when composing a custom chart.

{{"demo": "CustomLegend.js"}}

## Color legend

To display a legend associated with a [`colorMap`](/x/react-charts/styling/#values-color), you can use:

- `ContinuousColorLegend` if you're using `colorMap.type='continuous'`
- `PiecewiseColorLegend` if you're using `colorMap.type='piecewise'`

You can override the `legend` slot to display the desired legend, or use the [composition API](/x/react-charts/composition/) to add as many legends as needed.

{{"demo": "VeryBasicColorLegend.js"}}

### Select data

To select the color mapping to represent, use the following props:

- `axisDirection`: `'x'`, `'y'`, or `'z'` - indicates which axis contains the `colorMap` definition
- `axisId`: The ID of the axis to use (if the selected direction contains multiple axes)

{{"demo": "BasicColorLegend.js"}}

### Position

Positioning for the color legend works the same way as the [series legend]](#position).

### Label position

You can position labels in relation to the marks or gradient with the `labelPosition` prop.
The values accepted are `'start'`, `'end'`, and `'extremes'`.
The piecewise legend has two additional options: `'inline-start'` and `'inline-end'`.

- With `direction='horizontal'`, `'start'` places labels above the visual marker, while `'end'` places them below
- With `direction='vertical'`, `'start'` or `'end'` positions labels to the left and right of the visual markers, respectively
- With `'extremes'`, labels are positioned at both the beginning and end of the visual marker

For the piecewise legend, two extra values are accepted:

- With `direction='horizontal'`, `'inline-start'` and `'inline-end'` position labels inline with the marker
- With `direction='vertical'`, these work the same as `'start'` and `'end'`

{{"demo": "LegendLabelPositions.js"}}

### Continuous color mapping

You can modify the shape of the gradient using the `length` and `thickness` props.
The `length` can be either a number (in px) or a percentage string.
`"100%"` corresponds to the parent dimension.

To format labels, use the `minLabel`/`maxLabel` props.
They accept either a string to display or a function `({value, formattedValue}) => string`.

You can also reverse the gradient with the `reverse` prop.

{{"demo": "ContinuousInteractiveDemo.js", "hideToolbar": true, "bg": "playground"}}

### Piecewise color mapping

The piecewise legend is similar to the series legend when it comes to color mapping and accepts the same props for [customization](#customization).

To override labels generated by default, provide a `labelFormatter` prop.
This prop takes the minimum or maximum of the piece and returns the label.

Values can be `null` for the first and last pieces.
Returning `null` removes the piece from the legend.
Returning an empty string removes the label but still displays the `mark`.

```ts
labelFormatter = ({ index, length, min, max, formattedMin, formattedMax }) =>
  string | null;
```

You can change the mark type with the `markType` prop.
Since the color values are based on the axis and not the series, you must set `markType` directly on the legend.

{{"demo": "PiecewiseInteractiveDemo.js", "hideToolbar": true, "bg": "playground"}}

## Click event

You can pass an `onItemClick()` function to the `ChartsLegend` or `PiecewiseColorLegend` components to handle click events.
They both provide the following signature:

```js
const clickHandler = (
  event, // The click event
  context, // An object that identifies the clicked item
  index, // The index of the clicked item
) => {};
```

The `context` object contains different properties depending on the legend type.
Click the legend items in the demo below to see their content.

{{"demo": "LegendClick.js"}}
