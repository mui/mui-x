import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ChartsContainer } from '@mui/x-charts/ChartsContainer';
import { BarPlot } from '@mui/x-charts/BarChart';
import { LineHighlightPlot, LinePlot, MarkPlot } from '@mui/x-charts/LineChart';
import { ChartsAxisHighlight } from '@mui/x-charts/ChartsAxisHighlight';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { ChartsGrid } from '@mui/x-charts/ChartsGrid';
import { ChartsTooltip } from '@mui/x-charts/ChartsTooltip';
import { useDrawingArea, useXScale, useYScale } from '@mui/x-charts/hooks';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { forecast, type IconType } from './weatherForecast';

export default function WeatherComposition() {
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
        <ForecastChart />

        <WindChart />
      </Stack>
      <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', rowGap: 0.5, justifyContent: 'center' }}>
        <LegendItem color={colors.temperature} label="Temperature C" />
        <LegendItem color={colors.precipitation} label="Precipitation mm" />
        <LegendItem color={colors.maxPrecipitation} label="Max precip. mm" hatch />
        <LegendItem color={colors.wind} label="Wind m/s" />
        <LegendItem color={colors.windGust} label="Wind gust m/s" dashed />
      </Stack>
    </Stack>
  );
}

function ForecastChart() {
  return (
    <ChartsContainer
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
      series={[
        {
          id: 'precipitation',
          type: 'bar',
          dataKey: 'precipitation',
          yAxisId: 'precipitation',
          label: 'Precipitation',
          color: colors.precipitation,
          valueFormatter: (value: number | null) =>
            value !== null ? `${value}mm` : '',
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
          valueFormatter: (value: number | null) =>
            value !== null ? `${value}°C` : '',
        },
      ]}
      height={310}
      margin={{ top: 64, right: 24, bottom: 8, left: 36 }}
    >
      <ChartsGrid horizontal />
      <ChartsAxisHighlight x="band" />
      <DayAndTimeHeader />
      <MaxPrecipitationBars />
      <BarPlot />
      <LinePlot />
      <MarkPlot />
      <WeatherMarkers />
      <ChartsYAxis axisId="precipitation" />
      <ChartsYAxis disableLine axisId="temperature" />
      <ChartsTooltip />
    </ChartsContainer>
  );
}

function WindChart() {
  return (
    <ChartsContainer
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
      series={[
        {
          id: 'wind',
          type: 'line',
          dataKey: 'wind',
          yAxisId: 'wind',
          label: 'Wind',
          color: colors.wind,
          curve: 'linear',
          valueFormatter: (value: number | null) =>
            value !== null ? `${value} m/s` : '',
        },
        {
          id: 'gust',
          type: 'line',
          dataKey: 'gust',
          yAxisId: 'wind',
          label: 'Wind gust',
          color: colors.windGust,
          curve: 'linear',
          valueFormatter: (value: number | null) =>
            value !== null ? `${value} m/s` : '',
        },
      ]}
      height={150}
      margin={{ top: 20, right: 24, bottom: 32, left: 86 }}
      sx={{ [`& [data-series=gust]`]: { strokeDasharray: '4 4' } }}
    >
      <ChartsGrid horizontal />
      <ChartsAxisHighlight x="line" />
      <LinePlot />
      <LineHighlightPlot />
      <ChartsYAxis axisId="wind" label="Wind m/s" />
      <ChartsTooltip sx={{ [`& [data-series=gust]`]: { strokeDasharray: '4 4' } }} />
    </ChartsContainer>
  );
}

function WeatherIcon({ type }: { type: IconType }) {
  const isRain = type === 'rain';
  const isMoon = type === 'moon-cloud';
  const isSun = type === 'partly-cloudy';

  return (
    <g>
      {isSun && (
        <g transform="translate(-7 -7)">
          <circle r={5} fill="#ffd54f" stroke="#f57f17" strokeWidth={1.2} />
          <path
            d="M 0 -10 V -7 M 0 7 V 10 M -10 0 H -7 M 7 0 H 10 M -7 -7 L -5 -5 M 7 -7 L 5 -5"
            stroke="#f57f17"
            strokeWidth={1.2}
            strokeLinecap="round"
          />
        </g>
      )}
      {isMoon && (
        <path d="M -7 -10 A 3 3 0 0 0 -7 4 A 15 15 0 0 1 -7 -10 Z" fill="#90a4ae" />
      )}
      <path
        d="M -8 1 A 7 7 0 0 1 5 -3 A 5 5 0 0 1 9 7 H -9 A 5 5 0 0 1 -8 1 Z"
        fill={isRain ? '#bbdefb' : '#cfd8dc'}
        stroke={isRain ? '#1976d2' : '#78909c'}
        strokeWidth={1.4}
      />
      {isRain && (
        <path
          d="M -5 11 L -7 15 M 0 11 L -2 15 M 5 11 L 3 15"
          stroke="#1976d2"
          strokeWidth={1.2}
          strokeLinecap="round"
        />
      )}
    </g>
  );
}

