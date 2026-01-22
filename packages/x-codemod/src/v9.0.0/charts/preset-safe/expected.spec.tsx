// @ts-nocheck
/* eslint-disable */
import * as React from 'react';
import { SankeyChart } from '@mui/x-charts-pro/SankeyChart';
import { ChartsContainer } from '@mui/x-charts';
import { LineChart } from '@mui/x-charts/LineChart';
import {
  AllSeriesType,
  DefaultizedSeriesType,
  CartesianChartSeriesType,
  StackableChartSeriesType,
} from '@mui/x-charts/models';

// Use this space to add tests that touch multiple codemods in the preset-safe package
// It is important to ensure that the codemods don't conflict with each other
// For example, if one codemod changes a prop name, another codemod modifying its value should work too.
// Don't hesitate to add props on existing components.

// prettier-ignore
<div>
  <Heatmap series={[{}]} hideLegend />
  <HeatmapPremium series={[{}]} hideLegend={false} />
  <Heatmap hideLegend series={[{}]} />
  <HeatmapPremium hideLegend {...otherProps} />
  <PieArc seriesId="test" />
  <SankeyChart series={{}} />
  <LineChart
    series={[
      {
        data: [1, 2, 3],
        showMark: true,
      },
    ]}
  />
  <ChartsDataProvider
    series={[
      {
        type: 'line',
        data: [1, 2, 3],
        showMark: true,
      },
    ]}
  />
  <ChartsContainer />
</div>

function processCartesian(series: AllSeriesType<CartesianChartSeriesType>) {
  console.log(series);
}

function processDefaultizedCartesian(series: DefaultizedSeriesType<CartesianChartSeriesType>) {
  console.log(series);
}

function processStackable(series: DefaultizedSeriesType<StackableChartSeriesType>) {
  console.log(series);
}

function processAll(series: AllSeriesType) {
  if (series.type === 'bar') {
    console.log('bar series');
  }
  if (series.type === 'bar') {
    console.log('defaultized bar series');
  }
}
