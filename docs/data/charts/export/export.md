---
title: Charts - Export
productId: x-charts
components: ScatterChartPro, BarChartPro, LineChartPro, Heatmap, FunnelChart, RadarChartPro, SankeyChart
---

# Charts - Export [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

<p class="description">Let users export a chart as an image or in PDF format.</p>

Charts can be exported as images, or as PDFs using the browser's native print dialog.
The exporting feature is available for the following charts:

- `LineChartPro`
- `BarChartPro`
- `ScatterChartPro`
- `PieChartPro`
- `Heatmap`
- `FunnelChart`
- `RadarChartPro`
- `SankeyChart`

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

Export behavior can be modified with [print](/x/api/charts/chart-print-export-options/) and [image export](/x/api/charts/chart-image-export-options/) options.
These options can be passed to the built-in toolbar using `slotProps.toolbar`, and are then automatically displayed.

You can customize their respective behaviors by passing an options object to `slotProps.toolbar`, or to the export trigger itself if you're using a custom toolbar:

```tsx
// Default toolbar:
<BarChartPro slotProps={{ toolbar: { printOptions, imageExportOptions } }} />

// Custom trigger:
<ChartsToolbarImageExportTrigger options={imageExportOptions} />
<ChartsToolbarPrintExportTrigger options={printExportOptions} />
```

### Export formats

To disable the print export, set the `disableToolbarButton` property to `true`.

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

When exporting, the chart is first rendered into an iframe and then exported as an image or PDF.
The `onBeforeExport` callback gives you access to the iframe before the export process starts.

For example, you can add the title and caption to the exported chart as shown below:

{{"demo": "ExportChartOnBeforeExport.js"}}

:::info
If you don't want to manually add elements to the chart export, you can create a chart through composition and include the elements you want to export as part of the chart.
See [Exporting composed charts](#exporting-composed-charts) below for more information.
:::

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

{{"demo": "ExportChartAsImage.js"}}
