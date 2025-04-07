---
title: Charts - Export
productId: x-charts
components: ScatterChartPro, BarChartPro, LineChartPro
---

# Charts - Export [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

<p class="description">Charts can be printed and exported as PDF.</p>

Export is available on the **Pro**[<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan') versions of the charts: `<LineChartPro />`, `<BarChartPro />`, `<ScatterChartPro />`.

## Print/Export as PDF

The `apiRef` prop exposes a `exportAsPrint` method that can be used to open the browser's print dialog.

The print dialog allows you to print the chart or save it as a PDF, as well as configuring other settings.

{{"demo": "PrintChart.js"}}

## Export as image

The `apiRef` prop also exposes a `exportAsImage` function that can be used to export the chart as an image.

The function accepts an options object with the `type` property, which specifies the image format. The available formats are:

- `image/png` and `image/jpeg`, which are supported across all [supported platforms](/material-ui/getting-started/supported-platforms/);
- `image/webp` which is only supported in some browsers.

If you provide a format that your browser does not support, `exportAsImage` will fall back to `image/png`.

Additionally, for lossy formats such as `image/jpeg` and `image/webp`, the options object also accepts the `quality` property, which is a number between 0 and 1.
The default value is 0.9.

{{"demo": "ExportChartAsImage.js"}}

## Composition

As detailed in the [Composition](/x/react-charts/composition/) section, charts can alternatively be composed of more specific components to create custom visualizations.

When exporting a chart, the `ChartsWrapper` element is considered the root element of the chart, and every descendant is included in the export.
As such, you need to ensure that the `ChartsWrapper` element is the root element of the chart you want to export.

If you want to use a custom wrapper element, you need to use the `useChartRootRef` hook to set the reference to the chart's root element so that exporting works properly, as exemplified below.

{{"demo": "ExportCompositionNoSnap.js"}}
