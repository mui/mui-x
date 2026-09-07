import * as React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ChartsContainer } from '@mui/x-charts/ChartsContainer';
import { BarPlot } from '@mui/x-charts/BarChart';
import { LineHighlightPlot, LinePlot, MarkPlot } from '@mui/x-charts/LineChart';
import { ChartsAxisHighlight } from '@mui/x-charts/ChartsAxisHighlight';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { ChartsGrid } from '@mui/x-charts/ChartsGrid';
import {
  ChartsTooltipContainer,
  ChartsTooltipPaper,
  ChartsTooltipTable,
  ChartsTooltipRow,
  ChartsTooltipCell,
  useAxesTooltip,
} from '@mui/x-charts/ChartsTooltip';
import { ChartsLabelMark } from '@mui/x-charts/ChartsLabel';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { AxisItemIdentifier } from '@mui/x-charts/models';
import { forecast } from '../dataset/weatherForecast';
import {
  DayAndTimeHeader,
  WeatherMarkers,
  MaxPrecipitationBars,
  LegendItem,
} from './weatherCompositionComponents';

export default function WeatherComposition() {
  const [highlightedAxis, setHighlightedAxis] = React.useState<AxisItemIdentifier[]>(
    [],
  );

  const sync = {
    highlightedAxis,
    onHighlightedAxisChange: setHighlightedAxis,
  };

  return (
    <Stack spacing={1} sx={{ width: '100%' }}>
      <Stack
        spacing={2}
        sx={(theme) => ({
          width: '100%',
          [`& .${axisClasses.tick}, & .${axisClasses.line}`]: {
            stroke: theme.palette.divider,
          },
          [`& .${axisClasses.tickLabel}`]: {
            fill: theme.palette.secondary,
          },
        })}
      >
        <ForecastChart {...sync} />
        <WindChart {...sync} />
      </Stack>
      <Stack
        direction="row"
        spacing={2}
        sx={{ flexWrap: 'wrap', rowGap: 0.5, justifyContent: 'center' }}
      >
        <LegendItem color={colors.temperature} label="Temperature C" />
        <LegendItem color={colors.precipitation} label="Precipitation mm" />
        <LegendItem color={colors.maxPrecipitation} label="Max precip. mm" hatch />
        <LegendItem color={colors.wind} label="Wind m/s" />
        <LegendItem color={colors.windGust} label="Wind gust m/s" dashed />
      </Stack>
    </Stack>
  );
}

type AxisSyncProps = {
  highlightedAxis: AxisItemIdentifier[];
  onHighlightedAxisChange: (axisItems: AxisItemIdentifier[]) => void;
};

function ForecastChart(props: AxisSyncProps) {
  return (
    <ChartsContainer
      {...props}
      dataset={forecast}
      xAxis={[
        {
          id: 'time',
          scaleType: 'band',
          dataKey: 'time',
          height: 0,
          valueFormatter: (value: Date) =>
            value.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
            }),
        },
      ]}
      yAxis={[
        {
          id: 'temperature',
          min: 6,
          max: 26,
          width: 50,
          valueFormatter: (value: number) => `${value}°`,
        },
        {
          id: 'precipitation',
          label: 'Precipitation (mm)',
          position: 'right',
          min: 0,
          max: 8,
          width: 56,
        },
      ]}
      series={weatherSeries}
      height={310}
      margin={{ top: 64, right: 24, bottom: 8, left: 36 }}
    >
      <ChartsGrid horizontal />

      <DayAndTimeHeader />
      <MaxPrecipitationBars />
      <BarPlot />
      <LinePlot />
      <MarkPlot />
      <WeatherMarkers />
      <ChartsYAxis axisId="precipitation" />
      <ChartsYAxis disableLine axisId="temperature" />
      <ChartsAxisHighlight x="band" />
      <ChartsAxisHighlight x="line" />
      <ChartsTooltipContainer>
        <WeatherTooltip type="weather" />
      </ChartsTooltipContainer>
    </ChartsContainer>
  );
}

