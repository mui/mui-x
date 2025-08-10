---
title: Charts - Zoom and pan
productId: x-charts
components: ScatterChartPro, BarChartPro, LineChartPro, ChartZoomSlider
---

# Charts - Zoom and pan [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

<p class="description">Enables zooming and panning on specific charts or axis.</p>

Zooming is possible on the Pro version of the charts: `<LineChartPro />`, `<BarChartPro />`, `<ScatterChartPro />`.

## Basic usage

To enable zooming and panning, set the `zoom` prop to `true` on the wanted axis.

Enabling zoom will enable all the interactions, which are made to be as intuitive as possible.

The following actions are supported:

- **Scroll**: Zoom in/out by scrolling the mouse wheel.
- **Drag**: Pan the chart by dragging the mouse.
- **Pinch**: Zoom in/out by pinching the chart.

{{"demo": "ZoomScatterChart.js"}}
{{"demo": "ZoomBarChart.js"}}
{{"demo": "ZoomLineChart.js"}}

## Zooming options

You can customize the zooming behavior by setting the `zoomOptions` prop.

The following options are available:

- **minStart**: The starting percentage of the axis range. Between 0 and 100.
- **maxEnd**: The ending percentage of the zoom range.
- **step**: The step of the zooming function. Defines the granularity of the zoom.
- **minSpan**: Restricts the minimum span size.
- **maxSpan**: Restricts the maximum span size.
- **panning**: Enables or disables panning.

{{"demo": "ZoomOptions.js", "hideToolbar": true, "bg": "playground"}}

## Zoom filtering

You can make the zoom of an axis affect one or more axes extremums by setting the `zoom.filterMode` prop on the axis config.

- If `zoom.filterMode` is set to `"discard"` the data points outside the visible range of this axis are filtered out and the other axes will modify their zoom range to fit the visible ones.
- If `zoom.filterMode` is set to `"keep"` (default) the data points outside the visible range are kept. Then, other axes will not be impacted.

See how the secondary axis adapts to the visible part of the primary axis in the following example.

{{"demo": "ZoomFilterMode.js"}}

## Zoom slider

You can provide an overview and allow the manipulation of the zoomed area by setting the `zoom.slider.enabled` property on the axis config.

{{"demo": "ZoomSlider.js"}}

You can set the `zoom.slider.size` property to customize the size reserved for the zoom slider.
This can be useful if you're using a custom zoom slider and want to update the space reserved for it.
If you're using the default zoom slider, updating `zoom.slider.size` effectively changes the padding around the slider.

The size is the height on an x-axis and the width on a y-axis.

### Tooltip

The zoom slider supports a tooltip that displays the current zoom range.

You can configure the tooltip by setting the `zoom.slider.showTooltip` property on the axis config. The following options are available:

- `true`: The tooltip is always displayed.
- `'hover'`: The tooltip is displayed on hover (default).
- `false`: The tooltip is never displayed.

#### Tooltip value formatting

The value shown in the tooltip can also be customized by using the `valueFormatter` property of the respective axis.

When formatting the zoom slider tooltip, the `valueFormatter` is called with `zoom-slider-tooltip` as its location.

{{"demo": "ZoomSliderTooltip.js"}}

### Limits

The zoom slider uses the same limits as the zooming options. You can set the `minStart`, `maxEnd`, `minSpan`, and `maxSpan` properties on the axis config to restrict the zoom slider range.

The zoom slider does not display values outside the range delimited by `minStart` and `maxEnd`.

### Composition

When using composition, you can render the axes' sliders by rendering the `ChartZoomSlider` component.

{{"demo": "ZoomSliderComposition.js"}}

## Preview

When the zoom slider is enabled, you can preview the zoomed area by enabling the `zoom.slider.preview` property on the axis config.

{{"demo": "ZoomSliderPreview.js"}}

### Scatter marker size

The size of the preview marker in scatter charts is 1px by default.
You can customize it by setting the `zoom.slider.preview.markerSize` property on the series configuration object.

{{"demo": "ZoomSliderPreviewCustomMarkerSize.js"}}

## Zoom management

### External zoom management

You can manage the zoom state by two means:

- By defining an initial state with the `initialZoom` prop.
- By imperatively setting a zoom value with the `setZoomData()` method of the public API.

In addition, the `onZoomChange` prop is a function that receives the new zoom state.

The `zoom` state is an array of objects that define the zoom state for each axis with zoom enabled.

- **axisId**: The id of the axis to control.
- **start**: The starting percentage of the axis range.
- **end**: The ending percentage of the zoom range.

{{"demo": "ExternalZoomManagement.js"}}

### Zoom synchronization

To synchronize zoom between multiple charts, you can control the zoom state.

{{"demo": "ZoomControlled.js"}}
