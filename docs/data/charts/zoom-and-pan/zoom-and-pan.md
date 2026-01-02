---
title: Charts - Zoom and pan
productId: x-charts
components: ScatterChartPro, BarChartPro, LineChartPro, ChartZoomSlider, ChartsBrushOverlay
---

# Charts - Zoom and pan [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

<p class="description">Enables zooming and panning on specific charts or axis.</p>

Zooming is possible on the Pro and Premium versions of line, bar, scatter, and heatmap charts.

## Basic usage

To enable zooming and panning, set the `zoom` prop to `true` on the wanted axis.

Enabling zoom will enable all the interactions, which are made to be as intuitive as possible.

The following actions are enabled by default:

- **Scroll**: Zoom in/out by scrolling the mouse wheel.
- **Drag**: Pan the chart by dragging the mouse.
- **Pinch**: Zoom in/out by pinching the chart.

Additional zoom interactions can be enabled through configuration:

- **Tap and drag**: Zoom in/out by tapping twice and then dragging vertically.

:::warning
Enabling zoom adds `touch-action: pan-y` to allow panning on touch devices. This interferes with other touch interactions, such as scrolling horizontally.

If you want to customize the touch-action behavior, you can override it by targeting the `.MuiChartsSurface-root` class in your CSS.
:::

{{"demo": "ZoomScatterChart.js"}}
{{"demo": "ZoomBarChart.js"}}
{{"demo": "ZoomLineChart.js"}}
{{"demo": "ZoomHeatmap.js"}}

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

You can provide an overview that lets users manipulate the zoomed area by setting the `zoom.slider.enabled` property on the axis config.

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

## Zoom interactions configuration

You can have fine-grained control over which interactions are enabled and under which conditions by using the `zoomInteractionConfig` prop.

### Interactions

The `zoomInteractionConfig` prop allows you to specify which interactions are enabled for zooming and panning:

```jsx
<BarChartPro
  zoomInteractionConfig={{
    // Enable wheel, pinch, and tap-and-drag zoom
    zoom: ['wheel', 'pinch', 'tapAndDrag'],
    // Enable drag panning
    pan: ['drag'],
  }}
/>
```

**Zoom** interactions:

- `wheel` (default): Zoom in/out by scrolling the mouse wheel
- `pinch` (default): Zoom in/out by pinching on touch devices
- `tapAndDrag`: Zoom in/out by tapping twice and then dragging vertically. Dragging up zooms in, dragging down zooms out.
- `brush`: Zoom into a selected area by clicking and dragging to create a selection rectangle.
- `doubleTapReset`: Reset the zoom level to the original state when double-tapping.

**Pan** interactions:

- `wheel` (default\*): Pan the chart by scrolling the mouse wheel. On a desktop trackpad, it enables pan using two fingers. Only pans the horizontal axis by default. Use `allowedDirection` to customize which axes are affected.
- `drag` (default): Pan the chart by dragging with the mouse or touch
- `pressAndDrag`: Pan the chart by pressing and holding, then dragging. Useful for avoiding conflicts with selection gestures.

:::warning

\* The `wheel` pan interaction is only added automatically if pan is enabled for at least one of the x-axis and none of the y-axis.
:::

:::info
When modifying the zoom interaction configuration, care should be taken as to not create a bad user experience.

For example, the "drag" and "brush" interactions do not work well together.

If both are needed, the `pointerMode` and `requiredKeys` options described in the next sections can help.

:::

{{"demo": "ZoomAndPanInteractions.js"}}

### Brush zoom

The brush zoom interaction allows users to select a specific area to zoom into by clicking and dragging to create a selection rectangle.
This provides an intuitive way to focus on a particular region of interest in the chart.

{{"demo": "BrushZoom.js"}}

### Key modifiers

Some interactions allow setting up required keys to be pressed to enable the interaction.
This can be set up using the `requiredKeys` property in the interaction configuration.

```jsx
<BarChartPro
  zoomInteractionConfig={{
    // Only zoom when Control key is pressed
    zoom: [{ type: 'wheel', requiredKeys: ['Control'] }],
    // Only pan when Shift key is pressed
    pan: [{ type: 'drag', requiredKeys: ['Shift'] }],
  }}
/>
```

Available keys include:

- Modifier keys: `'Shift'`, `'Control'`, `'Alt'`, `'Meta'`
- `'ControlOrMeta'` which resolves to `Control` on Windows and Linux and to `Meta` on macOS.
- Any other key can be used as well, such as `'Space'` and `'Enter'` based on [`event.key` values](https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values).

It is also possible to require multiple keys to be pressed simultaneously:

```jsx
<BarChartPro
  zoomInteractionConfig={{
    // Only pan when both Shift and Control are pressed
    pan: [{ type: 'drag', requiredKeys: ['Shift', 'Control'] }],
  }}
/>
```

### Pointer Modes

Interactions can also be restricted to specific pointer types by using the `mode` property:

```jsx
<BarChartPro
  zoomInteractionConfig={{
    // Only pan with touch, not mouse
    pan: [{ type: 'drag', pointerMode: 'touch' }],
  }}
  // other props
/>
```

Available pointer modes:

- `undefined`: Allow both mouse and touch interactions (default)
- `'mouse'`: Only allow mouse interactions
- `'touch'`: Only allow touch interactions

### Multiple interactions of the same type

It is possible to define multiple interactions of the same type with different configurations.

In the example below, the pan `drag` interaction is configured to require a specific key combination for mouse, while touch interactions don't require any key to be pressed:

```jsx
<BarChartPro
  zoomInteractionConfig={{
    pan: [
      { type: 'drag', pointerMode: 'mouse', requiredKeys: ['ControlOrMeta'] },
      { type: 'drag', pointerMode: 'touch', requiredKeys: [] },
    ],
  }}
  // other props
/>
```
