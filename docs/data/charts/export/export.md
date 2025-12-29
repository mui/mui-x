---
title: Charts - Export
productId: x-charts
components: ScatterChartPro, BarChartPro, LineChartPro, Heatmap, FunnelChart, RadarChartPro, SankeyChart
---

# Charts - Export [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

<p class="description">Let users export a chart as an image or in PDF format.</p>

Charts can be exported using the browser's native print dialog or as an image.
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
By default, the exported media does not show the toolbar.
You can override the `onBeforeExport` callback to customize this behavior.
:::

{{"demo": "ExportChartToolbar.js"}}

### Custom toolbar

See [Toolbar—Composition](/x/react-charts/toolbar/#composition) for more information on how to create a custom toolbar.

## Image exporting

You must install the `rasterizehtml` npm dependency to enable image exporting.

Follow the [installation instructions](#image-export-pre-requisites).

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

Options can be passed to the built-in Toolbar with `slotProps.toolbar`.

Where relevant, the options are automatically shown in the toolbar. 
You can customize their respective behavior by passing an options object either to `slotsProps.toolbar` or to the Export trigger itself if you have a custom toolbar:

```tsx
// Default toolbar:
<BarChartPro slotProps={{ toolbar: { printOptions, imageExportOptions } }} />

// Custom trigger:
<ChartsToolbarImageExportTrigger options={imageExportOptions} />
<ChartsToolbarPrintExportTrigger options={printExportOptions} />
```

### Export formats

Using the export options, you can customize the available export formats.

The print export can be disabled by setting the `disableToolbarButton` property to `true`.

Image export formats can be customized by providing an array of objects to the `imageExportOptions` property. 
These objects must contain the `type` property, which specifies the image format.

:::info
If the browser does not support a requested image format, the export defaults to PNG.
:::

In the example below, you can toggle which export formats are available to the user.
Additionally, the name of the exported file has been customized to resemble the chart's title.

{{"demo": "ExportChartToolbarCustomization.js"}}

### `onBeforeExport`

To add custom styles or modify the chart's appearance before exporting, use the `onBeforeExport` callback.

When exporting, the chart is rendered onto an iframe and then exported as an image or PDF.
The `onBeforeExport` callback gives you access to the iframe before the export process starts.

For example, you can add the title and caption to the exported chart, as shown below:

{{"demo": "ExportChartOnBeforeExport.js"}}

:::info
If you don't want to manually add elements to the chart export, you can create a chart through composition and include the elements you want to export as part of the chart.
See the [Composition](#composition) section below for more information.
:::

## Copy styles

The styles of the page the chart belongs to are copied to the export iframe by default.
You can disable this behavior by setting the `copyStyles` property to `false` in the export options.

```tsx
<BarChartPro slotProps={{ toolbar: { printOptions: { copyStyles: false } } }} />
```

## Composition

As detailed in [Composition](/x/react-charts/composition/), charts can alternatively be composed of more specific components to create custom visualizations.

When exporting a chart, the `ChartsWrapper` element is considered the root element of the chart, and every descendant is included in the export.
As such, you need to ensure that the `ChartsWrapper` element is the root element of the chart you want to export.

If you want to use a custom wrapper element, you need to use the `useChartRootRef()` hook to set the reference to the chart's root element so that exporting works properly, as shown below.

{{"demo": "ExportCompositionNoSnap.js"}}

## Content Security Policy (CSP)

If your application uses a Content Security Policy (CSP), you might need to adjust it for exporting to work correctly.
You can read more about it in the [Content Security Policy (CSP) guide](/x/react-charts/content-security-policy/).

## apiRef

### Print or export as PDF

The `apiRef` prop exposes a `exportAsPrint()` method that can be used to open the browser's print dialog.

The print dialog lets you print the chart or save it as a PDF, as well as configuring other settings.

{{"demo": "PrintChart.js"}}

### Export as image

The `apiRef` prop also exposes a `exportAsImage()` method to export the chart as an image.

#### Usage

The function accepts an options object with the `type` property, which specifies the image format. The available formats are:

- `image/png` and `image/jpeg`, which are supported across all [supported platforms](/material-ui/getting-started/supported-platforms/)
- `image/webp` which is only supported in some browsers

If the format is not supported by the browser, `exportAsImage()` falls back to `image/png`.

Additionally, for lossy formats such as `image/jpeg` and `image/webp`, the options object also accepts the `quality` property, which is a number between 0 and 1.
The default value is 0.9.

{{"demo": "ExportChartAsImage.js"}}
