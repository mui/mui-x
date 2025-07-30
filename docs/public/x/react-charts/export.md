---
title: Charts - Export
productId: x-charts
components: ScatterChartPro, BarChartPro, LineChartPro, Heatmap, FunnelChart, RadarChartPro
---

# Charts - Export [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

Export charts as a PDF from the print dialog, or as an image.

Export is available for the following charts: `<LineChartPro />`, `<BarChartPro />`, `<ScatterChartPro />`, `PieChartPro />`, `<Heatmap />`, `<FunnelChart />` and `<RadarChartPro />`.

## Enabling export

Charts can be exported using the browser's native print dialog or as an image.

### Default toolbar

To enable exporting from the chart's toolbar, you need to enable it by passing the `showToolbar` prop to the chart component.

The toolbar then renders a button that opens a menu with the export options.

:::info
By default, the exported media does not show the toolbar.

You can override the `onBeforeExport` callback to customize this behavior.
:::

```tsx
import * as React from 'react';
import { LineChartPro } from '@mui/x-charts-pro/LineChartPro';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { inflationData } from '../dataset/inflationRates';

const yAxisFormatter = new Intl.NumberFormat('en-US', {
  style: 'percent',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
  maximumSignificantDigits: 1,
});
const percentageFormatter = new Intl.NumberFormat('en-US', {
  style: 'percent',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const seriesValueFormatter = (value: number | null) =>
  percentageFormatter.format(value! / 100);

const xAxis = [
  {
    data: inflationData.map((p) => p.year),
    valueFormatter: (value: number) => `${value}`,
    zoom: true,
  },
];

const yAxis = [
  { valueFormatter: (value: number) => yAxisFormatter.format(value / 100) },
];

const series = [
  {
    label: 'Germany',
    data: inflationData.map((p) => p.rateDE),
    valueFormatter: seriesValueFormatter,
    showMark: false,
  },
  {
    label: 'United Kingdom',
    data: inflationData.map((p) => p.rateUK),
    valueFormatter: seriesValueFormatter,
    showMark: false,
  },
  {
    label: 'France',
    data: inflationData.map((p) => p.rateFR),
    valueFormatter: seriesValueFormatter,
    showMark: false,
  },
];

const settings = {
  height: 300,
  xAxis,
  yAxis,
  series,
  grid: { horizontal: true },
};

export default function ExportChartToolbar() {
  return (
    <Stack width="100%">
      <Typography sx={{ alignSelf: 'center', my: 1 }}>
        Inflation rate in France, Germany and the UK, 1960-2024
      </Typography>
      <LineChartPro {...settings} showToolbar />
      <Typography variant="caption">Source: World Bank</Typography>
    </Stack>
  );
}

```

:::warning
Image export requires the `rasterizehtml` npm dependency to be installed in your project.

