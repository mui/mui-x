---
title: Charts - Export
productId: x-charts
components: ScatterChartPro, BarChartPro, LineChartPro, Heatmap, FunnelChart, RadarChartPro
---

# Charts - Export [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

<p class="description">Charts can be printed and exported as a PDF or an image.</p>

Export is available for the following charts: `<LineChartPro />`, `<BarChartPro />`, `<ScatterChartPro />`, `PieChartPro />`, `<Heatmap />`, `<FunnelChart />` and `<RadarChartPro />`.

## Enabling export

### Default toolbar

Charts can be exported using the browser's native print dialog or as an image.

To enable this functionality, you need to enable the chart's toolbar by passing the `showToolbar` prop to the chart component.

The toolbar then renders a button that opens a menu with the export options.

{{"demo": "ExportChartToolbar.js"}}

:::warning
Image export requires the `rasterizehtml` npm dependency to be installed in your project.

Follow the installation instructions [here](#image-export-pre-requisites).
:::

### Custom toolbar

See the [Toolbar composition](/x/react-charts/toolbar/#composition) section for more information on how to create a custom toolbar.

## Image export pre-requisites

For image export to work, you need to add the `rasterizehtml` npm dependency in your project.

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

The following export options are available:

- [Print](/x/react-charts/export/#print-options)
- [Export as image](/x/react-charts/export/#image-export-options)

Where relevant, the options are automatically shown in the toolbar. You can customize their respective behavior by passing an options object either to `slotsProps.toolbar` or to the Export trigger itself if you have a custom toolbar:

```tsx
// Default toolbar:
<BarChartPro slotProps={{ toolbar: { imageExportOptions } }} />

// Custom trigger:
<ChartsToolbarImageExportTrigger options={imageExportOptions} />
```

Each export option has its own API page:

- [Print options](/x/api/charts/chart-print-export-options/)
- [Image export options](/x/api/charts/chart-image-export-options/)

### Customization

In the example below, you can toggle which export formats are available to the user.

Additionally, the name of the exported file has been customized to resemble the chart's title.

{{"demo": "ExportChartToolbarCustomization.js"}}

:::info
Bear in mind that adding image formats that are not supported by the browser will result in the export defaulting to PNG.
:::

## Composition

As detailed in the [Composition](/x/react-charts/composition/) section, charts can alternatively be composed of more specific components to create custom visualizations.

When exporting a chart, the `ChartsWrapper` element is considered the root element of the chart, and every descendant is included in the export.
As such, you need to ensure that the `ChartsWrapper` element is the root element of the chart you want to export.

If you want to use a custom wrapper element, you need to use the `useChartRootRef()` hook to set the reference to the chart's root element so that exporting works properly, as exemplified below.

{{"demo": "ExportCompositionNoSnap.js"}}

## apiRef

### Print/Export as PDF

The `apiRef` prop exposes a `exportAsPrint()` method that can be used to open the browser's print dialog.

The print dialog allows you to print the chart or save it as a PDF, as well as configuring other settings.

{{"demo": "PrintChart.js"}}

### Export as image

The `apiRef` prop also exposes a `exportAsImage()` method to export the chart as an image.

:::warning
Image export requires the `rasterizehtml` npm dependency to be installed in your project.

Follow the installation instructions [here](#image-export-pre-requisites).
:::

#### Usage

The function accepts an options object with the `type` property, which specifies the image format. The available formats are:

- `image/png` and `image/jpeg`, which are supported across all [supported platforms](/material-ui/getting-started/supported-platforms/);
- `image/webp` which is only supported in some browsers.

If the format is not supported by the browser, `exportAsImage()` falls back to `image/png`.

Additionally, for lossy formats such as `image/jpeg` and `image/webp`, the options object also accepts the `quality` property, which is a number between 0 and 1.
The default value is 0.9.

{{"demo": "ExportChartAsImage.js"}}
