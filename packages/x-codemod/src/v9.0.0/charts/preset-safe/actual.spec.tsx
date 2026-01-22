// @ts-nocheck
/* eslint-disable */
import * as React from 'react';
import { Unstable_SankeyChart } from '@mui/x-charts-pro/SankeyChart';
import { ChartContainer } from '@mui/x-charts';
import { LineChart } from '@mui/x-charts/LineChart';
import {
  CartesianSeriesType,
  DefaultizedCartesianSeriesType,
  StackableSeriesType,
  AllSeriesType,
  isBarSeries,
  isDefaultizedBarSeries,
} from '@mui/x-charts/models';

// Use this space to add tests that touch multiple codemods in the preset-safe package
// It is important to ensure that the codemods don't conflict with each other
// For example, if one codemod changes a prop name, another codemod modifying its value should work too.
// Don't hesitate to add props on existing components.

// prettier-ignore
<div>
  <Heatmap series={[{}]} hideLegend />
  <HeatmapPremium series={[{}]} hideLegend={false} />
  <Heatmap series={[{}]} />
  <HeatmapPremium {...otherProps} />
  <PieArc id="test" />
  <Unstable_SankeyChart series={{}} />
  <LineChart series={[{ data: [1, 2, 3] }]} />
  <ChartsDataProvider series={[{ type: 'line', data: [1, 2, 3] }]} />
  <ChartContainer />
</div>

function processCartesian(series: CartesianSeriesType) {
  console.log(series);
}

function processDefaultizedCartesian(series: DefaultizedCartesianSeriesType) {
  console.log(series);
}

function processStackable(series: StackableSeriesType) {
  console.log(series);
}

function processAll(series: AllSeriesType) {
  if (isBarSeries(series)) {
    console.log('bar series');
  }
  if (isDefaultizedBarSeries(series)) {
    console.log('defaultized bar series');
  }
}