Follow the [installation instructions](#image-export-pre-requisites).
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

Export behavior can be modified with [print](/x/api/charts/chart-print-export-options/) and [image export](/x/api/charts/chart-image-export-options/) options.

Options can be passed to the built-in Toolbar with `slotProps.toolbar`.

Where relevant, the options are automatically shown in the toolbar. You can customize their respective behavior by passing an options object either to `slotsProps.toolbar` or to the Export trigger itself if you have a custom toolbar:

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

The image export formats can be customized by providing an array of objects to the `imageExportOptions` property. These objects must contain the `type` property, which specifies the image format.

:::info
If the browser does not support a requested image format, the export defaults to PNG.
:::

In the example below, you can toggle which export formats are available to the user.

Additionally, the name of the exported file has been customized to resemble the chart's title.

```tsx
import * as React from 'react';
import { ChartProApi } from '@mui/x-charts-pro/context';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { HighlightedCode } from '@mui/docs/HighlightedCode';
import { ScatterChartPro } from '@mui/x-charts-pro/ScatterChartPro';
import { ScatterValueType } from '@mui/x-charts/models';
import { continents, countryData } from '../dataset/countryData';
import { populationGdpPerCapitaData } from './populationGdpPerCapitaData';
import ExportOptionSelector from './ExportOptionSelector';

const populationFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
});
const gdpPerCapitaFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
});

const series = continents.map(
  (continent) =>
    ({
      label: continent,
      data: populationGdpPerCapitaData[continent].map((p) => ({
        x: p.population,
        y: p.gdpPerCapita,
        id: countryData[p.code].country,
      })),
      valueFormatter: (value: ScatterValueType | null) =>
        `${value!.id}: ${populationFormatter.format(value!.x)} people, ${gdpPerCapitaFormatter.format(value!.y)} GDP per capita`,
      highlightScope: {
        highlight: 'item',
        fade: 'global',
      },
    }) as const,
);

const fileName = 'Population_vs_GDP_Per_Capita_USD_2019';

export default function ExportChartToolbarCustomization() {
  const apiRef = React.useRef<ChartProApi>(undefined);
  const [formats, setFormats] = React.useState({
    print: true,
    'image/png': true,
    'image/jpeg': false,
    'image/webp': false,
  });

  const imageExportOptions = Object.entries(formats)
    .filter(([key, value]) => key.startsWith('image/') && value)
    .map(([key]) => ({ type: key, fileName }));

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormats((prev) => ({
      ...prev,
      [event.target.name]: event.target.checked,
    }));
  };

  return (
    <Stack width="100%">
      <Typography sx={{ alignSelf: 'center', my: 1 }}>
        Population vs GDP Per Capita (USD), 2019
      </Typography>
      <ScatterChartPro
        apiRef={apiRef}
        height={300}
        margin={{ bottom: 2 }}
        xAxis={[
          {
            scaleType: 'log',
            valueFormatter: (value: number, context) => {
              if (context.location === 'tick' && context.defaultTickLabel === '') {
                return '';
              }

              return populationFormatter.format(value);
            },
            zoom: true,
            label: 'Population',
          },
        ]}
        series={series}
        yAxis={[
          {
            scaleType: 'log',
            valueFormatter: (value: number) => gdpPerCapitaFormatter.format(value),
            label: 'GDP per Capita',
          },
        ]}
        showToolbar
        grid={{ horizontal: true }}
        slotProps={{
          toolbar: {
            printOptions: { disableToolbarButton: !formats.print, fileName },
            imageExportOptions,
          },
        }}
      />
      <Typography variant="caption" textAlign="end" marginBottom={2}>
        Source: World Bank
      </Typography>
      <Stack direction={{ xs: 'column', md: 'row-reverse' }} spacing={2}>
        <ExportOptionSelector formats={formats} handleChange={handleChange} />
        <HighlightedCode
          sx={{ minWidth: 0, flexGrow: 1, '& pre': { margin: 0 } }}
          code={`const filename = '${fileName}';
          
<ScatterChartPro
  // ...
  slotProps={{
    toolbar: {
      printOptions: ${formats.print ? `{ fileName }` : `{ disableToolbarButton: true }`},
      imageExportOptions: ${
        imageExportOptions.length === 0
          ? '[]'
          : `[
        ${imageExportOptions
          .map(
            (option) =>
              `{ ${Object.entries(option)
                .map(([key, value]) => {
                  if (key === 'fileName') {
                    return 'filename';
                  }
                  return `${key}: ${JSON.stringify(value)}`;
                })
                .join(' , ')} }`,
          )
          .join(',\n        ')}
      ]`
      }
    },
  }}
/>`}
          language="jsx"
          copyButtonHidden
        />
      </Stack>
    </Stack>
  );
}

```

### `onBeforeExport`

To add custom styles or modify the chart's appearance before exporting, use the `onBeforeExport` callback.

When exporting, the chart is rendered onto an iframe and then exported as an image or PDF.
The `onBeforeExport` callback gives you access to the iframe before the export process starts.

For example, you can hide the toolbar and only show the legend when exporting the chart, as shown below:

```tsx
import * as React from 'react';
import { LineChartPro } from '@mui/x-charts-pro/LineChartPro';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { legendClasses } from '@mui/x-charts/ChartsLegend';
import { defaultOnBeforeExport } from '@mui/x-charts-pro/models';
import { inflationData } from '../dataset/inflationRates';

const yAxisFormatter = new Intl.NumberFormat('en-US', {
  style: 'percent',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
  maximumSignificantDigits: 1,
});
const percentageFormatter = new Intl.NumberFormat('en-US', {
  style: 'percent',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const seriesValueFormatter = (value: number | null) =>
  percentageFormatter.format(value! / 100);

const xAxis = [
  {
    data: inflationData.map((p) => p.year),
    valueFormatter: (value: number) => `${value}`,
    zoom: true,
  },
];

const yAxis = [
  { valueFormatter: (value: number) => yAxisFormatter.format(value / 100) },
];

const series = [
  {
    label: 'Germany',
    data: inflationData.map((p) => p.rateDE),
    valueFormatter: seriesValueFormatter,
    showMark: false,
  },
  {
    label: 'United Kingdom',
    data: inflationData.map((p) => p.rateUK),
    valueFormatter: seriesValueFormatter,
    showMark: false,
  },
  {
    label: 'France',
    data: inflationData.map((p) => p.rateFR),
    valueFormatter: seriesValueFormatter,
    showMark: false,
  },
];

const settings = {
  height: 300,
  xAxis,
  yAxis,
  series,
  grid: { horizontal: true },
};

function onBeforeExport(iframe: HTMLIFrameElement) {
  // Apply default modification (removing the toolbar)
  defaultOnBeforeExport(iframe);
  const document = iframe.contentDocument!;

  // Show legend
  const legend = document.querySelector(
    `.${legendClasses.root}`,
  ) as HTMLElement | null;

  if (legend) {
    legend.style.display = 'flex';
  }
}

export default function ExportChartOnBeforeExport() {
  return (
    <Stack width="100%">
      <Typography sx={{ alignSelf: 'center', my: 1 }}>
        Inflation rate in France, Germany and the UK, 1960-2024
      </Typography>
      <LineChartPro
        {...settings}
        showToolbar
        slotProps={{
          toolbar: {
            printOptions: { onBeforeExport },
            imageExportOptions: [{ type: 'image/png', onBeforeExport }],
          },
        }}
        sx={{ [`& .${legendClasses.root}`]: { display: 'none' } }}
      />
      <Typography variant="caption">Source: World Bank</Typography>
    </Stack>
  );
}

```

## Copy styles

The styles of the page the chart belongs to are copied to the export iframe by default.

You can disable this behavior by setting the `copyStyles` property to `false` in the export options.

```tsx
<BarChartPro slotProps={{ toolbar: { printOptions: { copyStyles: false } } }} />
```

## Composition

As detailed in the [Composition](/x/react-charts/composition/) section, charts can alternatively be composed of more specific components to create custom visualizations.

When exporting a chart, the `ChartsWrapper` element is considered the root element of the chart, and every descendant is included in the export.
As such, you need to ensure that the `ChartsWrapper` element is the root element of the chart you want to export.

If you want to use a custom wrapper element, you need to use the `useChartRootRef()` hook to set the reference to the chart's root element so that exporting works properly, as exemplified below.

```tsx
import * as React from 'react';
import { BarPlot } from '@mui/x-charts/BarChart';
import { LinePlot, MarkPlot } from '@mui/x-charts/LineChart';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { useChartRootRef } from '@mui/x-charts/hooks';
import Button from '@mui/material/Button';
import { Stack } from '@mui/system';
import { ChartDataProviderPro } from '@mui/x-charts-pro/ChartDataProviderPro';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { ChartsLegend } from '@mui/x-charts/ChartsLegend';
import { useChartProApiRef } from '@mui/x-charts-pro/hooks';

function CustomChartWrapper({ children }: React.PropsWithChildren) {
  const chartRootRef = useChartRootRef();

  return (
    <div
      ref={chartRootRef}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      {children}
    </div>
  );
}

export default function ExportCompositionNoSnap() {
  const apiRef = useChartProApiRef<'composition'>();

  return (
    <Stack width="100%" sx={{ display: 'block' }}>
      <Button
        onClick={() => apiRef.current!.exportAsPrint()}
        variant="contained"
        sx={{ mb: 1 }}
      >
        Print
      </Button>
      <ChartDataProviderPro
        apiRef={apiRef}
        height={300}
        series={[
          {
            type: 'bar',
            data: [1, 2, 3, 2, 1],
            label: 'Bar',
          },
          {
            type: 'line',
            data: [4, 3, 1, 3, 4],
            label: 'Line',
          },
        ]}
        xAxis={[
          {
            data: ['A', 'B', 'C', 'D', 'E'],
            scaleType: 'band',
            id: 'x-axis-id',
            height: 24,
          },
        ]}
        yAxis={[{ width: 20 }]}
      >
        <CustomChartWrapper>
          <ChartsLegend direction="horizontal" />
          <ChartsSurface>
            <BarPlot />
            <LinePlot />
            <MarkPlot />
            <ChartsXAxis axisId="x-axis-id" />
            <ChartsYAxis />
          </ChartsSurface>
        </CustomChartWrapper>
      </ChartDataProviderPro>
    </Stack>
  );
}

```

## apiRef

### Print/Export as PDF

The `apiRef` prop exposes a `exportAsPrint()` method that can be used to open the browser's print dialog.

The print dialog allows you to print the chart or save it as a PDF, as well as configuring other settings.

```tsx
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import { ScatterChartPro } from '@mui/x-charts-pro/ScatterChartPro';
import { ChartProApi } from '@mui/x-charts-pro/context';
import { BarChartPro } from '@mui/x-charts-pro/BarChartPro';
import { LineChartPro } from '@mui/x-charts-pro/LineChartPro';
import { Heatmap } from '@mui/x-charts-pro/Heatmap';
import { Unstable_FunnelChart as FunnelChart } from '@mui/x-charts-pro/FunnelChart';
import { useChartProApiRef } from '@mui/x-charts-pro/hooks';
import { RadarChartPro } from '@mui/x-charts-pro/RadarChartPro';
import { PieChartPro } from '@mui/x-charts-pro/PieChartPro';
import { data } from './randomData';
import { heatmapData } from './heatmapData';

const scatterSeries = [
  {
    label: 'Series A',
    data: data.map((v) => ({ x: v.x1, y: v.y1, id: v.id })),
  },
  {
    label: 'Series B',
    data: data.map((v) => ({ x: v.x1, y: v.y2, id: v.id })),
  },
];
const series = [
  { label: 'Series A', data: data.map((p) => p.y1) },
  { label: 'Series B', data: data.map((p) => p.y2) },
];

type ChartType = 'scatter' | 'line' | 'bar' | 'pie' | 'heatmap' | 'funnel' | 'radar';

export default function PrintChart() {
  const [chartType, setChartType] = React.useState<ChartType>('scatter');
  const apiRef = useChartProApiRef<ChartType>();

  const handleChange = (event: SelectChangeEvent) =>
    setChartType(event.target.value as ChartType);

  return (
    <Stack width="100%" sx={{ display: 'block' }}>
      <Stack
        width="100%"
        direction="row"
        gap={2}
        justifyContent="center"
        sx={{ mb: 1 }}
      >
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="chart-type-label">Chart Type</InputLabel>
          <Select
            labelId="chart-type-label"
            id="chart-type-select"
            value={chartType}
            label="Chart Type"
            onChange={handleChange}
          >
            <MenuItem value="scatter">Scatter</MenuItem>
            <MenuItem value="line">Line</MenuItem>
            <MenuItem value="bar">Bar</MenuItem>
            <MenuItem value="pie">Pie</MenuItem>
            <MenuItem value="heatmap">Heatmap</MenuItem>
            <MenuItem value="funnel">Funnel</MenuItem>
            <MenuItem value="radar">Radar</MenuItem>
          </Select>
        </FormControl>
        <Button onClick={() => apiRef.current!.exportAsPrint()} variant="contained">
          Print
        </Button>
      </Stack>
      <Chart key={chartType} apiRef={apiRef} type={chartType} />
    </Stack>
  );
}

function Chart<T extends ChartType = ChartType>({
  apiRef,
  type,
}: {
  apiRef: React.RefObject<ChartProApi<T> | undefined>;
  type: T;
}) {
  switch (type) {
    case 'scatter':
      return (
        <ScatterChartPro
          apiRef={apiRef as React.RefObject<ChartProApi<'scatter'> | undefined>}
          height={300}
          series={scatterSeries}
        />
      );
    case 'line':
      return (
        <LineChartPro
          apiRef={apiRef as React.RefObject<ChartProApi<'line'> | undefined>}
          height={300}
          xAxis={[{ data: data.map((p) => p.x1).toSorted((a, b) => a - b) }]}
          series={series}
        />
      );
    case 'bar':
      return (
        <BarChartPro
          apiRef={apiRef as React.RefObject<ChartProApi<'bar'> | undefined>}
          height={300}
          xAxis={[
            { data: data.map((p) => Math.round(p.x1)).toSorted((a, b) => a - b) },
          ]}
          series={series}
        />
      );
    case 'pie':
      return (
        <PieChartPro
          apiRef={apiRef as React.RefObject<ChartProApi<'pie'> | undefined>}
          series={[
            {
              arcLabel: 'value',
              data: [
                { id: 0, value: 10, label: 'series A' },
                { id: 1, value: 15, label: 'series B' },
                { id: 2, value: 20, label: 'series C' },
              ],
            },
          ]}
          height={300}
          hideLegend={false}
        />
      );
    case 'heatmap':
      return (
        <Heatmap
          apiRef={apiRef as React.RefObject<ChartProApi<'heatmap'> | undefined>}
          xAxis={[{ data: [1, 2, 3, 4] }]}
          yAxis={[{ data: ['A', 'B', 'C', 'D', 'E'] }]}
          series={[{ data: heatmapData }]}
          height={300}
          hideLegend={false}
        />
      );
    case 'funnel':
      return (
        <FunnelChart
          apiRef={apiRef as React.RefObject<ChartProApi<'funnel'> | undefined>}
          width={400}
          height={300}
          series={[
            {
              data: [
                { label: 'Visitors', value: 200 },
                { label: 'Product Page Views', value: 180 },
                { label: 'Added to Cart', value: 90 },
                { label: 'Purchased', value: 50 },
              ],
            },
          ]}
        />
      );
    case 'radar':
      return (
        <RadarChartPro
          apiRef={apiRef as React.RefObject<ChartProApi<'radar'> | undefined>}
          height={300}
          series={[{ label: 'Lisa', data: [120, 98, 86, 99, 85, 65] }]}
          radar={{
            max: 120,
            metrics: [
              'Math',
              'Chinese',
              'English',
              'Geography',
              'Physics',
              'History',
            ],
          }}
        />
      );
    default:
      throw new Error(`Unknown chart type: ${type}`);
  }
}

```

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

```tsx
import * as React from 'react';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { LineChartPro } from '@mui/x-charts-pro/LineChartPro';
import { useChartProApiRef } from '@mui/x-charts-pro/hooks';
import { ChartProApi } from '@mui/x-charts-pro/context';

function ExportParamsSelector({
  apiRef,
}: {
  apiRef: React.RefObject<ChartProApi | undefined>;
}) {
  const [type, setType] = React.useState('image/png');
  const [rawQuality, setRawQuality] = React.useState('0.9');
  const quality = Math.max(0, Math.min(1, Number.parseFloat(rawQuality)));

  return (
    <Stack justifyContent="space-between" gap={2} sx={{ width: '100%' }}>
      <FormControl fullWidth>
        <FormLabel id="image-format-radio-buttons-group-label">
          Image Format
        </FormLabel>
        <RadioGroup
          row
          aria-labelledby="image-format-radio-buttons-group-label"
          name="image-format"
          value={type}
          onChange={(event) =>
            setType(event.target.value as 'image/png' | 'image/jpeg' | 'image/webp')
          }
        >
          <FormControlLabel
            value="image/png"
            control={<Radio />}
            label="image/png"
          />
          <FormControlLabel
            value="image/jpeg"
            control={<Radio />}
            label="image/jpeg"
          />
          <FormControlLabel
            value="image/webp"
            control={<Radio />}
            label="image/webp"
          />
        </RadioGroup>
      </FormControl>
      <FormControl>
        <TextField
          label="Quality"
          value={rawQuality}
          onChange={(event) => setRawQuality(event.target.value)}
          disabled={type === 'image/png'}
          helperText="Only applicable to lossy formats."
        />
      </FormControl>
      <div>
        <Button
          onClick={() => apiRef.current!.exportAsImage({ type, quality })}
          variant="contained"
        >
          Export Image
        </Button>
      </div>
    </Stack>
  );
}

export default function ExportChartAsImage() {
  const apiRef = useChartProApiRef<'line'>();

  return (
    <Stack width="100%" gap={2}>
      <LineChartPro
        apiRef={apiRef}
        xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
        series={[
          { data: [4, 9, 1, 4, 9, 6], label: 'Series A' },
          {
            data: [2, 5.5, 2, 8.5, 1.5, 5],
            area: true,
            label: 'Series B',
          },
        ]}
        height={300}
        grid={{ vertical: true, horizontal: true }}
      />
      <ExportParamsSelector apiRef={apiRef} />
    </Stack>
  );
}

```