function DayAndTimeHeader() {
  const xScale = useXScale<'band'>();
  const { top, height } = useDrawingArea();
  const theme = useTheme();

  // Get the start/end time value grouped per day.
  const days = React.useMemo(() => {
    return (xScale.domain() as Date[]).reduce(
      (acc: { start: Date; end: Date }[], date: Date) => {
        if (
          acc.length === 0 ||
          date.getDate() !== acc[acc.length - 1].start.getDate()
        ) {
          return [...acc, { start: date, end: date }];
        }
        return [
          ...acc.slice(0, acc.length - 1),
          { start: acc[acc.length - 1].start, end: date },
        ];
      },
      [] as { start: Date; end: Date }[],
    );
  }, [xScale]);

  return (
    <g fontSize={12} fill={theme.palette.text.secondary}>
      {days.map(({ start, end }, dayIndex: number) => {
        const endDay =
          xScale(end)! + xScale.step() - (xScale.step() - xScale.bandwidth()) / 2;
        const middleDay = (xScale(end)! + xScale(start)!) / 2;

        const labelX = dayIndex === 0 ? endDay : middleDay;
        const showLine = dayIndex !== days.length - 1;

        return (
          <g>
            <text x={labelX} y={top - 30} textAnchor="middle" fontWeight={600}>
              {start.toLocaleDateString('en-US', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
              })}
            </text>
            {showLine && (
              <line
                x1={endDay}
                x2={endDay}
                y1={top - 22}
                y2={top + height}
                stroke={theme.palette.text.secondary}
                strokeDasharray="4 4"
              />
            )}
          </g>
        );
      })}
      {forecast.map((item) => {
        const x = (xScale(item.time) ?? 0) + xScale.bandwidth() / 2;
        return (
          <text key={item.time.toString()} x={x} y={top - 8} textAnchor="middle">
            {item.time.toLocaleTimeString('en-US', { hour: 'numeric' })}
          </text>
        );
      })}
    </g>
  );
}

function WeatherMarkers() {
  const xScale = useXScale<'band'>();
  const yScale = useYScale<'linear'>('temperature');

  return (
    <g aria-hidden="true">
      {forecast.map((item) => {
        const x = (xScale(item.time) ?? 0) + xScale.bandwidth() / 2;
        const y = (yScale(item.temperature) ?? 0) - 26;

        return (
          <g key={item.time.toISOString()} transform={`translate(${x}, ${y})`}>
            <WeatherIcon type={item.icon} />
          </g>
        );
      })}
    </g>
  );
}

function MaxPrecipitationBars() {
  const xScale = useXScale<'band'>();
  const yScale = useYScale<'linear'>('precipitation');
  const zero = yScale(0) ?? 0;
  const barWidth = xScale.bandwidth() * 0.56;

  return (
    <g aria-hidden="true">
      <defs>
        <pattern
          id="weather-max-precipitation"
          width={6}
          height={6}
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <rect width={6} height={6} fill="#e3f2fd" />
          <line x1={0} x2={0} y1={0} y2={6} stroke="#64b5f6" strokeWidth={2} />
        </pattern>
      </defs>
      {forecast.map((item) => {
        const valueY = yScale(item.maxPrecipitation) ?? zero;
        const x = (xScale(item.time) ?? 0) + (xScale.bandwidth() - barWidth) / 2;
        return (
          <rect
            key={item.time.toISOString()}
            x={x}
            y={valueY}
            width={barWidth}
            height={zero - valueY}
            fill="url(#weather-max-precipitation)"
            opacity={item.maxPrecipitation === 0 ? 0 : 1}
          />
        );
      })}
    </g>
  );
}

// function WindLines() {
//   const xScale = useXScale<'band'>();
//   const yScale = useYScale<'linear'>('wind');
//   const { top, height } = useDrawingArea();
//   const points = forecast
//     .map(
//       (item) =>
//         `${(xScale(item.time) ?? 0) + xScale.bandwidth() / 2},${yScale(item.wind)}`,
//     )
//     .join(' ');
//   const gustPoints = forecast
//     .map(
//       (item) =>
//         `${(xScale(item.time) ?? 0) + xScale.bandwidth() / 2},${yScale(item.gust)}`,
//     )
//     .join(' ');
//   const arrowY = top + height + 20;

//   return (
//     <g aria-hidden="true">
//       <polyline
//         points={gustPoints}
//         fill="none"
//         stroke="#7c4dff"
//         strokeWidth={1.5}
//         strokeDasharray="4 4"
//       />
//       <polyline points={points} fill="none" stroke="#7e22ce" strokeWidth={2.5} />
//       {forecast.map((item) => {
//         const x = (xScale(item.time) ?? 0) + xScale.bandwidth() / 2;
//         return (
//           <g
//             key={item.time.toString()}
//             transform={`translate(${x}, ${arrowY}) rotate(${item.windDirection})`}
//           >
//             <path
//               d="M 0 -8 L 0 5 M -4 1 L 0 6 L 4 1"
//               fill="none"
//               stroke="#455a64"
//               strokeWidth={1.4}
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             />
//           </g>
//         );
//       })}
//     </g>
//   );
// }

function LegendItem({
  color,
  label,
  dashed = false,
  hatch = false,
}: {
  color: string;
  label: string;
  dashed?: boolean;
  hatch?: boolean;
}) {
  return (
    <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
      <Box
        sx={{
          width: 18,
          height: 3,
          borderTop: dashed ? `2px dashed ${color}` : undefined,
          bgcolor: dashed ? 'transparent' : color,
          backgroundImage: hatch
            ? `repeating-linear-gradient(45deg, ${color} 0, ${color} 2px, transparent 2px, transparent 5px)`
            : undefined,
        }}
      />
      <Typography variant="caption">{label}</Typography>
    </Stack>
  );
}

const colors = {
  temperature: '#c21807',
  precipitation: '#1565c0',
  maxPrecipitation: '#64b5f6',
  wind: '#7e22ce',
  windGust: '#7c4dff',
};
