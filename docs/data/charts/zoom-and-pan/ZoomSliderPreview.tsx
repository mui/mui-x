import * as React from 'react';
import { LineChartPro, LineChartProProps } from '@mui/x-charts-pro/LineChartPro';
import {
  AxisValueFormatterContext,
  ScatterValueType,
  XAxis,
} from '@mui/x-charts/models';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import {
  ScatterChartPro,
  ScatterChartProProps,
} from '@mui/x-charts-pro/ScatterChartPro';
import { BarChartPro, BarChartProProps } from '@mui/x-charts-pro/BarChartPro';
import {
  BarChartPremium,
  BarChartPremiumProps,
} from '@mui/x-charts-premium/BarChartPremium';
import {
  dateAxisFormatter,
  usUnemploymentRate,
} from '../dataset/usUnemploymentRate';
import { globalGdpPerCapita } from '../dataset/globalGdpPerCapita';
import { globalBirthPerWoman } from '../dataset/globalBirthsPerWoman';
import {
  continents,
  countriesInContinent,
  countryData,
} from '../dataset/countryData';
import { shareOfRenewables } from '../dataset/shareOfRenewables';
import { populationPrediction2050 } from '../dataset/populationPrediction2050';
import { temperatureBerlinPorto } from '../dataset/temperatureBerlinPorto';

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
const populationFormatter = new Intl.NumberFormat('en-US', { notation: 'compact' });

const lineXAxis = {
  scaleType: 'time',
  id: 'x',
  data: usUnemploymentRate.map((d) => d.date),
  valueFormatter: dateAxisFormatter,
} satisfies XAxis;

const lineSettings = {
  yAxis: [
    {
      id: 'y',
      width: 44,
      valueFormatter: (v: number | null) => percentageFormatter.format(v!),
      min: 0,
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

const areaXAxis = {
  id: 'x',
  data: new Array(101).fill(null).map((_, i) => i),
  label: 'Age',
  valueFormatter: (v: number | null) =>
    v === 100 ? '100+' : Math.round(v!).toString(),
} satisfies XAxis;

const areaSettings = {
  yAxis: [
    {
      id: 'y',
      width: 44,
      valueFormatter: (v: number | null) => populationFormatter.format(v!),
    },
  ],
  series: ['Europe', 'Asia', 'Americas', 'Africa', 'Oceania'].map((continent) => ({
    data: populationPrediction2050
      .filter((point) => point.location === continent)
      .map((point) => point.value),
    showMark: false,
    area: true,
    label: continent,
    stack: 'population',
    valueFormatter: (v: number | null) => populationFormatter.format(v!),
  })),
  height: 400,
} satisfies Partial<LineChartProProps>;

const scatterXAxis = {
  valueFormatter: (v: number | null) => gdpPerCapitaFormatter.format(v!),
};
const scatterSettings = {
  yAxis: [{ id: 'y', width: 16, min: 0 }],
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

const rangeBarXAxis = {
  data: temperatureBerlinPorto.months,
  valueFormatter: (v: string, context: AxisValueFormatterContext) =>
    context.location === 'tick' ? v.slice(0, 3) : v,
} satisfies XAxis<'band'>;
const rangeBarSettings = {
  yAxis: [{ valueFormatter: (value: number) => `${value}°C` }],
  series: [
    {
      id: 'porto',
      type: 'rangeBar',
      label: 'Porto, Portugal',
      valueFormatter: (value) =>
        value === null ? null : `${value[0]}°C - ${value[1]}°C`,
      data: temperatureBerlinPorto.porto,
    },
    {
      id: 'berlin',
      type: 'rangeBar',
      label: 'Berlin, Germany',
      valueFormatter: (value) =>
        value === null ? null : `${value[0]}°C - ${value[1]}°C`,
      data: temperatureBerlinPorto.berlin,
    },
  ],
  height: 300,
} satisfies BarChartPremiumProps;

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
        {['bar', 'rangeBar', 'line', 'area', 'scatter'].map((type) => (
          <ToggleButton key={type} value={type}>
            {type}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      {chartType === 'bar' && <BarChartPreview />}
      {chartType === 'rangeBar' && <RangeBarChartPreview />}
      {chartType === 'line' && <LineChartPreview />}
      {chartType === 'area' && <AreaChartPreview />}
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
          { ...lineXAxis, zoom: { slider: { enabled: true, preview: true } } },
        ]}
      />
      <Typography variant="caption">
        Source: Federal Reserve Bank of St. Louis. Updated: Jun 6, 2025 7:46 AM CDT.
      </Typography>
    </React.Fragment>
  );
}

function AreaChartPreview() {
  return (
    <React.Fragment>
      <Typography variant="h6" sx={{ alignSelf: 'center' }}>
        Population by Age Group in 2050 (Projected)
      </Typography>
      <LineChartPro
        {...areaSettings}
        xAxis={[
          { ...areaXAxis, zoom: { slider: { enabled: true, preview: true } } },
        ]}
      />
      <Typography variant="caption">
        Source: World Population Prospects: The 2024 Revision, United Nations.
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

function RangeBarChartPreview() {
  return (
    <React.Fragment>
      <Typography variant="h6" sx={{ alignSelf: 'center' }}>
        Average monthly temperature ranges in °C for Porto and Berlin in 1991-2020
      </Typography>
      <BarChartPremium
        {...rangeBarSettings}
        xAxis={[
          { ...rangeBarXAxis, zoom: { slider: { enabled: true, preview: true } } },
        ]}
      />
      <Typography variant="caption">
        Source: IPMA (Porto), climate-data.org (Berlin)
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
