import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ChartsContainer } from '@mui/x-charts/ChartsContainer';
import { BarPlot } from '@mui/x-charts/BarChart';
import { LinePlot, MarkPlot } from '@mui/x-charts/LineChart';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { ChartsGrid } from '@mui/x-charts/ChartsGrid';
import { ChartsTooltip } from '@mui/x-charts/ChartsTooltip';
import { useDrawingArea, useXScale, useYScale } from '@mui/x-charts/hooks';

const forecast = [
  {
    time: '20',
    day: 'Mon. 8 June',
    temperature: 20,
    precipitation: 0,
    maxPrecipitation: 0,
    wind: 2.6,
    gust: 6,
    icon: 'cloud',
    windDirection: 35,
  },
  {
    time: '22',
    day: 'Mon. 8 June',
    temperature: 17,
    precipitation: 0,
    maxPrecipitation: 0,
    wind: 2,
    gust: 4,
    icon: 'moon-cloud',
    windDirection: 50,
  },
  {
    time: '00',
    day: 'Tue. 9 June',
    temperature: 15,
    precipitation: 0,
    maxPrecipitation: 0,
    wind: 2.4,
    gust: 5,
    icon: 'moon-cloud',
    windDirection: 30,
  },
  {
    time: '02',
    day: 'Tue. 9 June',
    temperature: 14,
    precipitation: 0,
    maxPrecipitation: 0,
    wind: 2.8,
    gust: 5,
    icon: 'cloud',
    windDirection: 10,
  },
  {
    time: '04',
    day: 'Tue. 9 June',
    temperature: 15,
    precipitation: 0.4,
    maxPrecipitation: 1.2,
    wind: 3.2,
    gust: 6,
    icon: 'rain',
    windDirection: -15,
  },
  {
    time: '06',
    day: 'Tue. 9 June',
    temperature: 15,
    precipitation: 1.8,
    maxPrecipitation: 3.2,
    wind: 4.1,
    gust: 7,
    icon: 'rain',
    windDirection: -45,
  },
  {
    time: '08',
    day: 'Tue. 9 June',
    temperature: 16,
    precipitation: 3.9,
    maxPrecipitation: 5.4,
    wind: 5.5,
    gust: 9,
    icon: 'rain',
    windDirection: -70,
  },
  {
    time: '10',
    day: 'Tue. 9 June',
    temperature: 19,
    precipitation: 2.8,
    maxPrecipitation: 4.7,
    wind: 3.8,
    gust: 8,
    icon: 'rain',
    windDirection: -95,
  },
  {
    time: '12',
    day: 'Tue. 9 June',
    temperature: 21,
    precipitation: 1.2,
    maxPrecipitation: 3.1,
    wind: 4.4,
    gust: 7,
    icon: 'partly-cloudy',
    windDirection: -35,
  },
  {
    time: '14',
    day: 'Tue. 9 June',
    temperature: 19,
    precipitation: 0.3,
    maxPrecipitation: 1.4,
    wind: 4.6,
    gust: 7,
    icon: 'partly-cloudy',
    windDirection: 15,
  },
  {
    time: '16',
    day: 'Tue. 9 June',
    temperature: 16,
    precipitation: 0,
    maxPrecipitation: 0.5,
    wind: 4.7,
    gust: 6,
    icon: 'cloud',
    windDirection: 35,
  },
  {
    time: '18',
    day: 'Tue. 9 June',
    temperature: 15,
    precipitation: 0,
    maxPrecipitation: 0,
    wind: 4.4,
    gust: 6,
    icon: 'cloud',
    windDirection: 20,
  },
];

