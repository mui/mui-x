import * as React from 'react';
import Typography from '@mui/material/Typography';
import { BarPlot } from '@mui/x-charts/BarChart';
import { LineHighlightPlot, LinePlot } from '@mui/x-charts/LineChart';
import { ChartContainer } from '@mui/x-charts/ChartContainer';

import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { ChartsTooltip } from '@mui/x-charts/ChartsTooltip';
import { ChartsAxisHighlight } from '@mui/x-charts/ChartsAxisHighlight';
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
];

export default function Combining() {
  return (
    <div style={{ width: '100%' }}>
      <Typography>Alphabet stocks</Typography>
      <div>
        <ChartContainer
          series={series}
          height={400}
          xAxis={[
            {
              id: 'date',
              data: alphabetStock.map((day) => new Date(day.date)),
              scaleType: 'band',
              valueFormatter: (value) => value.toLocaleDateString(),
              height: 40,
            },
          ]}
          yAxis={[
            { id: 'price', scaleType: 'linear', position: 'left', width: 50 },
            {
              id: 'volume',
              scaleType: 'linear',
              position: 'right',
              valueFormatter: (value) => `${(value / 1000000).toLocaleString()}M`,
              width: 55,
            },
          ]}
        >
          <ChartsAxisHighlight x="line" />
          <BarPlot />
          <LinePlot />
          <LineHighlightPlot />
          <ChartsXAxis
            label="Date"
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
            axisId="price"
            tickLabelStyle={{ fontSize: 10 }}
          />
          <ChartsYAxis
            label="Volume"
            axisId="volume"
            tickLabelStyle={{ fontSize: 10 }}
          />
          <ChartsTooltip />
        </ChartContainer>
      </div>
    </div>
  );
}
