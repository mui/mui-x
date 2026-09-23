import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useDrawingArea, useXScale, useYScale } from '@mui/x-charts/hooks';
import { forecast } from '../dataset/weatherForecast';

export function WeatherIcon({ type }) {
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

export function DayAndTimeHeader() {
  const xScale = useXScale();
  const { top, height } = useDrawingArea();
  const theme = useTheme();

  // Get the start/end time value grouped per day.
  const days = React.useMemo(() => {
    return xScale.domain().reduce((acc, date) => {
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
    }, []);
  }, [xScale]);

  return (
    <g fontSize={12} fill={theme.palette.text.secondary}>
      {days.map(({ start, end }, dayIndex) => {
        const endDay =
          xScale(end) + xScale.step() - (xScale.step() - xScale.bandwidth()) / 2;
        const middleDay = (xScale(end) + xScale(start)) / 2;

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
                strokeDasharray="8 8"
                opacity={0.5}
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

export function WeatherMarkers() {
  const xScale = useXScale();
  const yScale = useYScale('temperature');

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

export function MaxPrecipitationBars() {
  const xScale = useXScale();
  const yScale = useYScale('precipitation');
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

export function LegendItem({ color, label, dashed = false, hatch = false }) {
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