function WeatherIcon({ type }: { type: string }) {
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
        <path
          d="M -9 -7 A 7 7 0 0 0 -1 4 A 8 8 0 0 1 -10 1 A 8 8 0 0 1 -9 -7 Z"
          fill="#90a4ae"
        />
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
  const { left, top, width, height } = useDrawingArea();
  const tuesdayStart = xScale('00') ?? left;

  return (
    <g fontSize={12} fill="#546e7a">
      <text
        x={left + width * 0.18}
        y={top - 30}
        textAnchor="middle"
        fontWeight={600}
      >
        Mon. 8 June
      </text>
      <text
        x={left + width * 0.68}
        y={top - 30}
        textAnchor="middle"
        fontWeight={600}
      >
        Tue. 9 June
      </text>
      <line
        x1={tuesdayStart}
        x2={tuesdayStart}
        y1={top - 22}
        y2={top + height}
        stroke="#cfd8dc"
        strokeDasharray="4 4"
      />
      {forecast.map((item) => {
        const x = (xScale(item.time) ?? 0) + xScale.bandwidth() / 2;
        return (
          <text
            key={`${item.day}-${item.time}`}
            x={x}
            y={top - 8}
            textAnchor="middle"
          >
            {item.time}
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
          <g key={`${item.day}-${item.time}`} transform={`translate(${x}, ${y})`}>
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
            key={`${item.day}-${item.time}`}
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

function TemperatureAxisLabels() {
  const { left } = useDrawingArea();
  const yScale = useYScale<'linear'>('temperature');
  const ticks = [10, 15, 20, 25];

  return (
    <g aria-hidden="true">
      {ticks.map((tick) => (
        <text
          key={tick}
          x={left - 8}
          y={(yScale(tick) ?? 0) + 4}
          fill="#424242"
          fontSize={12}
          textAnchor="end"
        >
          {tick}°
        </text>
      ))}
    </g>
  );
}

function WindLines() {
  const xScale = useXScale<'band'>();
  const yScale = useYScale<'linear'>('wind');
  const { top, height } = useDrawingArea();
  const points = forecast
    .map(
      (item) =>
        `${(xScale(item.time) ?? 0) + xScale.bandwidth() / 2},${yScale(item.wind)}`,
    )
    .join(' ');
  const gustPoints = forecast
    .map(
      (item) =>
        `${(xScale(item.time) ?? 0) + xScale.bandwidth() / 2},${yScale(item.gust)}`,
    )
    .join(' ');
  const arrowY = top + height + 20;

  return (
    <g aria-hidden="true">
      <polyline
        points={gustPoints}
        fill="none"
        stroke="#7c4dff"
        strokeWidth={1.5}
        strokeDasharray="4 4"
      />
      <polyline points={points} fill="none" stroke="#7e22ce" strokeWidth={2.5} />
      {forecast.map((item) => {
        const x = (xScale(item.time) ?? 0) + xScale.bandwidth() / 2;
        return (
          <g
            key={`${item.day}-${item.time}`}
            transform={`translate(${x}, ${arrowY}) rotate(${item.windDirection})`}
          >
            <path
              d="M 0 -8 L 0 5 M -4 1 L 0 6 L 4 1"
              fill="none"
              stroke="#455a64"
              strokeWidth={1.4}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        );
      })}
    </g>
  );
}

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

function ForecastChart() {
  return (
    <ChartsContainer
      dataset={forecast}
      xAxis={[{ id: 'time', scaleType: 'band', dataKey: 'time', height: 0 }]}
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
          color: '#1565c0',
        },
        {
          id: 'temperature',
          type: 'line',
          dataKey: 'temperature',
          yAxisId: 'temperature',
          label: 'Temperature',
          color: '#c21807',
          showMark: false,
          curve: 'natural',
        },
      ]}
      height={310}
      margin={{ top: 64, right: 24, bottom: 8, left: 36 }}
    >
      <ChartsGrid horizontal />
      <DayAndTimeHeader />
      <TemperatureAxisLabels />
      <MaxPrecipitationBars />
      <BarPlot />
      <LinePlot />
      <MarkPlot />
      <WeatherMarkers />
      <ChartsXAxis
        axisId="time"
        disableLine
        disableTicks
        tickLabelStyle={{ display: 'none' }}
      />
      <ChartsYAxis axisId="precipitation" />
      <ChartsTooltip />
    </ChartsContainer>
  );
}

function WindChart() {
  return (
    <ChartsContainer
      dataset={forecast}
      xAxis={[{ id: 'time', scaleType: 'band', dataKey: 'time', height: 0 }]}
      yAxis={[
        {
          id: 'wind',
          position: 'right',
          min: 0,
          max: 8,
          width: 56,
          tickInterval: [0, 2, 4, 6, 8],
        },
      ]}
      series={[
        {
          id: 'wind',
          type: 'line',
          dataKey: 'wind',
          yAxisId: 'wind',
          label: 'Wind',
          color: '#7e22ce',
        },
        {
          id: 'gust',
          type: 'line',
          dataKey: 'gust',
          yAxisId: 'wind',
          label: 'Wind gust',
          color: '#7c4dff',
        },
      ]}
      height={132}
      margin={{ top: 20, right: 24, bottom: 32, left: 36 }}
    >
      <ChartsGrid horizontal />
      <WindLines />
      <ChartsXAxis
        axisId="time"
        disableLine
        disableTicks
        tickLabelStyle={{ display: 'none' }}
      />
      <ChartsYAxis axisId="wind" label="Wind m/s" />
      <ChartsTooltip />
    </ChartsContainer>
  );
}

export default function WeatherComposition() {
  return (
    <Stack spacing={1} sx={{ width: '100%' }}>
      <Stack spacing={0} sx={{ width: '100%' }}>
        <ForecastChart />
        <Box sx={{ mt: 1 }}>
          <WindChart />
        </Box>
      </Stack>
      <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', rowGap: 0.5 }}>
        <LegendItem color="#c21807" label="Temperature C" />
        <LegendItem color="#1565c0" label="Precipitation mm" />
        <LegendItem color="#64b5f6" label="Max precip. mm" hatch />
        <LegendItem color="#7e22ce" label="Wind m/s" />
        <LegendItem color="#7c4dff" label="Wind gust m/s" dashed />
      </Stack>
    </Stack>
  );
}
