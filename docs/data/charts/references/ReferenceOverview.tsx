import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { alpha, useTheme } from '@mui/material/styles';
import { ChartsReferenceLine } from '@mui/x-charts-pro/ChartsReferenceLine';
import { ChartsDataProviderPro } from '@mui/x-charts-pro/ChartsDataProviderPro';
import { ChartsSurface } from '@mui/x-charts-pro/ChartsSurface';
import { LinePlot } from '@mui/x-charts-pro/LineChart';
import { ChartsXAxis } from '@mui/x-charts-pro/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts-pro/ChartsYAxis';
import { ChartsTooltip } from '@mui/x-charts-pro/ChartsTooltip';
import { ChartsGrid } from '@mui/x-charts-pro/ChartsGrid';
import { ChartZoomSlider } from '@mui/x-charts-pro/ChartZoomSlider';
import { ChartsClipPath } from '@mui/x-charts-pro/ChartsClipPath';
import { ChartsAxisHighlight } from '@mui/x-charts/ChartsAxisHighlight';
import { ChartsLegend } from '@mui/x-charts-pro/ChartsLegend';
import { usaUnemploymentAndGdp } from '../dataset/usaUnemploymentAndGdp';
import { useReferencePoint } from './ReferencePoint';
import { ReferenceArea } from './ReferenceArea';

type RecessionPeriod = {
  start: Date;
  end: Date;
  label: string;
};

type Election = {
  year: number;
  label: string;
};

const recessions: RecessionPeriod[] = [
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

const elections: Election[] = [
  { year: 2001, label: 'George\nW. Bush' },
  { year: 2009, label: 'Barack\nObama' },
  { year: 2017, label: 'Donald\nTrump' },
  { year: 2021, label: 'Joe\nBiden' },
  { year: 2025, label: 'Donald\nTrump' },
];

function AreaWithLabel(period: RecessionPeriod) {
  const theme = useTheme();
  const labelFill = alpha(theme.palette.text.primary, 0.7);

  const xStart = useReferencePoint({ x: period.start.getTime() });
  const xEnd = useReferencePoint({ x: period.end.getTime() });

  return (
    <React.Fragment>
      <ReferenceArea
        x1={period.start.getTime()}
        x2={period.end.getTime()}
        fill="grey"
        opacity={0.2}
      />
      {xStart.x !== xEnd.x && (
        <text
          x={xStart.x}
          y={xStart.y - 5}
          textAnchor="start"
          dominantBaseline="auto"
          fill={labelFill}
          fontSize="0.8rem"
          fontWeight={500}
          pointerEvents="none"
        >
          {period.label}
        </text>
      )}
    </React.Fragment>
  );
}

function ElectionMarker(election: Election) {
  return (
    <ChartsReferenceLine
      x={new Date(election.year, 0, 20).getTime()}
      key={election.year}
      label={election.label}
      labelAlign="start"
      lineStyle={{
        strokeDasharray: '2 2',
      }}
      labelStyle={{
        textAnchor: 'end',
        dominantBaseline: 'hanging',
        fontSize: 10,
        rotate: '270deg',
        transformOrigin: 'top right',
        transformBox: 'fill-box',
      }}
    />
  );
}

export default function ReferenceOverview() {
  const clipPathId = React.useId();
  return (
    <Box sx={{ width: '100%' }}>
      <Typography sx={{
        textAlign: "center"
      }}>
        US unemployment rate comparison with GDP per capita
      </Typography>
      <ChartsDataProviderPro
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
          {recessions.map((period) => (
            <AreaWithLabel key={period.start.toString()} {...period} />
          ))}

          <ChartsGrid horizontal />
          <g clipPath={`url(#${clipPathId})`}>
            <LinePlot />
            <ChartsAxisHighlight x="line" />

            {elections.map((election) => (
              <ElectionMarker key={election.year} {...election} />
            ))}
          </g>

          <ChartsXAxis />
          <ChartsYAxis axisId="unemployment-axis" label="Unemployment Rate" />
          <ChartsYAxis axisId="gdp-axis" label="GDP per capita in US$" />
          <ChartZoomSlider />
        </ChartsSurface>
        <ChartsTooltip />
      </ChartsDataProviderPro>
      <Typography
        variant="caption"
        component="p"
        sx={{
          color: "text.secondary",
          textAlign: "left",
          pt: 1
        }}>
        Source: FRED
      </Typography>
    </Box>
  );
}
