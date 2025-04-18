---
title: Charts - Export
productId: x-charts
components: ScatterChartPro, BarChartPro, LineChartPro
---

# Charts - Export [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

<p class="description">Charts can be printed and exported as PDF.</p>

Export is available on the **Pro**[<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan') versions of the charts: `<LineChartPro />`, `<BarChartPro />`, `<ScatterChartPro />`.

## Print/Export as PDF

The `apiRef` prop on exposes a `print` method that can be used to open the browser's print dialog.

The print dialog allows you to print the chart or save it as a PDF, as well as configuring other settings.

{{"demo": "PrintChart.js"}}

## Composition

As detailed in the [Composition](/x/react-charts/composition/) section, charts alternatively be composed of more focused components.

When exporting a chart, the `ChartsWrapper` element is considered the root element of the chart, and every descendant is included in the export.
As such, you need to ensure that the `ChartsWrapper` element is the root element of the chart you want to export.

If you want to use a custom wrapper element, you need to use the `useChartRootRef` hook to set the reference to the chart's root element so that exporting works properly, as exemplified below.

{{"demo": "ExportCompositionNoSnap.js"}}
