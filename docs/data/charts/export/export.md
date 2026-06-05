---
title: Charts - Export
productId: x-charts
components: ScatterChartPro, BarChartPro, LineChartPro, Heatmap, FunnelChart, RadarChartPro, SankeyChart, ChartsToolbarSvgExportTrigger
---

# Charts - Export [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

<p class="description">Let users export a chart as an image or in PDF format.</p>

Charts can be exported as images, as SVG files, or as PDFs using the browser's native print dialog.
The exporting feature is available for the following charts:

- `LineChartPro`
- `BarChartPro`
- `ScatterChartPro`
- `PieChartPro`
- `Heatmap`
- `FunnelChart`
- `RadarChartPro`
- `SankeyChart`
- `CandlestickChart`

## Implementing exporting

### Default toolbar

To enable exporting from the chart's toolbar, pass the `showToolbar` prop to the chart component.
The toolbar then renders a button that opens a menu with the export options.

:::info
By default, the toolbar is not displayed on exported media.
You can override the `onBeforeExport` callback to change this behavior.
:::

{{"demo": "ExportChartToolbar.js"}}

### Custom toolbar

See the [Toolbar documentation](/x/react-charts/toolbar/#fully-custom-toolbar) for more information on how to create a custom toolbar.

## Image exporting

You must install `rasterizehtml` to enable image exporting:

<codeblock storageKey="package-manager">

```bash npm
npm install rasterizehtml
```

```bash pnpm
pnpm add rasterizehtml
```

```bash yarn
yarn add rasterizehtml
```

</codeblock>

## Export options

Export behavior can be modified with [print](/x/api/charts/chart-print-export-options/), [image export](/x/api/charts/chart-image-export-options/), and [SVG export](/x/api/charts/chart-svg-export-options/) options.
These options can be passed to the built-in toolbar using `slotProps.toolbar`, and are then automatically displayed.

You can customize their respective behaviors by passing an options object to `slotProps.toolbar`, or to the export trigger itself if you're using a custom toolbar:

```tsx
// Default toolbar:
<BarChartPro slotProps={{ toolbar: { printOptions, imageExportOptions, svgExportOptions } }} />

// Custom trigger:
<ChartsToolbarImageExportTrigger options={imageExportOptions} />
<ChartsToolbarPrintExportTrigger options={printExportOptions} />
<ChartsToolbarSvgExportTrigger options={svgExportOptions} />
```

### Export formats

To disable the print export, set the `disableToolbarButton` property to `true` on `printOptions`.
The SVG export can be disabled the same way through `svgExportOptions`.

You can customize image export formats by providing an array of objects to the `imageExportOptions` property.
These objects must contain the `type` property which specifies the image format.

:::info
If the browser does not support a requested image format, the export defaults to PNG.
:::

In the example below, you can toggle which export formats are available to the user.
The name of the exported file has been customized to resemble the chart's title.

{{"demo": "ExportChartToolbarCustomization.js"}}

### Add custom styles before exporting

To add custom styles or modify the chart's appearance before exporting, use the `onBeforeExport` callback.

For image and PDF export, the chart is first rendered into an iframe, so `onBeforeExport` receives that iframe before the export process starts.
SVG export has no iframe, so its `onBeforeExport` receives the `<svg>` element to be exported instead.

For example, you can add the title and caption to the exported chart as shown below:

{{"demo": "ExportChartOnBeforeExport.js"}}

:::info
If you don't want to manually add elements to the chart export, you can create a chart through composition and include the elements you want to export as part of the chart.
See [Exporting composed charts](#exporting-composed-charts) below for more information.
:::

### Hide elements from export

Mark any element with the `data-hide-on-export` attribute to exclude it from image and print exports.
The attribute works on any HTML or SVG element in the chart tree.

{{"demo": "ExportChartHideOnExport.js"}}

To hide an internal MUI X Charts component (such as the legend) that you do not render directly, forward the attribute through `slotProps`:

```tsx
<BarChartPro slotProps={{ legend: { 'data-hide-on-export': true } as any }} />
```

## Copy styles

The styles of the page the chart belongs to are copied to the export iframe by default.
You can disable this behavior by setting the `copyStyles` property to `false` in the export options.

```tsx
<BarChartPro slotProps={{ toolbar: { printOptions: { copyStyles: false } } }} />
```

## Exporting composed charts

MUI X Charts may be [self-contained](/x/react-charts/quickstart/#self-contained-charts) or [composed of various subcomponents](/x/react-charts/quickstart/#composable-charts).
See [Composition](/x/react-charts/composition/) for more details on implementing the latter type.

`ChartsWrapper` is considered the root element of a chart for exporting purposes, and all descendants are included in the export.

To use a custom wrapper instead, you must set the reference to the root element with the `useChartRootRef()` hook as shown below:

{{"demo": "ExportCompositionNoSnap.js"}}

## Content Security Policy (CSP)

If your application uses a Content Security Policy (CSP), you might need to adjust it for exporting to work correctly.
See [the dedicated document on CSP](/x/react-charts/content-security-policy/) for more details.

## apiRef

### Print or export as PDF

The `apiRef` prop exposes the `exportAsPrint()` method that can be used to open the browser's print dialog.
The print dialog lets you print the chart or save it as a PDF, as well as configure other settings.

{{"demo": "PrintChart.js"}}

### Export as image

The `apiRef` prop also exposes the `exportAsImage()` method to export the chart as an image.
The function accepts an options object with the `type` property which specifies the image format.
The available formats are:

- `image/png` and `image/jpeg` which can both be used across all [supported platforms](/material-ui/getting-started/supported-platforms/)
- `image/webp` which is only supported in some browsers

If the format is not supported by the browser, `exportAsImage()` falls back to `image/png`.

For lossy formats such as `image/jpeg` and `image/webp`, the options object accepts the `quality` property which sets a numerical value between 0 and 1.
The default is 0.9.

You can also pass a `pixelRatio` to control the scale at which the chart is rasterized.
Higher values produce sharper images at the cost of a larger file size.
When omitted, the export uses the larger of `window.devicePixelRatio` and `2`, guaranteeing a minimum 2x resolution on standard-DPI displays without regressing higher-DPI exports.

```tsx
apiRef.current?.exportAsImage({ pixelRatio: 3 });
```

{{"demo": "ExportChartAsImage.js"}}

### Export as SVG

The `apiRef` prop also exposes the `exportAsSvg()` method to export the chart as a standalone SVG file.
Unlike image export, this requires no extra dependency.

The output is vector-based, so it stays crisp at any size and remains editable in design tools such as Figma.
Series rendered to a canvas (for example, the WebGL renderer) cannot be vectorized and are embedded as a raster image inside the SVG, while the rest of the chart (axes, labels, legend) stays vector.

```tsx
apiRef.current?.exportAsSvg({ fileName: 'my-chart' });
```

{{"demo": "ExportChartAsSvg.js"}}

:::warning
Styles served from a cross-origin stylesheet cannot be read for security reasons and are omitted from the exported SVG, the same way they are for image export.
:::
