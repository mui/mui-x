import * as React from 'react';
import { LineChartPro, LineChartProProps } from '@mui/x-charts-pro/LineChartPro';
import { ScatterValueType, XAxis } from '@mui/x-charts/models';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import {
  ScatterChartPro,
  ScatterChartProProps,
} from '@mui/x-charts-pro/ScatterChartPro';
import { BarChartPro, BarChartProProps } from '@mui/x-charts-pro';
import { usUnemploymentRate } from '../dataset/usUnemploymentRate';
import { globalGdpPerCapita } from '../dataset/globalGdpPerCapita';
import { globalBirthPerWoman } from '../dataset/globalBirthsPerWoman';
import {
  continents,
  countriesInContinent,
  countryData,
} from '../dataset/countryData';
import { shareOfRenewables } from '../dataset/shareOfRenewables';

const lineData = usUnemploymentRate.map((d) => d.rate / 100);

const percentageFormatter = new Intl.NumberFormat(undefined, {
  style: 'percent',
  minimumSignificantDigits: 1,
  maximumSignificantDigits: 3,
});
const gdpPerCapitaFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
});

const lineXAxis = {
  scaleType: 'time',
  id: 'x',
  data: usUnemploymentRate.map((d) => d.date),
  valueFormatter: (v: Date, context) =>
    v.toLocaleDateString(undefined, {
      month:
        // eslint-disable-next-line no-nested-ternary
        context.location === 'tick'
          ? undefined
          : context.location === 'tooltip'
            ? 'long'
            : 'short',
      year: 'numeric',
    }),
} satisfies XAxis;

const lineSettings = {
  yAxis: [
    {
      id: 'y',
      width: 44,
      valueFormatter: (v: number | null) => percentageFormatter.format(v!),
      min: 0,
      zoom: { slider: { enabled: true, preview: true } },
    },
  ],
  series: [
    {
      data: lineData,
      showMark: false,
      valueFormatter: (v: number | null) => percentageFormatter.format(v!),
    },
  ],
  height: 400,
} satisfies Partial<LineChartProProps>;

const scatterXAxis = {
  valueFormatter: (v: number | null) => gdpPerCapitaFormatter.format(v!),
};
const scatterSettings = {
  yAxis: [
    {
      id: 'y',
      width: 44,
      min: 0,
      zoom: { slider: { enabled: true, preview: true } },
    },
  ],
  series: continents.map((continent) => ({
    label: continent,
    data: countriesInContinent[continent]
      .map((code) => ({
        id: code,
        x: globalGdpPerCapita.find((d) => d.code === code)?.gdpPerCapita,
        y: globalBirthPerWoman.find((d) => d.code === code)?.rate,
      }))
      .filter(
        (d): d is { id: string; x: number; y: number } =>
          d.x !== undefined && d.y !== undefined,
      ),
    valueFormatter: (value: ScatterValueType | null) =>
      `${countryData[value!.id as keyof typeof countryData].country} - Birth rate: ${value!.y} - GDP per capita: ${gdpPerCapitaFormatter.format(value!.x)}`,
  })),
  height: 400,
} satisfies Partial<ScatterChartProProps>;

const sortedShareOfRenewables = shareOfRenewables.toSorted(
  (a, b) => a.renewablesPercentage - b.renewablesPercentage,
);
const barXAxis = {
  data: sortedShareOfRenewables.map((d) => countryData[d.code].country),
  tickLabelStyle: { angle: -45 },
  height: 90,
} satisfies XAxis<'band'>;
const barSettings = {
  series: [
    {
      data: sortedShareOfRenewables.map((d) => d.renewablesPercentage / 100),
      valueFormatter: (v: number | null) => percentageFormatter.format(v!),
    },
  ],
  height: 400,
} satisfies Partial<BarChartProProps>;

export default function ZoomSliderPreview() {
  const [chartType, setChartType] = React.useState('bar');

  const handleChartType = (event: any, newChartType: string) => {
    if (newChartType !== null) {
      setChartType(newChartType);
    }
  };

  return (
    <Stack width="100%" gap={2}>
      <ToggleButtonGroup
        value={chartType}
        exclusive
        onChange={handleChartType}
        aria-label="chart type"
        fullWidth
      >
        {['bar', 'line', 'scatter'].map((type) => (
          <ToggleButton key={type} value={type} aria-label="left aligned">
            {type}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      {chartType === 'bar' && <BarChartPreview />}
      {chartType === 'line' && <LineChartPreview />}
      {chartType === 'scatter' && <ScatterChartPreview />}
    </Stack>
  );
}

function LineChartPreview() {
  return (
    <React.Fragment>
      <Typography variant="h6" sx={{ alignSelf: 'center' }}>
        Unemployment Rate in United States (1948-2025)
      </Typography>
      <LineChartPro
        {...lineSettings}
        xAxis={[
          {
            ...lineXAxis,
            zoom: { slider: { enabled: true, preview: true } },
          },
        ]}
      />
      <Typography variant="caption">
        Source: Federal Reserve Bank of St. Louis. Updated: Jun 6, 2025 7:46 AM CDT.
      </Typography>
    </React.Fragment>
  );
}

function BarChartPreview() {
  return (
    <React.Fragment>
      <Typography variant="h6" sx={{ alignSelf: 'center' }}>
        Share of Primary Energy Consumption from Renewables (2023)
      </Typography>
      <BarChartPro
        {...barSettings}
        xAxis={[{ ...barXAxis, zoom: { slider: { enabled: true, preview: true } } }]}
      />
      <Typography variant="caption">
        Source: Our World in Data. Updated: 2023.
      </Typography>
    </React.Fragment>
  );
}

function ScatterChartPreview() {
  return (
    <React.Fragment>
      <Typography variant="h6" sx={{ alignSelf: 'center' }}>
        Births per woman vs GDP per capita (USD, 2023)
      </Typography>
      <ScatterChartPro
        {...scatterSettings}
        xAxis={[
          { ...scatterXAxis, zoom: { slider: { enabled: true, preview: true } } },
        ]}
      />
      <Typography variant="caption">
        GDP per capita is expressed in international dollars at 2021 prices. <br />
        Source: Our World in Data. Updated: 2023.
      </Typography>
    </React.Fragment>
  );
}