function WindChart(props: AxisSyncProps) {
  return (
    <ChartsContainer
      {...props}
      dataset={forecast}
      xAxis={[
        {
          id: 'time',
          scaleType: 'band',
          dataKey: 'time',
          height: 0,
          valueFormatter: (value: Date) =>
            value.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
            }),
        },
      ]}
      yAxis={[
        {
          id: 'wind',
          position: 'right',
          min: 0,
          width: 56,
          tickInterval: [0, 4, 8],
        },
      ]}
      series={windSeries}
      height={150}
      margin={{ top: 8, right: 24, bottom: 32, left: 86 }}
      sx={{ [`& [data-series=gust]`]: { strokeDasharray: '4 4' } }}
    >
      <ChartsGrid horizontal />

      <LinePlot />
      <LineHighlightPlot />
      <ChartsYAxis axisId="wind" label="Wind m/s" />
      <ChartsAxisHighlight x="band" />
      <ChartsAxisHighlight x="line" />
      <ChartsTooltipContainer>
        <WeatherTooltip type="wind" />
      </ChartsTooltipContainer>
    </ChartsContainer>
  );
}

function WeatherTooltip({ type }: { type: 'weather' | 'wind' }) {
  const tooltipData = useAxesTooltip();

  if (
    !tooltipData ||
    tooltipData.length === 0 ||
    (type === 'weather' &&
      !tooltipData[0].seriesItems.some((item) => item.seriesId === 'temperature')) ||
    (type === 'wind' &&
      !tooltipData[0].seriesItems.some((item) => item.seriesId === 'wind'))
  ) {
    return null;
  }

  const { dataIndex, axisFormattedValue } = tooltipData[0];
  const item = forecast[dataIndex];

  if (!item) {
    return null;
  }

  const rows = [
    {
      label: 'Temperature',
      color: colors.temperature,
      mark: 'line',
      value: `${item.temperature}°C`,
    },
    {
      label: 'Precipitation',
      color: colors.precipitation,
      mark: 'square',
      value: `${item.precipitation}mm`,
    },
    {
      label: 'Max precip.',
      color: colors.maxPrecipitation,
      mark: 'square',
      value: `${item.maxPrecipitation}mm`,
    },
    { label: 'Wind', color: colors.wind, mark: 'line', value: `${item.wind} m/s` },
    {
      label: 'Wind gust',
      color: colors.windGust,
      mark: 'line',
      value: `${item.gust} m/s`,
    },
  ] as const;

  return (
    <ChartsTooltipPaper>
      <ChartsTooltipTable>
        <Typography component="caption">{axisFormattedValue}</Typography>
        <tbody>
          {rows.map((row) => (
            <ChartsTooltipRow key={row.label}>
              <ChartsTooltipCell component="th">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ChartsLabelMark type={row.mark} color={row.color} />
                  {row.label}
                </Box>
              </ChartsTooltipCell>
              <ChartsTooltipCell component="td">{row.value}</ChartsTooltipCell>
            </ChartsTooltipRow>
          ))}
        </tbody>
      </ChartsTooltipTable>
    </ChartsTooltipPaper>
  );
}

const colors = {
  temperature: '#c21807',
  precipitation: '#1565c0',
  maxPrecipitation: '#64b5f6',
  wind: '#7e22ce',
  windGust: '#7c4dff',
};

const weatherSeries = [
  {
    id: 'precipitation',
    type: 'bar',
    dataKey: 'precipitation',
    yAxisId: 'precipitation',
    label: 'Precipitation',
    color: colors.precipitation,
    valueFormatter: (value: number | null) => (value !== null ? `${value}mm` : ''),
  },
  {
    id: 'temperature',
    type: 'line',
    dataKey: 'temperature',
    yAxisId: 'temperature',
    label: 'Temperature',
    color: colors.temperature,
    showMark: false,
    curve: 'natural',
    valueFormatter: (value: number | null) => (value !== null ? `${value}°C` : ''),
  },
] as const;

const windSeries = [
  {
    id: 'wind',
    type: 'line',
    dataKey: 'wind',
    yAxisId: 'wind',
    label: 'Wind',
    color: colors.wind,
    curve: 'linear',
    valueFormatter: (value: number | null) => (value !== null ? `${value} m/s` : ''),
  },
  {
    id: 'gust',
    type: 'line',
    dataKey: 'gust',
    yAxisId: 'wind',
    label: 'Wind gust',
    color: colors.windGust,
    curve: 'linear',
    valueFormatter: (value: number | null) => (value !== null ? `${value} m/s` : ''),
  },
] as const;
