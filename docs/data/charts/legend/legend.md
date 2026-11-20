---
title: Charts - Legend
productId: x-charts
components: ChartsLegend, ChartsText, ContinuousColorLegend, PiecewiseColorLegend
---

# Charts - Legend

<p class="description">Customize how series and data are identified in chart legends.</p>

A legend is a UI element that maps symbols and colors to series labels, helping users identify different data series in a chart.

In chart components, the legend links series with `label` properties and their colors.

{{"component": "file://./demos/basic-legend/index.ts"}}

## Toggle visibility

You can enable interactive visibility toggling by setting the `toggleVisibilityOnClick` prop to `true`.
When you click a legend item, it hides or shows the corresponding series or data item in the chart.
Hidden items appear with reduced opacity in the legend.

By default axes compute their domain based on all series.
To only consider visible series set the axis property `domainSeries` to `'visible'`.

This demo shows how hiding series can impact the x-axis.

{{"component": "file://./demos/toggle-series-visibility/index.ts"}}

### Stack series edge case

When series are stacked, we recommend using `domainSeries: 'visible'`.
Otherwise, hiding the bottom series could bring the other one outside of the axis domain.

In this demo, hiding the blue series (New York) decreases the values of the two other ones as expected.
But if the y-axis does not take it into consideration, the yellow series which has some values below 50 goes outside of the drawing area.

{{"component": "file://./demos/stack-line-visibility/index.ts"}}

### Visibility change callback

You can listen to visibility changes using `onHiddenItemsChange()` on the chart component.
This callback function receives an array of hidden item identifiers whenever the visibility state changes.

To set the initial hidden items, use the `initialHiddenItems` prop.

The demo below shows a line chart where you can toggle series' visibility and see the count of currently visible series.

{{"component": "file://./demos/visibility-on-change/index.ts"}}

:::info
You can combine the `toggleVisibilityOnClick` prop with the `onItemClick()` handler.
When both are in use, the `onItemClick()` callback runs first, followed by `onHiddenItemsChange()`.
:::

### Controlled visibility

You can control the visibility state externally using the `hiddenItems` prop.
You can pass an array of item identifiers that should be hidden in the chart.
Different chart types use different identifier formats.

Use the `VisibilityIdentifier` type to build identifiers.
It accepts a series type as a generic parameter, and you can use it as `VisibilityIdentifier<'line'>` to narrow the allowed values.
All identifiers require a `type` field indicating the series type (for example, `'line'`, `'bar'`, or `'pie'`).

The demo below shows how to control which items are visible using buttons.

{{"component": "file://./demos/controlled-visibility/index.ts"}}

## Customization

You can customize a legend's dimensions, position, and styles using the classes and properties described below.

### Dimensions

You can customize much of the legend using CSS properties.
The main class for the legend container is `.MuiChartsLegend-root`.

Alternatively, you can use the `legendClasses` variable if using CSS-in-JS (such as Emotion with Material UI) to target the elements.

Each legend item is composed of two main elements: the `mark` and the `label`.

The example below shows how to customize parts of the legend and how to use both the `legendClasses` variable and the CSS class directly.

{{"component": "file://./demos/legend-dimension/index.ts", "hideToolbar": true, "bg": "playground"}}

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

{{"component": "file://./demos/legend-position/index.ts", "hideToolbar": true, "bg": "playground"}}

### Hiding

You can hide the legend with the `hideLegend` prop of the Chart.

{{"component": "file://./demos/hidden-legend/index.ts"}}

### Label styling

You can change the `label` style by targeting the root component's font properties.

The mark is an SVG element, so you can use the `fill` property to change its color.
You can do this via the `sx` prop, CSS Modules, or other CSS approaches, as shown in the demo below:

{{"component": "file://./demos/legend-text-styling/index.ts", "hideToolbar": true, "bg": "playground"}}

### Change mark shape

You can change the mark shape using the `labelMarkType` property of the series item.
For the `pie` series, the `labelMarkType` property is also available for each pie slice.

{{"component": "file://./demos/legend-mark-type/index.ts", "hideToolbar": true, "bg": "playground"}}

#### Custom shapes

For more advanced use cases, you can provide a component to the `labelMarkType` property of each series to fully customize the mark.

{{"component": "file://./demos/legend-custom-label-mark/index.ts"}}

Passing a component to `labelMarkType` affects not only the legend but also other places where the label mark is shown, such as tooltips.

Customizing the mark shape of a pie chart based on the series is slightly different.
See [this example](/x/react-charts/pie-demo/#pie-chart-with-custom-mark-in-legend-and-tooltip) for details.

To ensure compatibility with [gradients and patterns](/x/react-charts/styling/#gradients-and-patterns), consider using SVG instead of HTML in the `labelMarkType`.

### Scrollable legend

You can make the legend scrollable by setting `overflowY` for vertical legends or `overflowX` for horizontal legends.
Make sure the legend container has a fixed height or width to enable scrolling.

{{"component": "file://./demos/scrollable-legend/index.ts"}}

### Series styling

You can use CSS to style the series in the legend.
Each legend item has a `data-series` attribute where its value is the ID of the series it represents.

{{"component": "file://./demos/legend-style-series/index.ts"}}

### Custom component

For advanced customization, you can create your own legend with the `useLegend()` hook.
This hook returns the items that the default legend would plot so you can focus on the rendering.

The demo below shows how to use `labelMarkType` together with `useLegend()` to create a legend with custom shapes.

This approach uses slots to render the legend items.
See [HTML components](/x/react-charts/components/#html-components) for a demo that shows how to implement it when composing a custom chart.

{{"component": "file://./demos/custom-legend/index.ts"}}

## Color legend

To display a legend associated with a [`colorMap`](/x/react-charts/styling/#value-based-colors), you can use:

- `ContinuousColorLegend` if you're using `colorMap.type='continuous'`
- `PiecewiseColorLegend` if you're using `colorMap.type='piecewise'`

You can override the `legend` slot to display the desired legend, or use the [composition API](/x/react-charts/composition/) to add as many legends as needed.

{{"component": "file://./demos/very-basic-color-legend/index.ts"}}

### Select data

To select the color mapping to represent, use the following props:

- `axisDirection`: `'x'`, `'y'`, or `'z'` - indicates which axis contains the `colorMap` definition
- `axisId`: The ID of the axis to use (if the selected direction contains multiple axes)

{{"component": "file://./demos/basic-color-legend/index.ts"}}

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

{{"component": "file://./demos/legend-label-positions/index.ts"}}

### Continuous color mapping

You can modify the shape of the gradient using the `length` and `thickness` props.
The `length` can be either a number (in px) or a percentage string.
`"100%"` corresponds to the parent dimension.

To format labels, use the `minLabel`/`maxLabel` props.
They accept either a string to display or a function `({value, formattedValue}) => string`.

You can also reverse the gradient with the `reverse` prop.

{{"component": "file://./demos/continuous-interactive-demo/index.ts", "hideToolbar": true, "bg": "playground"}}

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

{{"component": "file://./demos/piecewise-interactive-demo/index.ts", "hideToolbar": true, "bg": "playground"}}

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

{{"component": "file://./demos/legend-click/index.ts"}}
