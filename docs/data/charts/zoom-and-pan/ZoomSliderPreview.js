import * as React from 'react';
import { LineChartPro } from '@mui/x-charts-pro/LineChartPro';

import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import { ScatterChartPro } from '@mui/x-charts-pro/ScatterChartPro';
import { BarChartPro } from '@mui/x-charts-pro/BarChartPro';
import { usUnemploymentRate } from '../dataset/usUnemploymentRate';
import { globalGdpPerCapita } from '../dataset/globalGdpPerCapita';
import { globalBirthPerWoman } from '../dataset/globalBirthsPerWoman';
import {
  continents,
  countriesInContinent,
  countryData,
} from '../dataset/countryData';
import { shareOfRenewables } from '../dataset/shareOfRenewables';
import { populationPrediction2050 } from '../dataset/populationPrediction2050';

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
  valueFormatter: (v, context) =>
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
};

const lineSettings = {
  yAxis: [
    {
      id: 'y',
      width: 44,
      valueFormatter: (v) => percentageFormatter.format(v),
      min: 0,
    },
  ],
  series: [
    {
      data: lineData,
      showMark: false,
      valueFormatter: (v) => percentageFormatter.format(v),
    },
  ],
  height: 400,
};

const areaXAxis = {
  id: 'x',
  data: new Array(101).fill(null).map((_, i) => i),
  label: 'Age',
  valueFormatter: (v) => (v === 100 ? '100+' : `${v}`),
};

const areaSettings = {
  yAxis: [
    {
      id: 'y',
      width: 44,
      valueFormatter: (v) => populationFormatter.format(v),
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
    valueFormatter: (v) => populationFormatter.format(v),
  })),
  height: 400,
};

const scatterXAxis = {
  valueFormatter: (v) => gdpPerCapitaFormatter.format(v),
};
const scatterSettings = {
  yAxis: [
    {
      id: 'y',
      width: 44,
      min: 0,
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
      .filter((d) => d.x !== undefined && d.y !== undefined),
    valueFormatter: (value) =>
      `${countryData[value.id].country} - Birth rate: ${value.y} - GDP per capita: ${gdpPerCapitaFormatter.format(value.x)}`,
  })),
  height: 400,
};

const sortedShareOfRenewables = shareOfRenewables.toSorted(
  (a, b) => a.renewablesPercentage - b.renewablesPercentage,
);
const barXAxis = {
  data: sortedShareOfRenewables.map((d) => countryData[d.code].country),
  tickLabelStyle: { angle: -45 },
  height: 90,
};
const barSettings = {
  series: [
    {
      data: sortedShareOfRenewables.map((d) => d.renewablesPercentage / 100),
      valueFormatter: (v) => percentageFormatter.format(v),
    },
  ],
  height: 400,
};

export default function ZoomSliderPreview() {
  const [chartType, setChartType] = React.useState('bar');

  const handleChartType = (event, newChartType) => {
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
        {['bar', 'line', 'area', 'scatter'].map((type) => (
          <ToggleButton key={type} value={type} aria-label="left aligned">
            {type}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      {chartType === 'bar' && <BarChartPreview />}
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
