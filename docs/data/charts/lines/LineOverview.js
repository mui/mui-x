import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { alpha, useTheme } from '@mui/material/styles';
import { ChartDataProviderPro } from '@mui/x-charts-pro/ChartDataProviderPro';
import { ChartsSurface } from '@mui/x-charts-pro/ChartsSurface';
import { LinePlot } from '@mui/x-charts-pro/LineChart';
import { ChartsXAxis } from '@mui/x-charts-pro/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts-pro/ChartsYAxis';
import { useDrawingArea, useXScale } from '@mui/x-charts-pro/hooks';
import { ChartsTooltip } from '@mui/x-charts-pro/ChartsTooltip';
import { ChartsGrid } from '@mui/x-charts-pro/ChartsGrid';
import { ChartZoomSlider } from '@mui/x-charts-pro/ChartZoomSlider';
import { ChartsClipPath } from '@mui/x-charts-pro/ChartsClipPath';
import { ChartsAxisHighlight } from '@mui/x-charts/ChartsAxisHighlight';
import { ChartsLegend } from '@mui/x-charts-pro/ChartsLegend';
import { usaUnemploymentAndGdp } from '../dataset/usaUnemploymentAndGdp';

const recessions = [
  {
    start: new Date('2001-03-01'),
    end: new Date('2001-11-01'),
    label: 'Early 2000s',
  },
  {
    start: new Date('2007-12-01'),
    end: new Date('2009-06-01'),
    label: 'Great Recession',
  },
  { start: new Date('2020-02-01'), end: new Date('2020-04-01'), label: 'COVID-19' },
];

function RecessionBands({ periods }) {
  const { top, left, width, height } = useDrawingArea();
  const xScale = useXScale();
  const theme = useTheme();
  const labelFill = alpha(theme.palette.text.primary, 0.7);

  return (
    <g>
      {periods.map((p, index) => {
        const xStart = xScale(p.start.getTime());
        const xEnd = xScale(p.end.getTime());

        if (xStart === undefined || xEnd === undefined) {
          return null;
        }

        // Stick to the left of the drawing area boundaries
        let textX;
        if (xStart >= left && xStart <= left + width) {
          textX = xStart;
        } else if (xEnd >= left && xEnd <= left + width) {
          textX = left;
        } else {
          return null;
        }

        return (
          <React.Fragment key={index}>
            <rect
              x={textX}
              y={top}
              width={Math.min(xEnd, left + width) - textX}
              height={height}
              fill="grey"
              opacity={0.2}
            />
            <text
              x={textX}
              y={top - 5}
              textAnchor="start"
              dominantBaseline="auto"
              fill={labelFill}
              fontSize="0.8rem"
              fontWeight={500}
              pointerEvents="none"
            >
              {p.label}
            </text>
          </React.Fragment>
        );
      })}
    </g>
  );
}

export default function LineOverview() {
  const clipPathId = React.useId();
  return (
    <Box sx={{ width: '100%' }}>
      <Typography textAlign="center">
        US unemployment rate comparison with GDP per capita
      </Typography>

      <ChartDataProviderPro
        height={300}
        experimentalFeatures={{ preferStrictDomainInLineCharts: true }}
        dataset={usaUnemploymentAndGdp}
        series={[
          {
            type: 'line',
            id: 'unemployment',
            dataKey: 'unemploymentRate',
            label: 'Unemployment rate',
            color: '#af3838',
            yAxisId: 'unemployment-axis',
            valueFormatter: (value) => (value == null ? '' : `${value.toFixed(1)}%`),
          },
          {
            type: 'line',
            dataKey: 'gdpPerCapita',
            label: 'GDP per capita',
            color: '#4caf50',
            yAxisId: 'gdp-axis',
            connectNulls: true,
            valueFormatter: (value) =>
              value == null ? '' : `${(value / 1000).toFixed(1)}k`,
          },
        ]}
        xAxis={[
          {
            scaleType: 'time',
            dataKey: 'date',
            tickNumber: 4,
            valueFormatter: (date, context) => {
              if (context.location !== 'tick') {
                return date.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                });
              }
              return date.getMonth() === 0
                ? date.toLocaleDateString('en-US', {
                    year: 'numeric',
                  })
                : date.toLocaleDateString('en-US', {
                    month: 'short',
                  });
            },
            zoom: {
              slider: { enabled: true },
            },
          },
        ]}
        yAxis={[
          {
            id: 'unemployment-axis',
            scaleType: 'linear',
            valueFormatter: (value) => `${value}%`,
            width: 55,
            position: 'left',
          },
          {
            id: 'gdp-axis',
            scaleType: 'linear',
            width: 50,
            position: 'right',
            valueFormatter: (value) => `${(value / 1000).toLocaleString()}k`,
          },
        ]}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
          <ChartsLegend />
        </Box>
        <ChartsSurface>
          <ChartsClipPath id={clipPathId} />
          <RecessionBands periods={recessions} />
          <ChartsGrid horizontal />
          <g clipPath={`url(#${clipPathId})`}>
            <LinePlot />
          </g>
          <ChartsXAxis />
          <ChartsYAxis axisId="unemployment-axis" label="Unemployment Rate" />
          <ChartsYAxis axisId="gdp-axis" label="GDP per capita in US$" />
          <ChartsAxisHighlight x="line" />
          <ChartZoomSlider />
        </ChartsSurface>
        <ChartsTooltip />
      </ChartDataProviderPro>

      <Typography
        variant="caption"
        component="p"
        color="text.secondary"
        textAlign="left"
        sx={{ pt: 1 }}
      >
        Source: FRED
      </Typography>
    </Box>
  );
}
