---
title: Charts - Export
productId: x-charts
components: ScatterChartPro, BarChartPro, LineChartPro, Heatmap, FunnelChart, RadarChartPro, SankeyChart, ChartsToolbarPremium, ChartsToolbarExcelExportTrigger
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
- `CandlestickChart`

Premium charts can also export the data behind the chart as a spreadsheet, covered in [Excel export](#excel-export).

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

### Stylesheets that fail to load

When a stylesheet, or a stylesheet it imports, fails to load in the export iframe, for example because a request fails or a [Content Security Policy](/x/react-charts/content-security-policy/) blocks it, the export continues.
The result may be missing some styles, and a warning is logged in development.
The image export still fails when the [Content Security Policy](/x/react-charts/content-security-policy/#csp-for-exporting-charts) blocks the styles it inlines, for example when the `nonce` option is missing.

To handle the failure yourself, use the `onStylesheetError` callback.
It receives the `<link>` element that failed to load, or whose import failed to load, and the reason: `'content-security-policy'` if the [Content Security Policy](/x/react-charts/content-security-policy/) blocked the stylesheet, or `'load-error'` if the request failed or a stylesheet it imports failed to load.
The callback's return value decides what happens next:

- Return or resolve to `false` to cancel the export.
- Throw an error or reject to make the export fail with that error.
- Return anything else to continue the export. The image export still fails if the Content Security Policy blocks the styles it inlines.

If the callback returns a promise, the export waits for it. This can be useful if you want to add replacement styles to `link.ownerDocument`.
See [Handling export errors](#handling-export-errors) for how a cancelled or failed export is reported.

When using the toolbar, you can provide `onStylesheetError` as an option using `slotProps`:

```tsx
<BarChartPro
  slotProps={{
    toolbar: {
      printOptions: {
        onStylesheetError: (link) => {
          showNotification(`The stylesheet ${link.href} failed to load.`);
          return false;
        },
      },
    },
  }}
/>
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

## Excel export [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

The exports above produce a picture of the chart.
Premium charts can also export the data behind it as an Excel file, so users can sort, filter and chart the numbers themselves.

### Enabling the export

The Excel export comes from the `useChartPremiumExport` plugin, which is not registered by default: a chart that leaves it out never loads the Excel code.
Add it to the `plugins` array of a [composed chart](/x/react-charts/composition/), after the plugins of the chart you are composing:

```tsx
import { BAR_CHART_PREMIUM_PLUGINS } from '@mui/x-charts-premium/BarChartPremium';
import { useChartPremiumExport } from '@mui/x-charts-premium/plugins';

// Outside the component: plugins contain hooks, so their order must not change.
const plugins = [...BAR_CHART_PREMIUM_PLUGINS, useChartPremiumExport];
```

With the plugin registered, `ChartsToolbarPremium` adds a **Download as Excel** entry to the export menu.
The entry is left out when the chart does not register the plugin, so the menu never offers an export that cannot run.

{{"demo": "ExportChartAsExcel.js"}}

:::info
The single-component charts, such as `BarChartPremium`, do not accept a `plugins` prop, so the Excel export is only available on composed charts.
See [Plugins](/x/react-charts/plugins/) for the full list of plugins and how to pass them.
:::

### Excel export options

Pass `excelExportOptions` to the toolbar to customize the file:

```tsx
<ChartsToolbarPremium
  excelExportOptions={{ fileName: 'revenue', includeHiddenSeries: false }}
/>
```

| Option                   | Default            | Description                                                                          |
| :----------------------- | :----------------- | :----------------------------------------------------------------------------------- |
| `fileName`               | the document title | Name of the file, without the extension.                                             |
| `includeHiddenSeries`    | `true`             | Export the series and items hidden through the legend.                               |
| `includeFormattedValues` | `false`            | Add a `formattedValue` column next to each value, using the series `valueFormatter`. |
| `escapeFormulas`         | `true`             | Escape text cells Excel would otherwise evaluate as formulas.                        |
| `includeHeaders`         | `true`             | Write a header row on each sheet.                                                    |
| `disableToolbarButton`   | `false`            | Remove the entry from the export menu.                                               |

:::warning
Keep `escapeFormulas` enabled unless you trust the data.
Disabling it exposes users to [CSV injection](https://owasp.org/www-community/attacks/CSV_Injection).
:::

### What the file contains

The export writes the chart's data, one row per data point, rather than the values as the axes display them.
Numbers stay numbers and dates stay dates, so Excel formats and sorts them natively.

Series are grouped by the columns they need, and each group becomes one sheet:

- Bar, line, radar and the radial series share a `series`, `category` and `value` shape, so they are written together on a single `category` sheet.
- Scatter carries its own coordinates, so it gets a `scatter` sheet with `x`, `y` and the optional `colorValue` and `sizeValue` channels.
- Pie, funnel, heatmap, range bar, candlestick and map series each get a sheet with the columns that shape needs, such as `open`, `high`, `low` and `close` for candlestick.
- Sankey describes a graph rather than a list of points, so it is written as two sheets, `sankey.nodes` and `sankey.links`.

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
apiRef.current?.exportAsImage({ pixelRatio: 3 }).catch((error) => {
  // Report the failed export.
});
```

### Export as Excel [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

Charts that register the [`useChartPremiumExport` plugin](#enabling-the-export) expose two more methods, which take the same [options](#excel-export-options) as the toolbar entry.

`exportAsExcel()` writes the file and downloads it:

```tsx
await apiRef.current?.exportAsExcel({ fileName: 'revenue' });
```

`getDataAsExcel()` returns the [ExcelJS](https://github.com/exceljs/exceljs) workbook instead of downloading it, which lets you add sheets, style cells or send the file somewhere else:

```tsx
const workbook = await apiRef.current?.getDataAsExcel();

if (workbook) {
  workbook.addWorksheet('Notes');
  const buffer = await workbook.xlsx.writeBuffer();
}
```

It resolves to `null` when the chart has no data to export, in which case `exportAsExcel()` downloads nothing.

### Handling export errors

`exportAsPrint()` and `exportAsImage()` return a promise that rejects when the export fails, for example when [`onStylesheetError`](#stylesheets-that-fail-to-load) throws or rejects.
`exportAsImage()` also rejects when a [Content Security Policy](/x/react-charts/content-security-policy/) blocks the styles copied to the export, while `exportAsPrint()` prints the chart without them.
Handle the rejection to report the failure to your users.
When the export is started from the toolbar, the error is logged to the console instead.

```tsx
try {
  await apiRef.current?.exportAsImage();
} catch (error) {
  // Report the failed export.
}
```

{{"demo": "ExportChartAsImage.js"}}

When `onStylesheetError` cancels the export by returning `false`, nothing is exported, no error is logged, and the promise resolves.
