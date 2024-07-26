import * as React from 'react';
import Typography from '@mui/material/Typography';
import { BarPlot } from '@mui/x-charts/BarChart';
import { LineHighlightPlot, LinePlot } from '@mui/x-charts/LineChart';
import { ResponsiveChartContainer } from '@mui/x-charts/ResponsiveChartContainer';
import { AllSeriesType } from '@mui/x-charts/models';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { ChartsTooltip } from '@mui/x-charts/ChartsTooltip';
import { ChartsAxisHighlight } from '@mui/x-charts/ChartsAxisHighlight';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import alphabetStock from '../dataset/GOOGL.json';

const series = [
  {
    type: 'bar',
    yAxisId: 'volume',
    label: 'Volume',
    color: 'lightgray',
    data: alphabetStock.map((day) => day.volume),
    highlightScope: { highlight: 'item' },
  },
  {
    type: 'line',
    yAxisId: 'price',
    color: 'red',
    label: 'Low',
    data: alphabetStock.map((day) => day.low),
    highlightScope: { highlight: 'item' },
  },
  {
    type: 'line',
    yAxisId: 'price',
    color: 'green',
    label: 'High',
    data: alphabetStock.map((day) => day.high),
  },
] as AllSeriesType[];

export default function Combining() {
  return (
    <div style={{ width: '100%' }}>
      <Typography>Alphabet stocks</Typography>
      <div>
        <ResponsiveChartContainer
          series={series}
          height={400}
          margin={{ top: 10 }}
          xAxis={[
            {
              id: 'date',
              data: alphabetStock.map((day) => new Date(day.date)),
              scaleType: 'band',
              valueFormatter: (value) => value.toLocaleDateString(),
            },
          ]}
          yAxis={[
            {
              id: 'price',
              scaleType: 'linear',
            },
            {
              id: 'volume',
              scaleType: 'linear',
              valueFormatter: (value) => `${(value / 1000000).toLocaleString()}M`,
            },
          ]}
        >
          <ChartsAxisHighlight x="line" />
          <BarPlot />
          <LinePlot />

          <LineHighlightPlot />
          <ChartsXAxis
            label="date"
            position="bottom"
            axisId="date"
            tickInterval={(value, index) => {
              return index % 30 === 0;
            }}
            tickLabelStyle={{
              fontSize: 10,
            }}
          />
          <ChartsYAxis
            label="Price (USD)"
            position="left"
            axisId="price"
            tickLabelStyle={{ fontSize: 10 }}
            sx={{
              [`& .${axisClasses.label}`]: {
                transform: 'translateX(-5px)',
              },
            }}
          />
          <ChartsYAxis
            label="Volume"
            position="right"
            axisId="volume"
            tickLabelStyle={{ fontSize: 10 }}
            sx={{
              [`& .${axisClasses.label}`]: {
                transform: 'translateX(5px)',
              },
            }}
          />
          <ChartsTooltip />
        </ResponsiveChartContainer>
      </div>
    </div>
  );
}
