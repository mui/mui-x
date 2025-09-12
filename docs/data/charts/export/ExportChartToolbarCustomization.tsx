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
