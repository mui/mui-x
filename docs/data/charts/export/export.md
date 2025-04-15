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
When exporting a chart, the `ChartsWrapper` element is considered the root element of the chart, and every descendant element is included in the export.

If you are using composition and are using a custom `ChartsWrapper` element, you need to use the `useChartRootRef` hook to get a reference to the root element of the chart so that export can work properly.

{{"demo": "ExportComposition.js"}}
